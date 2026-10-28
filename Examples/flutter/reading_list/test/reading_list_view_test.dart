import 'package:flutter/material.dart';
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

  Future<void> pumpView(WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(home: ReadingListView(viewModel: viewModel)),
    );
  }

  testWidgets('shows progress, then the articles with the unread count', (
    tester,
  ) async {
    await pumpView(tester);
    final load = viewModel.load();
    await tester.pump();
    expect(find.bySemanticsLabel('Loading'), findsOneWidget);

    repository.completeFetch(articles);
    await load;
    await tester.pump();
    expect(find.text('First'), findsOneWidget);
    expect(find.text('Third'), findsOneWidget);
    expect(find.text('2 unread'), findsOneWidget);
  });

  testWidgets(
    'tapping a row marks it read and a failed save shows the banner',
    (tester) async {
      await pumpView(tester);
      final load = viewModel.load();
      repository.completeFetch(articles);
      await load;
      await tester.pump();

      await tester.tap(find.text('First'));
      await tester.pump();
      expect(find.text('1 unread'), findsOneWidget);

      repository.failSave('a', Exception('500'));
      await tester.pump();
      expect(find.text('2 unread'), findsOneWidget);
      expect(find.text(ReadingListViewModel.saveFailedMessage), findsOneWidget);
    },
  );

  testWidgets('a failed load offers Retry, which loads again', (tester) async {
    await pumpView(tester);
    final load = viewModel.load();
    repository.failFetch(Exception('offline'));
    await load;
    await tester.pump();
    expect(find.text(ReadingListViewModel.loadFailedMessage), findsOneWidget);

    await tester.tap(find.text('Retry'));
    await tester.pump();
    expect(repository.fetchCount, 2);
    repository.completeFetch([]);
    await tester.pump();
    expect(find.text('Nothing saved yet'), findsOneWidget);
  });
}
