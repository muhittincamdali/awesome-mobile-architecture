import Observation

/// View model for the reading list. All state changes go through its methods and run on the main
/// actor, so the view only reads `state` and `saveError` and calls `load` or `toggleRead`.
@MainActor
@Observable
public final class ReadingListModel {
    public enum State: Equatable, Sendable {
        case idle
        case loading
        case loaded([Article])
        case empty
        case failed(message: String)
    }

    public static let loadFailedMessage = "The reading list could not be loaded."
    public static let saveFailedMessage = "The change could not be saved. Try again."

    public private(set) var state: State = .idle
    /// Set when saving a toggle failed and the change was rolled back; cleared by the next toggle.
    public private(set) var saveError: String?

    private let repository: any ArticleRepository
    private var pendingSaves: Set<Article.ID> = []

    public init(repository: any ArticleRepository) {
        self.repository = repository
    }

    public var unreadCount: Int {
        guard case .loaded(let articles) = state else { return 0 }
        return articles.count(where: { !$0.isRead })
    }

    /// Loads the list. A call while a load is running is ignored, so a double tap on Retry or a
    /// view that appears twice does not send two requests.
    public func load() async {
        guard state != .loading else { return }
        state = .loading
        do {
            let articles = try await repository.fetchArticles()
            state = articles.isEmpty ? .empty : .loaded(articles)
        } catch {
            // The repository's error can carry URLs or server text; the screen shows a fixed sentence.
            state = .failed(message: Self.loadFailedMessage)
        }
    }

    /// Flips an article's read flag at once and saves it in the background. When the save fails,
    /// only that article is put back, so other toggles made in the meantime are kept.
    public func toggleRead(_ id: Article.ID) async {
        guard case .loaded(var articles) = state,
            let index = articles.firstIndex(where: { $0.id == id }),
            !pendingSaves.contains(id)
        else { return }

        let newValue = !articles[index].isRead
        articles[index].isRead = newValue
        state = .loaded(articles)
        saveError = nil
        pendingSaves.insert(id)
        defer { pendingSaves.remove(id) }

        do {
            try await repository.setRead(newValue, articleID: id)
        } catch {
            rollBack(id, to: !newValue)
            saveError = Self.saveFailedMessage
        }
    }

    private func rollBack(_ id: Article.ID, to isRead: Bool) {
        guard case .loaded(var articles) = state,
            let index = articles.firstIndex(where: { $0.id == id })
        else { return }
        articles[index].isRead = isRead
        state = .loaded(articles)
    }
}
