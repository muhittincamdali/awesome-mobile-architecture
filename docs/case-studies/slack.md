# Slack Mobile Architecture Case Study

An in-depth exploration of Slack's mobile architecture, focusing on real-time messaging, offline support, and multi-workspace management at scale.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Evolution](#architecture-evolution)
3. [Core Architecture](#core-architecture)
4. [Real-Time Messaging](#real-time-messaging)
5. [Data Layer](#data-layer)
6. [Offline Support](#offline-support)
7. [Multi-Workspace Architecture](#multi-workspace-architecture)
8. [Search Implementation](#search-implementation)
9. [Performance Strategies](#performance-strategies)
10. [Lessons Learned](#lessons-learned)

---

## Overview

### Platform Statistics

| Metric | Value |
|--------|-------|
| Daily Active Users | 20M+ |
| Weekly Active Users | 65M+ |
| Messages Sent Daily | 1.5B+ |
| Connected Workspaces | 750K+ |
| Average Channels/Workspace | 200+ |
| Mobile Traffic | ~40% |

### Engineering Challenges

1. **Real-time messaging**: Sub-second delivery
2. **Multi-workspace**: Seamless switching
3. **Rich content**: Files, code, reactions
4. **Offline mode**: Full functionality
5. **Search**: Fast, relevant results
6. **Notifications**: Reliable push delivery

---

## Architecture Evolution

### Timeline

#### 2013-2015: Initial Launch
- Hybrid app (PhoneGap/Cordova)
- Heavy reliance on WebSocket
- Basic offline caching

#### 2016-2018: Native Rewrite
- Full native iOS and Android apps
- Introduction of SQLite for local storage
- Improved real-time infrastructure

#### 2019-2021: Scale Optimization
- Shared Kotlin Multiplatform code
- GraphQL adoption for API
- Enhanced offline capabilities

#### 2022-Present: Modern Architecture
- SwiftUI/Jetpack Compose adoption
- Improved Kotlin Multiplatform coverage
- Real-time sync improvements

---

## Core Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │    Views      │  │  ViewModels   │  │    Navigation     │   │
│  │  (SwiftUI)    │  │   (MVVM)      │  │   (Coordinator)   │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      Business Logic (KMP)                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │  Use Cases    │  │   Managers    │  │    Processors     │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                         Data Layer                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │   Network     │  │   Database    │  │   Real-time       │   │
│  │   (GraphQL)   │  │   (SQLite)    │  │   (WebSocket)     │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Module Structure

```
SlackApp/
├── App/
│   ├── SlackApp.swift
│   ├── AppCoordinator.swift
│   └── DependencyContainer.swift
├── Core/
│   ├── Networking/
│   │   ├── GraphQL/
│   │   └── WebSocket/
│   ├── Database/
│   │   ├── Schema/
│   │   └── Queries/
│   └── Shared/
│       └── SlackCore.xcframework (KMP)
├── Features/
│   ├── Home/
│   ├── Messages/
│   ├── Channels/
│   ├── DMs/
│   ├── Search/
│   ├── Threads/
│   └── Settings/
├── UI/
│   ├── Components/
│   ├── Design/
│   └── Resources/
└── Tests/
```

### Dependency Injection

```swift
// Service container
final class DependencyContainer {
    static let shared = DependencyContainer()
    
    // Core services
    lazy var networkService: NetworkService = {
        NetworkServiceImpl(
            baseURL: Config.apiBaseURL,
            authProvider: authService
        )
    }()
    
    lazy var webSocketService: WebSocketService = {
        WebSocketServiceImpl(
            url: Config.webSocketURL,
            authProvider: authService
        )
    }()
    
    lazy var databaseService: DatabaseService = {
        DatabaseServiceImpl(
            name: "slack.db",
            migrations: DatabaseMigrations.all
        )
    }()
    
    // Auth
    lazy var authService: AuthService = {
        AuthServiceImpl(
            keychain: keychainService,
            network: networkService
        )
    }()
    
    // Managers
    lazy var workspaceManager: WorkspaceManager = {
        WorkspaceManagerImpl(
            database: databaseService,
            network: networkService,
            realtime: webSocketService
        )
    }()
    
    lazy var messageManager: MessageManager = {
        MessageManagerImpl(
            database: databaseService,
            network: networkService,
            realtime: webSocketService,
            workspace: workspaceManager
        )
    }()
}
```

---

## Real-Time Messaging

### WebSocket Architecture

```swift
// WebSocket connection manager
final class SlackWebSocketManager {
    private var connections: [WorkspaceID: WebSocketConnection] = [:]
    private let authProvider: AuthProvider
    private let messageProcessor: MessageProcessor
    
    private let eventSubject = PassthroughSubject<SlackEvent, Never>()
    var events: AnyPublisher<SlackEvent, Never> {
        eventSubject.eraseToAnyPublisher()
    }
    
    func connect(to workspace: Workspace) async throws {
        guard connections[workspace.id] == nil else { return }
        
        let token = try await authProvider.getToken(for: workspace)
        let connection = try await WebSocketConnection(
            url: Config.webSocketURL,
            token: token
        )
        
        connections[workspace.id] = connection
        
        // Start receiving
        Task {
            for await message in connection.messages {
                await handleMessage(message, workspace: workspace)
            }
        }
    }
    
    func disconnect(from workspace: Workspace) {
        connections[workspace.id]?.close()
        connections[workspace.id] = nil
    }
    
    private func handleMessage(_ data: Data, workspace: Workspace) async {
        guard let event = try? JSONDecoder.slack.decode(SlackEvent.self, from: data) else {
            return
        }
        
        // Process event
        await messageProcessor.process(event, in: workspace)
        
        // Emit to subscribers
        eventSubject.send(event)
    }
}

// Event types
enum SlackEvent: Decodable {
    case message(MessageEvent)
    case messageChanged(MessageChangedEvent)
    case messageDeleted(MessageDeletedEvent)
    case reactionAdded(ReactionEvent)
    case reactionRemoved(ReactionEvent)
    case channelCreated(ChannelEvent)
    case channelArchived(ChannelEvent)
    case userTyping(TypingEvent)
    case presenceChange(PresenceEvent)
    case teamJoin(TeamJoinEvent)
    
    enum CodingKeys: String, CodingKey {
        case type
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(String.self, forKey: .type)
        
        switch type {
        case "message":
            self = .message(try MessageEvent(from: decoder))
        case "message_changed":
            self = .messageChanged(try MessageChangedEvent(from: decoder))
        // ... other cases
        default:
            throw DecodingError.dataCorrupted(
                DecodingError.Context(codingPath: [], debugDescription: "Unknown event type: \(type)")
            )
        }
    }
}
```

### Message Processing Pipeline

```swift
// Message processor
final class MessageProcessor {
    private let database: DatabaseService
    private let notificationService: NotificationService
    private let badgeManager: BadgeManager
    
    func process(_ event: SlackEvent, in workspace: Workspace) async {
        switch event {
        case .message(let message):
            await processMessage(message, in: workspace)
            
        case .messageChanged(let change):
            await processMessageChange(change, in: workspace)
            
        case .reactionAdded(let reaction):
            await processReaction(reaction, added: true, in: workspace)
            
        case .reactionRemoved(let reaction):
            await processReaction(reaction, added: false, in: workspace)
            
        default:
            break
        }
    }
    
    private func processMessage(_ event: MessageEvent, in workspace: Workspace) async {
        // Save to database
        let message = event.toMessage(workspace: workspace)
        await database.saveMessage(message)
        
        // Update channel
        await database.updateChannel(event.channel) { channel in
            channel.lastMessageTs = event.ts
            channel.lastMessagePreview = message.preview
        }
        
        // Handle notification
        if shouldNotify(message, in: workspace) {
            await notificationService.show(for: message)
            await badgeManager.incrementUnread(for: event.channel)
        }
    }
    
    private func shouldNotify(_ message: Message, in workspace: Workspace) -> Bool {
        // Don't notify own messages
        guard message.userId != workspace.currentUserId else { return false }
        
        // Check notification preferences
        guard workspace.notificationPreferences.isEnabled else { return false }
        
        // Check if mentioned
        if message.mentionsUser(workspace.currentUserId) {
            return true
        }
        
        // Check channel preferences
        return workspace.channelNotificationEnabled(message.channelId)
    }
}
```

### Typing Indicators

```swift
// Typing indicator manager
final class TypingIndicatorManager {
    private var typingUsers: [ChannelID: [UserID: Date]] = [:]
    private let timeout: TimeInterval = 5.0
    private var cleanupTask: Task<Void, Never>?
    
    private let typingSubject = CurrentValueSubject<[ChannelID: [User]], Never>([:])
    var typingIndicators: AnyPublisher<[ChannelID: [User]], Never> {
        typingSubject.eraseToAnyPublisher()
    }
    
    init() {
        startCleanupTask()
    }
    
    func userStartedTyping(_ userId: UserID, in channel: ChannelID) {
        if typingUsers[channel] == nil {
            typingUsers[channel] = [:]
        }
        typingUsers[channel]?[userId] = Date()
        emitUpdate()
    }
    
    func userStoppedTyping(_ userId: UserID, in channel: ChannelID) {
        typingUsers[channel]?[userId] = nil
        if typingUsers[channel]?.isEmpty == true {
            typingUsers[channel] = nil
        }
        emitUpdate()
    }
    
    private func startCleanupTask() {
        cleanupTask = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                self?.cleanupExpired()
            }
        }
    }
    
    private func cleanupExpired() {
        let now = Date()
        var updated = false
        
        for (channel, users) in typingUsers {
            for (user, timestamp) in users {
                if now.timeIntervalSince(timestamp) > timeout {
                    typingUsers[channel]?[user] = nil
                    updated = true
                }
            }
            if typingUsers[channel]?.isEmpty == true {
                typingUsers[channel] = nil
            }
        }
        
        if updated {
            emitUpdate()
        }
    }
    
    private func emitUpdate() {
        // Convert to user objects
        var result: [ChannelID: [User]] = [:]
        for (channel, users) in typingUsers {
            result[channel] = users.keys.compactMap { UserCache.shared.user(for: $0) }
        }
        typingSubject.send(result)
    }
}
```

---

## Data Layer

### Database Schema

```sql
-- Messages table
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    text TEXT,
    ts TEXT NOT NULL,
    thread_ts TEXT,
    reply_count INTEGER DEFAULT 0,
    is_edited INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
    FOREIGN KEY (channel_id) REFERENCES channels(id)
);

CREATE INDEX idx_messages_channel ON messages(channel_id, ts DESC);
CREATE INDEX idx_messages_thread ON messages(thread_ts, ts);

-- Channels table
CREATE TABLE channels (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    is_member INTEGER DEFAULT 1,
    is_archived INTEGER DEFAULT 0,
    is_muted INTEGER DEFAULT 0,
    last_read_ts TEXT,
    last_message_ts TEXT,
    unread_count INTEGER DEFAULT 0,
    mention_count INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

CREATE INDEX idx_channels_workspace ON channels(workspace_id);

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    real_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    status_text TEXT,
    status_emoji TEXT,
    is_bot INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

-- Attachments table
CREATE TABLE attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT,
    url TEXT,
    thumbnail_url TEXT,
    file_size INTEGER,
    FOREIGN KEY (message_id) REFERENCES messages(id)
);

-- Reactions table
CREATE TABLE reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    user_id TEXT NOT NULL,
    UNIQUE(message_id, emoji, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(id)
);
```

### Repository Pattern

```swift
// Message repository
protocol MessageRepository {
    func getMessages(channelId: String, limit: Int, before: String?) async throws -> [Message]
    func getMessage(id: String) async throws -> Message?
    func saveMessages(_ messages: [Message]) async throws
    func updateMessage(_ message: Message) async throws
    func deleteMessage(id: String) async throws
    func searchMessages(query: String, in workspace: String) async throws -> [Message]
}

final class MessageRepositoryImpl: MessageRepository {
    private let database: DatabaseService
    private let api: SlackAPIClient
    private let cache: MessageCache
    
    init(database: DatabaseService, api: SlackAPIClient, cache: MessageCache) {
        self.database = database
        self.api = api
        self.cache = cache
    }
    
    func getMessages(channelId: String, limit: Int, before: String?) async throws -> [Message] {
        // Try cache first
        if let cached = await cache.getMessages(channelId: channelId, limit: limit, before: before) {
            return cached
        }
        
        // Try database
        let dbMessages = try await database.getMessages(
            channelId: channelId,
            limit: limit,
            before: before
        )
        
        if !dbMessages.isEmpty {
            return dbMessages
        }
        
        // Fetch from API
        let response = try await api.getConversationHistory(
            channel: channelId,
            limit: limit,
            latest: before
        )
        
        // Save to database
        try await database.saveMessages(response.messages.map { $0.toModel() })
        
        return response.messages.map { $0.toModel() }
    }
    
    func saveMessages(_ messages: [Message]) async throws {
        try await database.saveMessages(messages)
        await cache.cacheMessages(messages)
    }
}
```

---

## Offline Support

### Sync Strategy

```swift
// Sync manager
final class SyncManager {
    private let database: DatabaseService
    private let api: SlackAPIClient
    private let networkMonitor: NetworkMonitor
    
    private var pendingOperations: [PendingOperation] = []
    private let operationQueue = DispatchQueue(label: "slack.sync")
    
    init(database: DatabaseService, api: SlackAPIClient, networkMonitor: NetworkMonitor) {
        self.database = database
        self.api = api
        self.networkMonitor = networkMonitor
        
        loadPendingOperations()
        observeNetworkChanges()
    }
    
    func queueOperation(_ operation: PendingOperation) async {
        // Save to database for persistence
        try? await database.savePendingOperation(operation)
        
        operationQueue.async {
            self.pendingOperations.append(operation)
        }
        
        // Try to execute if online
        if networkMonitor.isConnected {
            await processPendingOperations()
        }
    }
    
    private func processPendingOperations() async {
        let operations = operationQueue.sync { pendingOperations }
        
        for operation in operations {
            do {
                try await executeOperation(operation)
                
                // Remove from pending
                operationQueue.async {
                    self.pendingOperations.removeAll { $0.id == operation.id }
                }
                try? await database.deletePendingOperation(operation.id)
                
            } catch {
                // Keep in queue for retry
                if operation.retryCount < 3 {
                    var updatedOp = operation
                    updatedOp.retryCount += 1
                    updatedOp.lastError = error.localizedDescription
                    try? await database.updatePendingOperation(updatedOp)
                } else {
                    // Mark as failed
                    NotificationCenter.default.post(
                        name: .operationFailed,
                        object: operation
                    )
                }
            }
        }
    }
    
    private func executeOperation(_ operation: PendingOperation) async throws {
        switch operation.type {
        case .sendMessage(let channelId, let text, let threadTs):
            _ = try await api.postMessage(
                channel: channelId,
                text: text,
                threadTs: threadTs
            )
            
        case .addReaction(let channelId, let ts, let emoji):
            try await api.addReaction(
                channel: channelId,
                timestamp: ts,
                name: emoji
            )
            
        case .removeReaction(let channelId, let ts, let emoji):
            try await api.removeReaction(
                channel: channelId,
                timestamp: ts,
                name: emoji
            )
            
        case .markRead(let channelId, let ts):
            try await api.markConversation(channel: channelId, ts: ts)
        }
    }
    
    private func observeNetworkChanges() {
        networkMonitor.connectionStatusPublisher
            .sink { [weak self] isConnected in
                if isConnected {
                    Task {
                        await self?.processPendingOperations()
                    }
                }
            }
            .store(in: &cancellables)
    }
    
    private func loadPendingOperations() {
        Task {
            let operations = try? await database.getPendingOperations()
            operationQueue.async {
                self.pendingOperations = operations ?? []
            }
        }
    }
}

// Pending operation types
struct PendingOperation: Identifiable, Codable {
    let id: UUID
    let type: OperationType
    var retryCount: Int = 0
    var lastError: String?
    let createdAt: Date
    
    enum OperationType: Codable {
        case sendMessage(channelId: String, text: String, threadTs: String?)
        case addReaction(channelId: String, ts: String, emoji: String)
        case removeReaction(channelId: String, ts: String, emoji: String)
        case markRead(channelId: String, ts: String)
    }
}
```

### Optimistic Updates

```swift
// Optimistic message sending
final class MessageSender {
    private let repository: MessageRepository
    private let syncManager: SyncManager
    private let currentUser: User
    
    func sendMessage(to channel: Channel, text: String, threadTs: String? = nil) async -> Message {
        // Create optimistic message
        let optimisticMessage = Message(
            id: UUID().uuidString,
            channelId: channel.id,
            userId: currentUser.id,
            text: text,
            ts: String(Date().timeIntervalSince1970),
            threadTs: threadTs,
            status: .pending
        )
        
        // Save locally immediately
        try? await repository.saveMessages([optimisticMessage])
        
        // Queue for sync
        await syncManager.queueOperation(PendingOperation(
            id: UUID(),
            type: .sendMessage(channelId: channel.id, text: text, threadTs: threadTs),
            createdAt: Date()
        ))
        
        return optimisticMessage
    }
}
```

---

## Multi-Workspace Architecture

### Workspace Manager

```swift
// Workspace manager
final class WorkspaceManager: ObservableObject {
    @Published private(set) var workspaces: [Workspace] = []
    @Published private(set) var currentWorkspace: Workspace?
    
    private let database: DatabaseService
    private let authService: AuthService
    private let webSocketManager: SlackWebSocketManager
    
    init(database: DatabaseService, authService: AuthService, webSocketManager: SlackWebSocketManager) {
        self.database = database
        self.authService = authService
        self.webSocketManager = webSocketManager
        
        Task {
            await loadWorkspaces()
        }
    }
    
    func loadWorkspaces() async {
        workspaces = (try? await database.getWorkspaces()) ?? []
        
        // Set current workspace
        if let lastUsedId = UserDefaults.standard.string(forKey: "lastWorkspaceId"),
           let workspace = workspaces.first(where: { $0.id == lastUsedId }) {
            await switchToWorkspace(workspace)
        } else if let first = workspaces.first {
            await switchToWorkspace(first)
        }
    }
    
    func switchToWorkspace(_ workspace: Workspace) async {
        // Disconnect from current
        if let current = currentWorkspace {
            webSocketManager.disconnect(from: current)
        }
        
        // Update current
        currentWorkspace = workspace
        UserDefaults.standard.set(workspace.id, forKey: "lastWorkspaceId")
        
        // Connect to new workspace
        try? await webSocketManager.connect(to: workspace)
        
        // Load workspace data
        await loadWorkspaceData(workspace)
    }
    
    func addWorkspace(token: String) async throws {
        // Validate token and get workspace info
        let workspaceInfo = try await authService.validateToken(token)
        
        // Save workspace
        let workspace = Workspace(
            id: workspaceInfo.teamId,
            name: workspaceInfo.teamName,
            domain: workspaceInfo.teamDomain,
            iconUrl: workspaceInfo.teamIcon,
            currentUserId: workspaceInfo.userId
        )
        
        try await database.saveWorkspace(workspace)
        try await authService.saveToken(token, for: workspace)
        
        await loadWorkspaces()
        await switchToWorkspace(workspace)
    }
    
    func removeWorkspace(_ workspace: Workspace) async {
        webSocketManager.disconnect(from: workspace)
        try? await database.deleteWorkspace(workspace.id)
        try? await authService.deleteToken(for: workspace)
        
        await loadWorkspaces()
    }
    
    private func loadWorkspaceData(_ workspace: Workspace) async {
        // Load channels, users, etc.
        async let channels = database.getChannels(workspaceId: workspace.id)
        async let users = database.getUsers(workspaceId: workspace.id)
        async let dms = database.getDirectMessages(workspaceId: workspace.id)
        
        // Emit loaded data
        _ = try? await (channels, users, dms)
    }
}
```

### Multi-Workspace UI

```swift
// Workspace switcher
struct WorkspaceSwitcher: View {
    @ObservedObject var workspaceManager: WorkspaceManager
    @State private var showingAddWorkspace = false
    
    var body: some View {
        VStack(spacing: 12) {
            ForEach(workspaceManager.workspaces) { workspace in
                WorkspaceButton(
                    workspace: workspace,
                    isSelected: workspace.id == workspaceManager.currentWorkspace?.id,
                    unreadCount: workspace.totalUnreadCount
                ) {
                    Task {
                        await workspaceManager.switchToWorkspace(workspace)
                    }
                }
            }
            
            Divider()
                .padding(.vertical, 8)
            
            Button(action: { showingAddWorkspace = true }) {
                Image(systemName: "plus")
                    .font(.system(size: 20))
                    .foregroundColor(.secondary)
                    .frame(width: 44, height: 44)
                    .background(Color.secondary.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
        .padding(.vertical, 8)
        .sheet(isPresented: $showingAddWorkspace) {
            AddWorkspaceView(workspaceManager: workspaceManager)
        }
    }
}

struct WorkspaceButton: View {
    let workspace: Workspace
    let isSelected: Bool
    let unreadCount: Int
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: workspace.iconUrl) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Text(workspace.name.prefix(1).uppercased())
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(width: 44, height: 44)
                        .background(Color.blue)
                }
                .frame(width: 44, height: 44)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 3)
                )
                
                if unreadCount > 0 {
                    BadgeView(count: unreadCount)
                        .offset(x: 6, y: -6)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}
```

---

## Search Implementation

### Search Architecture

```swift
// Search manager
final class SearchManager {
    private let localSearch: LocalSearchEngine
    private let remoteSearch: RemoteSearchService
    private let searchHistory: SearchHistoryManager
    
    func search(
        query: String,
        in workspace: Workspace,
        filters: SearchFilters = .default
    ) -> AnyPublisher<SearchResults, Never> {
        // Combine local and remote results
        let local = localSearch.search(query: query, workspace: workspace, filters: filters)
            .map { SearchResults(messages: $0, source: .local) }
        
        let remote = remoteSearch.search(query: query, workspace: workspace, filters: filters)
            .map { SearchResults(messages: $0.messages, source: .remote, hasMore: $0.pagination.hasMore) }
            .catch { _ in Just(SearchResults.empty) }
        
        return Publishers.Merge(local, remote)
            .scan(SearchResults.empty) { accumulated, new in
                // Merge results, preferring remote
                if new.source == .remote {
                    return new
                } else if accumulated.source == .remote {
                    return accumulated
                } else {
                    return new
                }
            }
            .eraseToAnyPublisher()
    }
}

// Local search using SQLite FTS
final class LocalSearchEngine {
    private let database: DatabaseService
    
    func search(
        query: String,
        workspace: Workspace,
        filters: SearchFilters
    ) -> AnyPublisher<[Message], Never> {
        Future { [database] promise in
            Task {
                let results = try? await database.searchMessages(
                    query: query,
                    workspaceId: workspace.id,
                    channelIds: filters.channelIds,
                    userIds: filters.userIds,
                    dateRange: filters.dateRange,
                    limit: 50
                )
                promise(.success(results ?? []))
            }
        }
        .eraseToAnyPublisher()
    }
}

// Search filters
struct SearchFilters {
    var channelIds: [String]?
    var userIds: [String]?
    var dateRange: DateInterval?
    var hasAttachments: Bool?
    var messageTypes: [MessageType]?
    
    static let `default` = SearchFilters()
}
```

### Search UI

```swift
// Search view
struct SearchView: View {
    @StateObject private var viewModel: SearchViewModel
    @State private var query = ""
    @FocusState private var isFocused: Bool
    
    var body: some View {
        VStack(spacing: 0) {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                
                TextField("Search messages", text: $query)
                    .focused($isFocused)
                    .submitLabel(.search)
                    .onSubmit {
                        viewModel.search(query: query)
                    }
                
                if !query.isEmpty {
                    Button(action: { query = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            
            // Filters
            if viewModel.showFilters {
                SearchFiltersView(filters: $viewModel.filters)
            }
            
            // Results
            switch viewModel.state {
            case .idle:
                RecentSearchesView(
                    searches: viewModel.recentSearches,
                    onSelect: { viewModel.search(query: $0) }
                )
                
            case .loading:
                ProgressView()
                    .frame(maxHeight: .infinity)
                
            case .results(let messages):
                if messages.isEmpty {
                    EmptySearchResultsView(query: query)
                } else {
                    SearchResultsList(messages: messages)
                }
                
            case .error(let message):
                ErrorView(message: message)
            }
        }
        .onAppear {
            isFocused = true
        }
    }
}
```

---

## Performance Strategies

### Message Rendering Optimization

```swift
// Efficient message list
struct MessageListView: View {
    let messages: [Message]
    let onLoadMore: () -> Void
    
    var body: some View {
        LazyVStack(spacing: 0) {
            ForEach(messages) { message in
                MessageRow(message: message)
                    .id(message.id)
                    .onAppear {
                        if message.id == messages.last?.id {
                            onLoadMore()
                        }
                    }
            }
        }
    }
}

// Optimized message row
struct MessageRow: View {
    let message: Message
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Avatar - lazy loaded
            LazyImage(url: message.user.avatarUrl) {
                Circle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: 36, height: 36)
            .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                // Header
                HStack {
                    Text(message.user.displayName)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    
                    Text(message.formattedTime)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                // Content - parsed once
                MessageContent(message: message)
                
                // Reactions - only if present
                if !message.reactions.isEmpty {
                    ReactionsView(reactions: message.reactions)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}
```

### Memory Management

```swift
// Message cache with LRU eviction
final class MessageCache {
    private let cache = NSCache<NSString, CachedMessages>()
    private let maxChannels = 50
    private var accessOrder: [String] = []
    
    init() {
        cache.countLimit = maxChannels
    }
    
    func cacheMessages(_ messages: [Message]) async {
        guard let channelId = messages.first?.channelId else { return }
        
        let key = channelId as NSString
        let cached = CachedMessages(messages: messages, timestamp: Date())
        cache.setObject(cached, forKey: key)
        
        // Update access order
        accessOrder.removeAll { $0 == channelId }
        accessOrder.append(channelId)
        
        // Evict if needed
        while accessOrder.count > maxChannels {
            let evictKey = accessOrder.removeFirst()
            cache.removeObject(forKey: evictKey as NSString)
        }
    }
    
    func getMessages(channelId: String, limit: Int, before: String?) -> [Message]? {
        guard let cached = cache.object(forKey: channelId as NSString) else {
            return nil
        }
        
        // Update access order
        accessOrder.removeAll { $0 == channelId }
        accessOrder.append(channelId)
        
        var messages = cached.messages
        
        if let before = before {
            messages = messages.filter { $0.ts < before }
        }
        
        return Array(messages.prefix(limit))
    }
}

class CachedMessages {
    let messages: [Message]
    let timestamp: Date
    
    init(messages: [Message], timestamp: Date) {
        self.messages = messages
        self.timestamp = timestamp
    }
}
```

---

## Lessons Learned

### Key Takeaways

| Area | Learning |
|------|----------|
| Real-time | WebSocket reconnection is critical |
| Offline | Optimistic updates improve UX significantly |
| Multi-workspace | Isolated data stores prevent conflicts |
| Search | Local search provides instant results |
| Performance | Lazy loading is essential for large channels |

### Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Message ordering | Timestamp-based sorting with gap detection |
| Notification reliability | Server-side push with local fallback |
| Large channels | Virtualized lists with prefetching |
| Cross-workspace sync | Per-workspace WebSocket connections |
| Battery usage | Coalesced network requests |

### Best Practices

1. **Always have offline fallback** - Users expect to read messages offline
2. **Optimistic updates everywhere** - Makes the app feel instant
3. **Workspace isolation** - Keep data separate to avoid conflicts
4. **Efficient rendering** - Large channels can have 100K+ messages
5. **Smart sync** - Only sync what's needed, when needed

---

## Resources

### Official

- [Slack API Documentation](https://api.slack.com/)
- [Slack Engineering Blog](https://slack.engineering/)

### Conference Talks

- "Building Slack's Mobile Apps" - Mobile Era 2019
- "Real-time at Scale" - QCon 2020

---

*Last updated: 2024*