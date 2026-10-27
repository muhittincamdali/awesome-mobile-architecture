import ReadingList
import SwiftUI

@main
struct ReadingListApp: App {
    @State private var model = ReadingListModel(repository: Scenario.fromLaunchArguments().repository)

    var body: some Scene {
        WindowGroup {
            ReadingListView(model: model)
        }
    }
}

/// `-scenario empty` or `-scenario failed` on launch shows the other states of the screen; the
/// screenshot script uses it. Without the argument the app shows the demo articles.
enum Scenario: String {
    case loaded, empty, failed

    static func fromLaunchArguments() -> Scenario {
        UserDefaults.standard.string(forKey: "scenario").flatMap(Scenario.init(rawValue:)) ?? .loaded
    }

    var repository: any ArticleRepository {
        switch self {
        case .loaded: SampleRepository(delay: .milliseconds(300))
        case .empty: SampleRepository(articles: [], delay: .milliseconds(300))
        case .failed: UnreachableRepository()
        }
    }
}

/// Fails every call, like a device without a connection.
struct UnreachableRepository: ArticleRepository {
    struct Offline: Error {}

    func fetchArticles() async throws -> [Article] { throw Offline() }
    func setRead(_ isRead: Bool, articleID: Article.ID) async throws { throw Offline() }
}
