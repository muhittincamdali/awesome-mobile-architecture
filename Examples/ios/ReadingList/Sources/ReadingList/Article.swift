/// One saved article. Value type, so a state snapshot can never change behind the view's back.
public struct Article: Identifiable, Equatable, Sendable {
    public let id: String
    public var title: String
    public var isRead: Bool

    public init(id: String, title: String, isRead: Bool = false) {
        self.id = id
        self.title = title
        self.isRead = isRead
    }
}

/// The data layer as the feature sees it. The view model depends on this protocol only, so tests
/// and previews pass a fake and the app passes a network or database implementation.
public protocol ArticleRepository: Sendable {
    func fetchArticles() async throws -> [Article]
    func setRead(_ isRead: Bool, articleID: Article.ID) async throws
}
