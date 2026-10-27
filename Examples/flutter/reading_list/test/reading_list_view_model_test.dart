import 'package:flutter_test/flutter_test.dart';
import 'package:reading_list/reading_list.dart';

import 'controlled_repository.dart';

void main() {
  late ControlledRepository repository;
  late ReadingListViewModel viewModel;

  setUp(() {
    repository = ControlledRepository();
    viewModel = ReadingListViewModel(repository);
  });

  Future<void> loadArticles() async {
    final load = viewModel.load();
    repository.completeFetch(articles);
    await load;
  }

  bool? isRead(String id) => switch (viewModel.state) {
    ReadingListLoaded(articles: final list) =>
      list.firstWhere((a) => a.id == id).isRead,
    _ => null,
  };

  group('loading', () {
    test(
      'a successful load shows the articles and counts the unread ones',
      () async {
        final load = viewModel.load();
        expect(viewModel.state, isA<ReadingListLoading>());
        repository.completeFetch(articles);
        await load;
        expect(viewModel.state, ReadingListLoaded(articles));
        expect(viewModel.unreadCount, 2);
      },
    );

    test('an empty answer shows the empty state', () async {
      final load = viewModel.load();
      repository.completeFetch([]);
      await load;
      expect(viewModel.state, isA<ReadingListEmpty>());
      expect(viewModel.unreadCount, 0);
    });

    test('a failure shows a fixed message instead of the error text', () async {
      final load = viewModel.load();
      repository.failFetch(Exception('https://api.internal/?token=abc'));
      await load;
      expect(
        viewModel.state,
        const ReadingListFailed(ReadingListViewModel.loadFailedMessage),
      );
    });

    test('retry after a failure loads again', () async {
      final first = viewModel.load();
      repository.failFetch(Exception('offline'));
      await first;
      await loadArticles();
      expect(viewModel.state, ReadingListLoaded(articles));
      expect(repository.fetchCount, 2);
    });

    test(
      'a second load while one is running sends no second request',
      () async {
        final first = viewModel.load();
        await viewModel.load();
        expect(repository.fetchCount, 1);
        repository.completeFetch(articles);
        await first;
        expect(viewModel.state, ReadingListLoaded(articles));
      },
    );

    test('a load that finishes after dispose does not throw', () async {
      final load = viewModel.load();
      viewModel.dispose();
      repository.completeFetch(articles);
      await expectLater(load, completes);
    });
  });

  group('marking as read', () {
    test('the change shows at once and the new value is saved', () async {
      await loadArticles();
      final toggle = viewModel.toggleRead('a');
      expect(isRead('a'), isTrue);
      expect(viewModel.unreadCount, 1);
      repository.completeSave('a');
      await toggle;
      expect(isRead('a'), isTrue);
      expect(viewModel.saveError, isNull);
      expect(repository.saves, [('a', true)]);
    });

    test('a failed save puts the article back and explains why', () async {
      await loadArticles();
      final toggle = viewModel.toggleRead('b');
      expect(isRead('b'), isFalse);
      repository.failSave('b', Exception('500'));
      await toggle;
      expect(isRead('b'), isTrue);
      expect(viewModel.saveError, ReadingListViewModel.saveFailedMessage);
    });

    test('a failed save only undoes its own article', () async {
      await loadArticles();
      final first = viewModel.toggleRead('a');
      final second = viewModel.toggleRead('c');
      repository.failSave('a', Exception('timeout'));
      repository.completeSave('c');
      await Future.wait([first, second]);
      expect(isRead('a'), isFalse);
      expect(isRead('c'), isTrue);
    });

    test(
      'a toggle while the same article is still saving is ignored',
      () async {
        await loadArticles();
        final first = viewModel.toggleRead('a');
        await viewModel.toggleRead('a');
        expect(isRead('a'), isTrue);
        repository.completeSave('a');
        await first;
        expect(repository.saves, hasLength(1));
      },
    );

    test('the next toggle clears an earlier save error', () async {
      await loadArticles();
      final failing = viewModel.toggleRead('a');
      repository.failSave('a', Exception('x'));
      await failing;
      expect(viewModel.saveError, isNotNull);
      final next = viewModel.toggleRead('c');
      expect(viewModel.saveError, isNull);
      repository.completeSave('c');
      await next;
    });

    test(
      'unknown articles and lists that are not loaded are left alone',
      () async {
        await viewModel.toggleRead('a');
        expect(viewModel.state, isA<ReadingListIdle>());
        await loadArticles();
        await viewModel.toggleRead('missing');
        expect(viewModel.state, ReadingListLoaded(articles));
        expect(repository.saves, isEmpty);
      },
    );
  });

  test('SampleRepository keeps saves for the next fetch', () async {
    final sample = SampleRepository(articles: articles);
    await sample.setRead('a', isRead: true);
    await sample.setRead('unknown', isRead: true);
    final fetched = await sample.fetchArticles();
    expect(fetched.firstWhere((a) => a.id == 'a').isRead, isTrue);
    expect(fetched, hasLength(articles.length));
  });
}
