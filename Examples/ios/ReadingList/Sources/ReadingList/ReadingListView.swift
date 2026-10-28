import SwiftUI

/// The screen. It renders `model.state` and forwards taps; it holds no state of its own.
public struct ReadingListView: View {
    let model: ReadingListModel

    public init(model: ReadingListModel) {
        self.model = model
    }

    public var body: some View {
        NavigationStack {
            content
                .navigationTitle("Reading list")
                .toolbar {
                    if model.unreadCount > 0 {
                        ToolbarItem(placement: .automatic) {
                            Text("\(model.unreadCount) unread")
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .safeAreaInset(edge: .bottom) {
                    if let saveError = model.saveError {
                        Text(saveError)
                            .font(.callout)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(.tint.opacity(0.15), in: .rect(cornerRadius: 12))
                            .padding()
                            .accessibilityAddTraits(.isStaticText)
                    }
                }
        }
        .task { await model.load() }
    }

    @ViewBuilder
    private var content: some View {
        switch model.state {
        case .idle, .loading:
            ProgressView("Loading")
        case .empty:
            ContentUnavailableView(
                "Nothing saved yet", systemImage: "books.vertical",
                description: Text("Articles you save appear here."))
        case .failed(let message):
            ContentUnavailableView {
                Label("Not loaded", systemImage: "wifi.exclamationmark")
            } description: {
                Text(message)
            } actions: {
                Button("Retry") { Task { await model.load() } }
                    .buttonStyle(.borderedProminent)
            }
        case .loaded(let articles):
            List(articles) { article in
                ArticleRow(article: article) {
                    Task { await model.toggleRead(article.id) }
                }
            }
        }
    }
}

private struct ArticleRow: View {
    let article: Article
    let toggle: () -> Void

    var body: some View {
        Button(action: toggle) {
            HStack {
                Image(systemName: article.isRead ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(article.isRead ? Color.accentColor : .secondary)
                    .imageScale(.large)
                Text(article.title)
                    .foregroundStyle(article.isRead ? .secondary : .primary)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(article.title)
        .accessibilityValue(article.isRead ? "Read" : "Unread")
        .accessibilityHint("Double-tap to mark as \(article.isRead ? "unread" : "read").")
    }
}
