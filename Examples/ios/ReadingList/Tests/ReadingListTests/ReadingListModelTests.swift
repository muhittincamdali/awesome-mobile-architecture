import Testing

@testable import ReadingList

private let articles = [
    Article(id: "a", title: "First"),
    Article(id: "b", title: "Second", isRead: true),
    Article(id: "c", title: "Third"),
]

@MainActor
@Suite("Loading")
struct LoadingTests {
    let repository = ControlledRepository()

    @Test("A successful load shows the articles and counts the unread ones")
    func loadsArticles() async throws {
        let model = ReadingListModel(repository: repository)
        async let load: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        #expect(model.state == .loading)

        await repository.completeFetch(.success(articles))
        await load
        #expect(model.state == .loaded(articles))
        #expect(model.unreadCount == 2)
    }

    @Test("An empty answer shows the empty state, not an empty list")
    func showsEmptyState() async throws {
        let model = ReadingListModel(repository: repository)
        async let load: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        await repository.completeFetch(.success([]))
        await load
        #expect(model.state == .empty)
        #expect(model.unreadCount == 0)
    }

    @Test("A failure shows a fixed message instead of the error's own text")
    func hidesErrorDetails() async throws {
        let model = ReadingListModel(repository: repository)
        async let load: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        await repository.completeFetch(.failure(TestError(detail: "https://api.internal/token=abc")))
        await load
        #expect(model.state == .failed(message: ReadingListModel.loadFailedMessage))
    }

    @Test("Retry after a failure loads again")
    func retries() async throws {
        let model = ReadingListModel(repository: repository)
        async let first: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        await repository.completeFetch(.failure(TestError(detail: "offline")))
        await first

        async let second: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        await repository.completeFetch(.success(articles))
        await second
        #expect(model.state == .loaded(articles))
        #expect(await repository.fetchCount == 2)
    }

    @Test("A second load while one is running sends no second request")
    func ignoresOverlappingLoad() async throws {
        let model = ReadingListModel(repository: repository)
        async let first: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        await model.load()
        #expect(await repository.fetchCount == 1)

        await repository.completeFetch(.success(articles))
        await first
        #expect(model.state == .loaded(articles))
    }
}

@MainActor
@Suite("Marking as read")
struct ToggleTests {
    let repository = ControlledRepository()

    private func loadedModel() async throws -> ReadingListModel {
        let model = ReadingListModel(repository: repository)
        async let load: Void = model.load()
        try await waitUntil { await repository.pendingFetches == 1 }
        await repository.completeFetch(.success(articles))
        await load
        return model
    }

    private func isRead(_ model: ReadingListModel, _ id: String) -> Bool? {
        guard case .loaded(let list) = model.state else { return nil }
        return list.first { $0.id == id }?.isRead
    }

    @Test("The change shows at once and the new value is saved")
    func savesToggle() async throws {
        let model = try await loadedModel()
        async let toggle: Void = model.toggleRead("a")
        try await waitUntil { await repository.pendingSaves == ["a"] }
        #expect(isRead(model, "a") == true)
        #expect(model.unreadCount == 1)

        await repository.completeSave("a", .success(()))
        await toggle
        #expect(isRead(model, "a") == true)
        #expect(model.saveError == nil)
        #expect(await repository.saves == [.init(id: "a", isRead: true)])
    }

    @Test("A failed save puts the article back and explains why")
    func rollsBack() async throws {
        let model = try await loadedModel()
        async let toggle: Void = model.toggleRead("b")
        try await waitUntil { await repository.pendingSaves == ["b"] }
        #expect(isRead(model, "b") == false)

        await repository.completeSave("b", .failure(TestError(detail: "500")))
        await toggle
        #expect(isRead(model, "b") == true)
        #expect(model.saveError == ReadingListModel.saveFailedMessage)
    }

    @Test("A failed save only undoes its own article, not a toggle made meanwhile")
    func rollbackKeepsOtherChanges() async throws {
        let model = try await loadedModel()
        async let first: Void = model.toggleRead("a")
        async let second: Void = model.toggleRead("c")
        try await waitUntil { await repository.pendingSaves == ["a", "c"] }

        await repository.completeSave("a", .failure(TestError(detail: "timeout")))
        await repository.completeSave("c", .success(()))
        _ = await (first, second)
        #expect(isRead(model, "a") == false)
        #expect(isRead(model, "c") == true)
        #expect(model.saveError == ReadingListModel.saveFailedMessage)
    }

    @Test("A toggle while the same article is still saving is ignored")
    func ignoresToggleDuringSave() async throws {
        let model = try await loadedModel()
        async let first: Void = model.toggleRead("a")
        try await waitUntil { await repository.pendingSaves == ["a"] }
        await model.toggleRead("a")
        #expect(isRead(model, "a") == true)

        await repository.completeSave("a", .success(()))
        await first
        #expect(await repository.saves.count == 1)
    }

    @Test("The next toggle clears an earlier save error")
    func clearsSaveError() async throws {
        let model = try await loadedModel()
        async let failing: Void = model.toggleRead("a")
        try await waitUntil { await repository.pendingSaves == ["a"] }
        await repository.completeSave("a", .failure(TestError(detail: "x")))
        await failing
        #expect(model.saveError != nil)

        async let next: Void = model.toggleRead("c")
        try await waitUntil { await repository.pendingSaves == ["c"] }
        #expect(model.saveError == nil)
        await repository.completeSave("c", .success(()))
        await next
    }

    @Test("Unknown articles and lists that are not loaded are left alone")
    func ignoresInvalidToggles() async throws {
        let idle = ReadingListModel(repository: repository)
        await idle.toggleRead("a")
        #expect(idle.state == .idle)

        let model = try await loadedModel()
        await model.toggleRead("missing")
        #expect(model.state == .loaded(articles))
        #expect(await repository.saves.isEmpty)
    }
}

@Suite("Sample repository")
struct SampleRepositoryTests {
    @Test("Saves are kept for the next fetch")
    func persistsInMemory() async throws {
        let repository = SampleRepository(articles: articles)
        try await repository.setRead(true, articleID: "a")
        try await repository.setRead(false, articleID: "unknown")
        let fetched = try await repository.fetchArticles()
        #expect(fetched.first { $0.id == "a" }?.isRead == true)
        #expect(fetched.count == articles.count)
    }
}
