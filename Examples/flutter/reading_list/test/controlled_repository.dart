import 'dart:async';

import 'package:reading_list/reading_list.dart';

/// A repository whose calls stay pending until the test completes them, so the test decides the
/// order in which requests finish.
class ControlledRepository implements ArticleRepository {
  int fetchCount = 0;
  final List<(String, bool)> saves = [];
  final List<Completer<List<Article>>> _fetches = [];
  final Map<String, Completer<void>> _saves = {};

  int get pendingFetches => _fetches.length;
  Set<String> get pendingSaves => _saves.keys.toSet();

  @override
  Future<List<Article>> fetchArticles() {
    fetchCount++;
    final completer = Completer<List<Article>>();
    _fetches.add(completer);
    return completer.future;
  }

  @override
  Future<void> setRead(String articleId, {required bool isRead}) {
    saves.add((articleId, isRead));
    final completer = Completer<void>();
    _saves[articleId] = completer;
    return completer.future;
  }

  void completeFetch(List<Article> articles) =>
      _fetches.removeAt(0).complete(articles);

  void failFetch(Object error) => _fetches.removeAt(0).completeError(error);

  void completeSave(String id) => _saves.remove(id)!.complete();

  void failSave(String id, Object error) =>
      _saves.remove(id)!.completeError(error);
}

const articles = [
  Article(id: 'a', title: 'First'),
  Article(id: 'b', title: 'Second', isRead: true),
  Article(id: 'c', title: 'Third'),
];
