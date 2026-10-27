import 'article.dart';

/// The data layer as the feature sees it. The view model depends on this interface only, so tests
/// pass a fake and an app passes a network or database implementation.
abstract interface class ArticleRepository {
  Future<List<Article>> fetchArticles();
  Future<void> setRead(String articleId, {required bool isRead});
}

/// In-memory repository for demos and previews.
class SampleRepository implements ArticleRepository {
  SampleRepository({List<Article>? articles, this.delay = Duration.zero})
    : _articles = List.of(articles ?? demoArticles);

  final Duration delay;
  final List<Article> _articles;

  static const demoArticles = [
    Article(
      id: 'observation',
      title: 'Managing model data in your app',
      isRead: true,
    ),
    Article(
      id: 'scenes',
      title: 'Migrating to the UIKit scene-based life cycle',
    ),
    Article(id: 'concurrency', title: 'Swift 6 migration guide'),
    Article(id: 'flutter', title: 'Guide to app architecture (Flutter)'),
    Article(id: 'react', title: 'Managing state (React)'),
  ];

  @override
  Future<List<Article>> fetchArticles() async {
    await Future<void>.delayed(delay);
    return List.unmodifiable(_articles);
  }

  @override
  Future<void> setRead(String articleId, {required bool isRead}) async {
    await Future<void>.delayed(delay);
    final index = _articles.indexWhere((article) => article.id == articleId);
    if (index == -1) return;
    _articles[index] = _articles[index].copyWith(isRead: isRead);
  }
}
