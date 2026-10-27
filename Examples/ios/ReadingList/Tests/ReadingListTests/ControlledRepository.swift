import ReadingList

struct TestError: Error {
    let detail: String
}

/// A repository whose calls stay suspended until the test completes them, so a test can decide
/// the order in which requests finish.
actor ControlledRepository: ArticleRepository {
    private(set) var fetchCount = 0
    private(set) var saves: [Save] = []
    private var fetchWaiters: [CheckedContinuation<[Article], any Error>] = []
    private var saveWaiters: [Article.ID: CheckedContinuation<Void, any Error>] = [:]

    struct Save: Equatable {
        let id: Article.ID
        let isRead: Bool
    }

    var pendingFetches: Int { fetchWaiters.count }
    var pendingSaves: Set<Article.ID> { Set(saveWaiters.keys) }

    func fetchArticles() async throws -> [Article] {
        fetchCount += 1
        return try await withCheckedThrowingContinuation { fetchWaiters.append($0) }
    }

    func setRead(_ isRead: Bool, articleID: Article.ID) async throws {
        saves.append(Save(id: articleID, isRead: isRead))
        try await withCheckedThrowingContinuation { saveWaiters[articleID] = $0 }
    }

    func completeFetch(_ result: Result<[Article], any Error>) {
        fetchWaiters.removeFirst().resume(with: result)
    }

    func completeSave(_ id: Article.ID, _ result: Result<Void, any Error>) {
        saveWaiters.removeValue(forKey: id)?.resume(with: result)
    }
}

/// Lets other tasks run until `condition` holds; fails the wait after a bounded number of turns
/// instead of hanging the test run.
@MainActor
func waitUntil(_ condition: () async -> Bool) async throws {
    for _ in 0..<10_000 {
        if await condition() { return }
        await Task.yield()
    }
    throw TestError(detail: "condition not reached")
}
