import 'package:flutter/foundation.dart';

/// One saved article. Immutable, so a state snapshot never changes behind the widget's back.
@immutable
class Article {
  const Article({required this.id, required this.title, this.isRead = false});

  final String id;
  final String title;
  final bool isRead;

  Article copyWith({bool? isRead}) =>
      Article(id: id, title: title, isRead: isRead ?? this.isRead);

  @override
  bool operator ==(Object other) =>
      other is Article &&
      other.id == id &&
      other.title == title &&
      other.isRead == isRead;

  @override
  int get hashCode => Object.hash(id, title, isRead);

  @override
  String toString() => 'Article($id, read: $isRead)';
}
