import 'package:flutter/foundation.dart';

import 'article.dart';
import 'article_repository.dart';
import 'reading_list_state.dart';

/// View model for the reading list. The widget reads [state] and [saveError] and calls [load] or
/// [toggleRead]; every state change goes through this class.
class ReadingListViewModel extends ChangeNotifier {
  ReadingListViewModel(this._repository);

  static const loadFailedMessage = 'The reading list could not be loaded.';
  static const saveFailedMessage = 'The change could not be saved. Try again.';

  final ArticleRepository _repository;
  final Set<String> _pendingSaves = {};
  bool _disposed = false;

  ReadingListState _state = const ReadingListIdle();
  ReadingListState get state => _state;

  String? _saveError;

  /// Set when saving a toggle failed and the change was rolled back; cleared by the next toggle.
  String? get saveError => _saveError;

  int get unreadCount => switch (_state) {
    ReadingListLoaded(:final articles) =>
      articles.where((a) => !a.isRead).length,
    _ => 0,
  };

  /// Loads the list. A call while a load is running is ignored, so a double tap on Retry does
  /// not send two requests.
  Future<void> load() async {
    if (_state is ReadingListLoading) return;
    _emit(const ReadingListLoading());
    try {
      final articles = await _repository.fetchArticles();
      _emit(
        articles.isEmpty
            ? const ReadingListEmpty()
            : ReadingListLoaded(articles),
      );
    } on Object {
      // The repository's error can carry URLs or server text; the screen shows a fixed sentence.
      _emit(const ReadingListFailed(loadFailedMessage));
    }
  }

  /// Flips an article's read flag at once and saves it. When the save fails, only that article
  /// is put back, so other toggles made in the meantime are kept.
  Future<void> toggleRead(String articleId) async {
    final current = _state;
    if (current is! ReadingListLoaded || _pendingSaves.contains(articleId)) {
      return;
    }
    final index = current.articles.indexWhere((a) => a.id == articleId);
    if (index == -1) return;

    final newValue = !current.articles[index].isRead;
    _saveError = null;
    _pendingSaves.add(articleId);
    _emit(ReadingListLoaded(_withRead(current.articles, articleId, newValue)));
    try {
      await _repository.setRead(articleId, isRead: newValue);
    } on Object {
      final latest = _state;
      if (latest is ReadingListLoaded) {
        _saveError = saveFailedMessage;
        _emit(
          ReadingListLoaded(_withRead(latest.articles, articleId, !newValue)),
        );
      }
    } finally {
      _pendingSaves.remove(articleId);
    }
  }

  static List<Article> _withRead(
    List<Article> articles,
    String id,
    bool isRead,
  ) => [
    for (final article in articles)
      article.id == id ? article.copyWith(isRead: isRead) : article,
  ];

  void _emit(ReadingListState state) {
    _state = state;
    // A request can finish after the screen is gone; notifying a disposed notifier would throw.
    if (!_disposed) notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
