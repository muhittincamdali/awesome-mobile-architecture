# The Composable Architecture (TCA) - Deep Dive

A comprehensive guide to mastering Point-Free's The Composable Architecture for building robust, testable, and scalable iOS applications.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [State Management](#state-management)
4. [Actions and Reducers](#actions-and-reducers)
5. [Effects and Dependencies](#effects-and-dependencies)
6. [Composition Patterns](#composition-patterns)
7. [Navigation](#navigation)
8. [Testing Strategies](#testing-strategies)
9. [Performance Optimization](#performance-optimization)
10. [Real-World Patterns](#real-world-patterns)
11. [Migration Guide](#migration-guide)
12. [Best Practices](#best-practices)

---

## Introduction

### What is TCA?

The Composable Architecture (TCA) is a library for building applications in a consistent and understandable way, with composition, testing, and ergonomics in mind. It was developed by Brandon Williams and Stephen Celis at Point-Free.

### Philosophy

TCA is built on several key principles:

1. **Single Source of Truth**: All state lives in one place
2. **Unidirectional Data Flow**: State changes flow in one direction
3. **Composition**: Large features are built from smaller ones
4. **Testability**: Every component is testable in isolation
5. **Ergonomics**: The API should be pleasant to use

### When to Use TCA

TCA excels in:

- Large-scale applications with complex state
- Teams requiring consistent architecture patterns
- Applications with heavy testing requirements
- Features requiring predictable state management

---

## Core Concepts

### The Four Pillars

```swift
import ComposableArchitecture

@Reducer
struct Feature {
    // 1. State - What the feature needs to do its job
    @ObservableState
    struct State: Equatable {
        var count: Int = 0
        var isLoading: Bool = false
        var user: User?
    }
    
    // 2. Action - All possible events
    enum Action {
        case incrementButtonTapped
        case decrementButtonTapped
        case userResponse(Result<User, Error>)
    }
    
    // 3. Dependencies - External services
    @Dependency(\.userClient) var userClient
    
    // 4. Reducer - Business logic
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .incrementButtonTapped:
                state.count += 1
                return .none
                
            case .decrementButtonTapped:
                state.count -= 1
                return .none
                
            case .userResponse(.success(let user)):
                state.user = user
                state.isLoading = false
                return .none
                
            case .userResponse(.failure):
                state.isLoading = false
                return .none
            }
        }
    }
}
```

### Store

The Store is the runtime that drives the feature:

```swift
struct FeatureView: View {
    let store: StoreOf<Feature>
    
    var body: some View {
        WithViewStore(store, observe: { $0 }) { viewStore in
            VStack {
                Text("Count: \(viewStore.count)")
                
                Button("Increment") {
                    viewStore.send(.incrementButtonTapped)
                }
                
                Button("Decrement") {
                    viewStore.send(.decrementButtonTapped)
                }
            }
        }
    }
}
```

---

## State Management

### Designing State

State should be:

1. **Minimal**: Only what's needed
2. **Normalized**: Avoid duplication
3. **Equatable**: For change detection

```swift
@ObservableState
struct AppState: Equatable {
    // Good: Minimal, normalized
    var userID: User.ID?
    var users: IdentifiedArrayOf<User> = []
    
    // Derived property - not stored
    var currentUser: User? {
        userID.flatMap { users[id: $0] }
    }
    
    // Bad: Duplicated data
    // var currentUser: User?
    // var allUsers: [User]
}
```

### Shared State

For state shared across features:

```swift
@Reducer
struct ParentFeature {
    @ObservableState
    struct State: Equatable {
        var shared: SharedState
        var childA: ChildA.State
        var childB: ChildB.State
        
        init() {
            self.shared = SharedState()
            self.childA = ChildA.State(shared: shared)
            self.childB = ChildB.State(shared: shared)
        }
    }
}

// Using @Shared for reference-type sharing
@Reducer
struct Feature {
    @ObservableState
    struct State: Equatable {
        @Shared(.appStorage("userSettings")) var settings: UserSettings = .default
    }
}
```

### State Scoping

Scope state for child features:

```swift
struct ParentView: View {
    let store: StoreOf<ParentFeature>
    
    var body: some View {
        ChildView(
            store: store.scope(
                state: \.child,
                action: \.child
            )
        )
    }
}
```

---

## Actions and Reducers

### Action Design Patterns

#### Semantic Actions

Name actions by what happened, not what should happen:

```swift
// Good: Describes what happened
enum Action {
    case loginButtonTapped
    case usernameChanged(String)
    case loginResponse(Result<User, Error>)
}

// Bad: Describes what to do
enum Action {
    case login
    case setUsername(String)
    case handleLoginResult(Result<User, Error>)
}
```

#### Delegate Actions

For parent-child communication:

```swift
@Reducer
struct ChildFeature {
    enum Action {
        case buttonTapped
        case delegate(Delegate)
        
        enum Delegate {
            case didComplete(Result)
            case didSelectItem(Item)
        }
    }
}

@Reducer
struct ParentFeature {
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .child(.delegate(.didComplete(let result))):
                // Handle child completion
                return .none
                
            case .child:
                return .none
            }
        }
        
        Scope(state: \.child, action: \.child) {
            ChildFeature()
        }
    }
}
```

### Reducer Composition

#### Scope

Embed a child reducer:

```swift
var body: some ReducerOf<Self> {
    Scope(state: \.settings, action: \.settings) {
        SettingsFeature()
    }
    
    Reduce { state, action in
        // Parent logic
    }
}
```

#### Combine

Combine multiple reducers:

```swift
var body: some ReducerOf<Self> {
    CombineReducers {
        FeatureA()
        FeatureB()
        FeatureC()
    }
}
```

#### ifLet / ifCaseLet

For optional state:

```swift
var body: some ReducerOf<Self> {
    Reduce { state, action in
        // Core logic
    }
    .ifLet(\.detail, action: \.detail) {
        DetailFeature()
    }
}
```

#### forEach

For collections:

```swift
var body: some ReducerOf<Self> {
    Reduce { state, action in
        // Core logic
    }
    .forEach(\.rows, action: \.rows) {
        RowFeature()
    }
}
```

---

## Effects and Dependencies

### Understanding Effects

Effects represent side effects - anything that interacts with the outside world:

```swift
@Reducer
struct SearchFeature {
    @Dependency(\.searchClient) var searchClient
    @Dependency(\.mainQueue) var mainQueue
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .searchQueryChanged(let query):
                state.query = query
                
                // Debounced search effect
                return .run { send in
                    try await mainQueue.sleep(for: .milliseconds(300))
                    let results = try await searchClient.search(query)
                    await send(.searchResponse(.success(results)))
                } catch: { error, send in
                    await send(.searchResponse(.failure(error)))
                }
                .cancellable(id: CancelID.search, cancelInFlight: true)
                
            case .searchResponse(let result):
                // Handle response
                return .none
            }
        }
    }
    
    enum CancelID {
        case search
    }
}
```

### Effect Operators

#### Concatenation

Run effects sequentially:

```swift
return .concatenate(
    .run { _ in await analytics.track(.screenViewed) },
    .run { send in
        let data = try await api.fetchData()
        await send(.dataLoaded(data))
    }
)
```

#### Merge

Run effects concurrently:

```swift
return .merge(
    .run { _ in await analytics.track(.buttonTapped) },
    .send(.navigate(to: .details))
)
```

#### Cancellation

Cancel running effects:

```swift
// Cancel specific effect
return .cancel(id: CancelID.timer)

// Cancel in flight
return .run { send in
    // Long running task
}
.cancellable(id: CancelID.task, cancelInFlight: true)
```

### Dependency Management

#### Defining Dependencies

```swift
// Define the client interface
struct APIClient {
    var fetchUser: @Sendable (User.ID) async throws -> User
    var updateUser: @Sendable (User) async throws -> User
    var deleteUser: @Sendable (User.ID) async throws -> Void
}

// Dependency key
extension APIClient: DependencyKey {
    static let liveValue = APIClient(
        fetchUser: { id in
            let url = URL(string: "https://api.example.com/users/\(id)")!
            let (data, _) = try await URLSession.shared.data(from: url)
            return try JSONDecoder().decode(User.self, from: data)
        },
        updateUser: { user in
            // Implementation
        },
        deleteUser: { id in
            // Implementation
        }
    )
    
    static let testValue = APIClient(
        fetchUser: unimplemented("APIClient.fetchUser"),
        updateUser: unimplemented("APIClient.updateUser"),
        deleteUser: unimplemented("APIClient.deleteUser")
    )
    
    static let previewValue = APIClient(
        fetchUser: { _ in .mock },
        updateUser: { $0 },
        deleteUser: { _ in }
    )
}

extension DependencyValues {
    var apiClient: APIClient {
        get { self[APIClient.self] }
        set { self[APIClient.self] = newValue }
    }
}
```

#### Using Dependencies

```swift
@Reducer
struct UserFeature {
    @Dependency(\.apiClient) var apiClient
    @Dependency(\.date) var date
    @Dependency(\.uuid) var uuid
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .loadUser:
                return .run { [id = state.userID] send in
                    let user = try await apiClient.fetchUser(id)
                    await send(.userLoaded(user))
                }
            // ...
            }
        }
    }
}
```

---

## Composition Patterns

### Feature Modules

Structure features as independent modules:

```
Sources/
├── AppFeature/
│   ├── AppFeature.swift
│   └── AppView.swift
├── HomeFeature/
│   ├── HomeFeature.swift
│   ├── HomeView.swift
│   └── HomeClient.swift
├── ProfileFeature/
│   ├── ProfileFeature.swift
│   └── ProfileView.swift
└── SharedModels/
    ├── User.swift
    └── Settings.swift
```

### Horizontal Composition

Features at the same level:

```swift
@Reducer
struct AppFeature {
    @ObservableState
    struct State: Equatable {
        var home: HomeFeature.State
        var profile: ProfileFeature.State
        var settings: SettingsFeature.State
        var selectedTab: Tab = .home
    }
    
    enum Action {
        case home(HomeFeature.Action)
        case profile(ProfileFeature.Action)
        case settings(SettingsFeature.Action)
        case tabSelected(Tab)
    }
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .tabSelected(let tab):
                state.selectedTab = tab
                return .none
            // Handle cross-feature actions
            case .home(.delegate(.userUpdated(let user))):
                state.profile.user = user
                return .none
            default:
                return .none
            }
        }
        
        Scope(state: \.home, action: \.home) {
            HomeFeature()
        }
        Scope(state: \.profile, action: \.profile) {
            ProfileFeature()
        }
        Scope(state: \.settings, action: \.settings) {
            SettingsFeature()
        }
    }
}
```

### Vertical Composition

Parent-child hierarchies:

```swift
@Reducer
struct ListFeature {
    @ObservableState
    struct State: Equatable {
        var items: IdentifiedArrayOf<ItemFeature.State> = []
        @Presents var detail: DetailFeature.State?
    }
    
    enum Action {
        case items(IdentifiedActionOf<ItemFeature>)
        case detail(PresentationAction<DetailFeature.Action>)
        case addButtonTapped
    }
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .items(.element(id: let id, action: .delegate(.selected))):
                guard let item = state.items[id: id] else { return .none }
                state.detail = DetailFeature.State(item: item.item)
                return .none
                
            case .addButtonTapped:
                state.items.append(ItemFeature.State(item: Item()))
                return .none
                
            default:
                return .none
            }
        }
        .forEach(\.items, action: \.items) {
            ItemFeature()
        }
        .ifLet(\.$detail, action: \.detail) {
            DetailFeature()
        }
    }
}
```

---

## Navigation

### Stack-Based Navigation

```swift
@Reducer
struct RootFeature {
    @ObservableState
    struct State: Equatable {
        var path = StackState<Path.State>()
    }
    
    enum Action {
        case path(StackAction<Path.State, Path.Action>)
        case goToProfile(User.ID)
        case goToSettings
    }
    
    @Reducer
    enum Path {
        case profile(ProfileFeature)
        case settings(SettingsFeature)
        case detail(DetailFeature)
    }
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .goToProfile(let id):
                state.path.append(.profile(ProfileFeature.State(userID: id)))
                return .none
                
            case .goToSettings:
                state.path.append(.settings(SettingsFeature.State()))
                return .none
                
            case .path(.element(id: _, action: .profile(.delegate(.logout)))):
                state.path.removeAll()
                return .none
                
            default:
                return .none
            }
        }
        .forEach(\.path, action: \.path)
    }
}

struct RootView: View {
    @Bindable var store: StoreOf<RootFeature>
    
    var body: some View {
        NavigationStack(path: $store.scope(state: \.path, action: \.path)) {
            HomeView()
        } destination: { store in
            switch store.case {
            case .profile(let store):
                ProfileView(store: store)
            case .settings(let store):
                SettingsView(store: store)
            case .detail(let store):
                DetailView(store: store)
            }
        }
    }
}
```

### Sheet and Modal Presentation

```swift
@Reducer
struct ParentFeature {
    @ObservableState
    struct State: Equatable {
        @Presents var sheet: SheetFeature.State?
        @Presents var alert: AlertState<Action.Alert>?
        @Presents var confirmationDialog: ConfirmationDialogState<Action.Dialog>?
    }
    
    enum Action {
        case sheet(PresentationAction<SheetFeature.Action>)
        case alert(PresentationAction<Alert>)
        case confirmationDialog(PresentationAction<Dialog>)
        case showSheetTapped
        case deleteButtonTapped
        
        enum Alert {
            case confirmDelete
            case cancel
        }
        
        enum Dialog {
            case delete
            case archive
            case cancel
        }
    }
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .showSheetTapped:
                state.sheet = SheetFeature.State()
                return .none
                
            case .deleteButtonTapped:
                state.alert = AlertState {
                    TextState("Delete Item?")
                } actions: {
                    ButtonState(role: .destructive, action: .confirmDelete) {
                        TextState("Delete")
                    }
                    ButtonState(role: .cancel, action: .cancel) {
                        TextState("Cancel")
                    }
                } message: {
                    TextState("This action cannot be undone.")
                }
                return .none
                
            case .alert(.presented(.confirmDelete)):
                // Perform delete
                return .none
                
            default:
                return .none
            }
        }
        .ifLet(\.$sheet, action: \.sheet) {
            SheetFeature()
        }
        .ifLet(\.$alert, action: \.alert)
        .ifLet(\.$confirmationDialog, action: \.confirmationDialog)
    }
}
```

### Deep Linking

```swift
@Reducer
struct AppFeature {
    enum Action {
        case deepLinkReceived(URL)
    }
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .deepLinkReceived(let url):
                guard let route = DeepLinkParser.parse(url) else {
                    return .none
                }
                
                switch route {
                case .profile(let id):
                    state.path.removeAll()
                    state.path.append(.profile(ProfileFeature.State(userID: id)))
                    
                case .settings(let section):
                    state.path.removeAll()
                    state.path.append(.settings(SettingsFeature.State(section: section)))
                    
                case .item(let id):
                    state.path.removeAll()
                    state.path.append(.detail(DetailFeature.State(itemID: id)))
                }
                
                return .none
            }
        }
    }
}
```

---

## Testing Strategies

### TestStore Basics

```swift
import XCTest
@testable import MyFeature
import ComposableArchitecture

final class FeatureTests: XCTestCase {
    @MainActor
    func testBasicFlow() async {
        let store = TestStore(initialState: Feature.State()) {
            Feature()
        }
        
        await store.send(.incrementButtonTapped) {
            $0.count = 1
        }
        
        await store.send(.incrementButtonTapped) {
            $0.count = 2
        }
        
        await store.send(.decrementButtonTapped) {
            $0.count = 1
        }
    }
}
```

### Testing Effects

```swift
@MainActor
func testFetchUser() async {
    let user = User(id: 1, name: "Test User")
    
    let store = TestStore(initialState: Feature.State(userID: 1)) {
        Feature()
    } withDependencies: {
        $0.apiClient.fetchUser = { _ in user }
    }
    
    await store.send(.loadButtonTapped) {
        $0.isLoading = true
    }
    
    await store.receive(\.userLoaded) {
        $0.isLoading = false
        $0.user = user
    }
}
```

### Testing Failures

```swift
@MainActor
func testFetchUserFailure() async {
    struct TestError: Error, Equatable {}
    
    let store = TestStore(initialState: Feature.State(userID: 1)) {
        Feature()
    } withDependencies: {
        $0.apiClient.fetchUser = { _ in throw TestError() }
    }
    
    await store.send(.loadButtonTapped) {
        $0.isLoading = true
    }
    
    await store.receive(\.userLoadFailed) {
        $0.isLoading = false
        $0.error = "Failed to load user"
    }
}
```

### Testing Time-Based Effects

```swift
@MainActor
func testDebouncedSearch() async {
    let clock = TestClock()
    
    let store = TestStore(initialState: SearchFeature.State()) {
        SearchFeature()
    } withDependencies: {
        $0.continuousClock = clock
        $0.searchClient.search = { query in
            [SearchResult(title: "Result for \(query)")]
        }
    }
    
    await store.send(.searchQueryChanged("test")) {
        $0.query = "test"
    }
    
    // Advance time less than debounce interval
    await clock.advance(by: .milliseconds(200))
    
    // No results yet
    
    // Advance past debounce interval
    await clock.advance(by: .milliseconds(100))
    
    await store.receive(\.searchResponse.success) {
        $0.results = [SearchResult(title: "Result for test")]
    }
}
```

### Non-Exhaustive Testing

```swift
@MainActor
func testSpecificBehavior() async {
    let store = TestStore(initialState: Feature.State()) {
        Feature()
    }
    
    store.exhaustivity = .off
    
    await store.send(.complexAction)
    
    // Only assert on specific state changes
    store.assert {
        $0.specificValue = "expected"
    }
}
```

---

## Performance Optimization

### View Optimization

#### Observe Only What's Needed

```swift
struct OptimizedView: View {
    let store: StoreOf<Feature>
    
    var body: some View {
        // Only re-render when count changes
        WithViewStore(store, observe: \.count) { viewStore in
            Text("Count: \(viewStore.state)")
        }
    }
}
```

#### Struct Observation

```swift
struct LargeFeatureView: View {
    let store: StoreOf<LargeFeature>
    
    struct ViewState: Equatable {
        let title: String
        let subtitle: String
        let isLoading: Bool
        
        init(state: LargeFeature.State) {
            self.title = state.title
            self.subtitle = state.subtitle
            self.isLoading = state.isLoading
        }
    }
    
    var body: some View {
        WithViewStore(store, observe: ViewState.init) { viewStore in
            VStack {
                Text(viewStore.title)
                Text(viewStore.subtitle)
                if viewStore.isLoading {
                    ProgressView()
                }
            }
        }
    }
}
```

### State Optimization

#### Avoid Large Collections in State

```swift
// Bad: Entire collection in state
@ObservableState
struct State: Equatable {
    var allItems: [Item] // Could be thousands
}

// Good: Paginated or windowed
@ObservableState
struct State: Equatable {
    var visibleItems: IdentifiedArrayOf<Item>
    var totalCount: Int
    var currentPage: Int
}
```

#### Use Identifiable Arrays

```swift
// Good: O(1) lookup
var items: IdentifiedArrayOf<Item> = []

// Access by ID
let item = items[id: itemID]

// Bad: O(n) lookup
var items: [Item] = []

// Access requires filtering
let item = items.first { $0.id == itemID }
```

### Effect Optimization

#### Cancel Unnecessary Work

```swift
case .searchQueryChanged(let query):
    return .run { send in
        let results = try await searchClient.search(query)
        await send(.searchResponse(results))
    }
    .cancellable(id: CancelID.search, cancelInFlight: true)
    // Previous search cancelled when new one starts
```

#### Debounce Rapid Actions

```swift
case .textFieldChanged(let text):
    state.text = text
    return .run { send in
        try await clock.sleep(for: .milliseconds(300))
        await send(.performSearch)
    }
    .cancellable(id: CancelID.textInput, cancelInFlight: true)
```

---

## Real-World Patterns

### Authentication Flow

```swift
@Reducer
struct AuthFeature {
    @ObservableState
    struct State: Equatable {
        var email: String = ""
        var password: String = ""
        var isLoading: Bool = false
        var error: String?
        @Presents var twoFactor: TwoFactorFeature.State?
    }
    
    enum Action {
        case emailChanged(String)
        case passwordChanged(String)
        case loginButtonTapped
        case loginResponse(Result<AuthResponse, Error>)
        case twoFactor(PresentationAction<TwoFactorFeature.Action>)
        case delegate(Delegate)
        
        enum Delegate {
            case didAuthenticate(User)
        }
    }
    
    @Dependency(\.authClient) var authClient
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .emailChanged(let email):
                state.email = email
                state.error = nil
                return .none
                
            case .passwordChanged(let password):
                state.password = password
                state.error = nil
                return .none
                
            case .loginButtonTapped:
                guard !state.email.isEmpty, !state.password.isEmpty else {
                    state.error = "Please enter email and password"
                    return .none
                }
                
                state.isLoading = true
                state.error = nil
                
                return .run { [email = state.email, password = state.password] send in
                    let response = try await authClient.login(email, password)
                    await send(.loginResponse(.success(response)))
                } catch: { error, send in
                    await send(.loginResponse(.failure(error)))
                }
                
            case .loginResponse(.success(let response)):
                state.isLoading = false
                
                if response.requiresTwoFactor {
                    state.twoFactor = TwoFactorFeature.State(token: response.token)
                    return .none
                }
                
                return .send(.delegate(.didAuthenticate(response.user)))
                
            case .loginResponse(.failure(let error)):
                state.isLoading = false
                state.error = error.localizedDescription
                return .none
                
            case .twoFactor(.presented(.delegate(.verified(let user)))):
                return .send(.delegate(.didAuthenticate(user)))
                
            case .twoFactor:
                return .none
                
            case .delegate:
                return .none
            }
        }
        .ifLet(\.$twoFactor, action: \.twoFactor) {
            TwoFactorFeature()
        }
    }
}
```

### Pagination

```swift
@Reducer
struct PaginatedListFeature {
    @ObservableState
    struct State: Equatable {
        var items: IdentifiedArrayOf<Item> = []
        var currentPage: Int = 1
        var hasMorePages: Bool = true
        var isLoadingPage: Bool = false
        var error: String?
    }
    
    enum Action {
        case onAppear
        case loadNextPage
        case pageLoaded(Result<PageResponse, Error>)
        case refresh
    }
    
    @Dependency(\.apiClient) var apiClient
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .onAppear:
                guard state.items.isEmpty else { return .none }
                return .send(.loadNextPage)
                
            case .loadNextPage:
                guard !state.isLoadingPage, state.hasMorePages else {
                    return .none
                }
                
                state.isLoadingPage = true
                
                return .run { [page = state.currentPage] send in
                    let response = try await apiClient.fetchPage(page)
                    await send(.pageLoaded(.success(response)))
                } catch: { error, send in
                    await send(.pageLoaded(.failure(error)))
                }
                
            case .pageLoaded(.success(let response)):
                state.isLoadingPage = false
                state.items.append(contentsOf: response.items)
                state.currentPage += 1
                state.hasMorePages = response.hasMore
                return .none
                
            case .pageLoaded(.failure(let error)):
                state.isLoadingPage = false
                state.error = error.localizedDescription
                return .none
                
            case .refresh:
                state.items = []
                state.currentPage = 1
                state.hasMorePages = true
                state.error = nil
                return .send(.loadNextPage)
            }
        }
    }
}
```

### Form Validation

```swift
@Reducer
struct RegistrationFormFeature {
    @ObservableState
    struct State: Equatable {
        var username: String = ""
        var email: String = ""
        var password: String = ""
        var confirmPassword: String = ""
        
        var usernameError: String?
        var emailError: String?
        var passwordError: String?
        var confirmPasswordError: String?
        
        var isValid: Bool {
            !username.isEmpty &&
            !email.isEmpty &&
            !password.isEmpty &&
            password == confirmPassword &&
            usernameError == nil &&
            emailError == nil &&
            passwordError == nil &&
            confirmPasswordError == nil
        }
    }
    
    enum Action: BindableAction {
        case binding(BindingAction<State>)
        case validateUsername
        case validateEmail
        case validatePassword
        case submit
    }
    
    @Dependency(\.validationClient) var validationClient
    
    var body: some ReducerOf<Self> {
        BindingReducer()
        
        Reduce { state, action in
            switch action {
            case .binding(\.username):
                state.usernameError = nil
                return .send(.validateUsername)
                    .debounce(id: "username-validation", for: .milliseconds(500), scheduler: DispatchQueue.main)
                
            case .validateUsername:
                if state.username.count < 3 {
                    state.usernameError = "Username must be at least 3 characters"
                } else if !state.username.allSatisfy({ $0.isLetter || $0.isNumber }) {
                    state.usernameError = "Username can only contain letters and numbers"
                }
                return .none
                
            case .binding(\.email):
                state.emailError = nil
                return .send(.validateEmail)
                    .debounce(id: "email-validation", for: .milliseconds(500), scheduler: DispatchQueue.main)
                
            case .validateEmail:
                if !validationClient.isValidEmail(state.email) {
                    state.emailError = "Please enter a valid email address"
                }
                return .none
                
            case .binding(\.password), .binding(\.confirmPassword):
                return .send(.validatePassword)
                
            case .validatePassword:
                if state.password.count < 8 {
                    state.passwordError = "Password must be at least 8 characters"
                } else {
                    state.passwordError = nil
                }
                
                if !state.confirmPassword.isEmpty && state.password != state.confirmPassword {
                    state.confirmPasswordError = "Passwords don't match"
                } else {
                    state.confirmPasswordError = nil
                }
                return .none
                
            case .binding:
                return .none
                
            case .submit:
                guard state.isValid else { return .none }
                // Handle submission
                return .none
            }
        }
    }
}
```

---

## Migration Guide

### From UIKit/AppDelegate

```swift
// Before: AppDelegate
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow()
        window?.rootViewController = MainViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

// After: TCA App
@main
struct MyApp: App {
    let store = Store(initialState: AppFeature.State()) {
        AppFeature()
    }
    
    var body: some Scene {
        WindowGroup {
            AppView(store: store)
        }
    }
}
```

### From MVVM

```swift
// Before: MVVM ViewModel
class UserViewModel: ObservableObject {
    @Published var user: User?
    @Published var isLoading = false
    
    private let service: UserService
    
    init(service: UserService) {
        self.service = service
    }
    
    func loadUser(id: Int) async {
        isLoading = true
        user = try? await service.fetchUser(id: id)
        isLoading = false
    }
}

// After: TCA Reducer
@Reducer
struct UserFeature {
    @ObservableState
    struct State: Equatable {
        var user: User?
        var isLoading = false
    }
    
    enum Action {
        case loadUser(id: Int)
        case userLoaded(Result<User, Error>)
    }
    
    @Dependency(\.userClient) var userClient
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .loadUser(let id):
                state.isLoading = true
                return .run { send in
                    let result = await Result { try await userClient.fetchUser(id) }
                    await send(.userLoaded(result))
                }
                
            case .userLoaded(.success(let user)):
                state.isLoading = false
                state.user = user
                return .none
                
            case .userLoaded(.failure):
                state.isLoading = false
                return .none
            }
        }
    }
}
```

---

## Best Practices

### State Design

| Do | Don't |
|----|-------|
| Keep state minimal | Store derived data |
| Use value types | Use reference types in state |
| Normalize data | Duplicate data |
| Make state Equatable | Ignore equality |

### Action Design

| Do | Don't |
|----|-------|
| Name by what happened | Name by what should happen |
| Use delegate actions | Access parent state directly |
| Keep actions granular | Create catch-all actions |
| Group related actions | Flatten all actions |

### Effect Design

| Do | Don't |
|----|-------|
| Cancel unneeded work | Let stale requests complete |
| Handle errors explicitly | Ignore failures |
| Use typed dependencies | Access singletons directly |
| Test effect behavior | Skip effect tests |

### Testing

| Do | Don't |
|----|-------|
| Test all state changes | Only test happy paths |
| Use TestStore exhaustively | Use non-exhaustive by default |
| Override dependencies | Use live dependencies |
| Test timing with TestClock | Use real time in tests |

---

## Resources

### Official

- [GitHub Repository](https://github.com/pointfreeco/swift-composable-architecture)
- [Documentation](https://pointfreeco.github.io/swift-composable-architecture/main/documentation/composablearchitecture/)
- [Point-Free Videos](https://www.pointfree.co/collections/composable-architecture)

### Community

- [TCA Community Slack](https://pointfree.co/slack)
- [GitHub Discussions](https://github.com/pointfreeco/swift-composable-architecture/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/swift-composable-architecture)

### Example Projects

- [isowords](https://github.com/pointfreeco/isowords) - Word game built with TCA
- [Standups](https://github.com/pointfreeco/standups) - Meeting timer app
- [SpeakLine](https://github.com/nicksuits/SpeakLine) - Text-to-speech app

---

## Conclusion

The Composable Architecture provides a robust foundation for building iOS applications. Its emphasis on composition, testability, and predictability makes it an excellent choice for teams seeking consistency and maintainability.

Key takeaways:

1. **State is the source of truth** - All UI derives from state
2. **Actions describe events** - Not commands
3. **Effects handle the outside world** - In a controlled, testable way
4. **Dependencies are injectable** - Making everything testable
5. **Composition scales** - From small to large features

Master these concepts, and you'll be well-equipped to build sophisticated iOS applications with confidence.

---

*Last updated: 2024*
