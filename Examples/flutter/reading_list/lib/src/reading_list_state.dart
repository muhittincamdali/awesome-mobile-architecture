import 'package:flutter/foundation.dart';

import 'article.dart';

/// Every state the screen can show. Sealed, so a `switch` over it must handle each case.
sealed class ReadingListState {
  const ReadingListState();
}

final class ReadingListIdle extends ReadingListState {
  const ReadingListIdle();
}

final class ReadingListLoading extends ReadingListState {
  const ReadingListLoading();
}

final class ReadingListEmpty extends ReadingListState {
  const ReadingListEmpty();
}

final class ReadingListLoaded extends ReadingListState {
  ReadingListLoaded(List<Article> articles)
    : articles = List.unmodifiable(articles);

  final List<Article> articles;

  @override
  bool operator ==(Object other) =>
      other is ReadingListLoaded && listEquals(other.articles, articles);

  @override
  int get hashCode => Object.hashAll(articles);
}

final class ReadingListFailed extends ReadingListState {
  const ReadingListFailed(this.message);

  final String message;

  @override
  bool operator ==(Object other) =>
      other is ReadingListFailed && other.message == message;

  @override
  int get hashCode => message.hashCode;
}
