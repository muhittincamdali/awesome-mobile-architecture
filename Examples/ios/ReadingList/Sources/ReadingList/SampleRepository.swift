/// In-memory repository for the example app and previews. An actor, so concurrent saves from the
/// view model cannot race on the stored articles.
public actor SampleRepository: ArticleRepository {
    private var articles: [Article]
    private let delay: Duration

    public init(articles: [Article] = SampleRepository.demoArticles, delay: Duration = .zero) {
        self.articles = articles
        self.delay = delay
    }

    public func fetchArticles() async throws -> [Article] {
        try await Task.sleep(for: delay)
        return articles
    }

    public func setRead(_ isRead: Bool, articleID: Article.ID) async throws {
        try await Task.sleep(for: delay)
        guard let index = articles.firstIndex(where: { $0.id == articleID }) else { return }
        articles[index].isRead = isRead
    }

    public static let demoArticles: [Article] = [
        Article(id: "observation", title: "Managing model data in your app", isRead: true),
        Article(id: "scenes", title: "Migrating to the UIKit scene-based life cycle"),
        Article(id: "concurrency", title: "Swift 6 migration guide"),
        Article(id: "flutter", title: "Guide to app architecture (Flutter)"),
        Article(id: "react", title: "Managing state (React)"),
    ]
}
