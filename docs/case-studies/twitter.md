# Twitter/X Mobile Architecture Case Study

An in-depth analysis of Twitter's (now X) mobile architecture evolution, challenges, and solutions for building one of the world's most demanding real-time social platforms.

---

## Table of Contents

1. [Overview](#overview)
2. [Historical Evolution](#historical-evolution)
3. [iOS Architecture](#ios-architecture)
4. [Android Architecture](#android-architecture)
5. [Timeline Rendering](#timeline-rendering)
6. [Networking Layer](#networking-layer)
7. [Offline Support](#offline-support)
8. [Media Handling](#media-handling)
9. [Real-Time Features](#real-time-features)
10. [Performance Optimizations](#performance-optimizations)
11. [Testing Strategy](#testing-strategy)
12. [Lessons Learned](#lessons-learned)

---

## Overview

### Platform Statistics

| Metric | Value |
|--------|-------|
| Daily Active Users | 250M+ |
| Tweets per Day | 500M+ |
| Mobile Traffic | ~80% |
| iOS App Size | ~120MB |
| Android App Size | ~90MB |
| Supported Languages | 40+ |

### Engineering Challenges

1. **Scale**: Millions of concurrent users
2. **Real-time**: Sub-second tweet delivery
3. **Media**: Images, videos, GIFs at scale
4. **Global**: Low-latency worldwide
5. **Battery**: Efficient background updates
6. **Offline**: Graceful degradation

---

## Historical Evolution

### Timeline of Architectural Changes

#### 2010-2013: Monolithic Era
- Single codebase
- MVC architecture
- Direct API calls
- Limited offline support

#### 2014-2016: Modularization
- Feature modules introduced
- Networking layer abstraction
- Image pipeline improvements
- Basic caching layer

#### 2017-2019: Modern Architecture
- Unidirectional data flow
- Reactive programming adoption
- Component-based UI
- Advanced prefetching

#### 2020-Present: Platform Convergence
- Shared business logic
- GraphQL adoption
- Feature flags at scale
- Machine learning integration

---

## iOS Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Views     │ │ ViewModels  │ │    Coordinators     │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  Use Cases  │ │  Entities   │ │    Repositories     │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Network   │ │   Storage   │ │      Sync           │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Module Structure

```
Twitter/
├── App/
│   ├── AppDelegate.swift
│   ├── SceneDelegate.swift
│   └── AppCoordinator.swift
├── Core/
│   ├── Networking/
│   ├── Storage/
│   ├── Analytics/
│   └── Utilities/
├── Features/
│   ├── Timeline/
│   │   ├── Data/
│   │   ├── Domain/
│   │   └── Presentation/
│   ├── Tweet/
│   ├── Profile/
│   ├── Search/
│   ├── Notifications/
│   └── Messages/
├── Shared/
│   ├── Components/
│   ├── Extensions/
│   └── Resources/
└── Tests/
```

### Dependency Injection

```swift
// Service container
final class ServiceContainer {
    static let shared = ServiceContainer()
    
    private var services: [String: Any] = [:]
    private let lock = NSRecursiveLock()
    
    func register<T>(_ service: T, for type: T.Type) {
        lock.lock()
        defer { lock.unlock() }
        
        let key = String(describing: type)
        services[key] = service
    }
    
    func resolve<T>(_ type: T.Type) -> T {
        lock.lock()
        defer { lock.unlock() }
        
        let key = String(describing: type)
        guard let service = services[key] as? T else {
            fatalError("Service not registered: \(key)")
        }
        return service
    }
}

// Usage
@propertyWrapper
struct Injected<T> {
    private var service: T
    
    init() {
        self.service = ServiceContainer.shared.resolve(T.self)
    }
    
    var wrappedValue: T {
        get { service }
        mutating set { service = newValue }
    }
}

class TimelineViewModel {
    @Injected private var timelineRepository: TimelineRepository
    @Injected private var analyticsService: AnalyticsService
}
```

### ViewModel Pattern

```swift
final class TimelineViewModel: ObservableObject {
    // Published state
    @Published private(set) var state: TimelineState = .idle
    @Published private(set) var tweets: [Tweet] = []
    @Published private(set) var isRefreshing: Bool = false
    
    // Dependencies
    private let timelineUseCase: TimelineUseCase
    private let engagementTracker: EngagementTracker
    private var cancellables = Set<AnyCancellable>()
    
    init(
        timelineUseCase: TimelineUseCase,
        engagementTracker: EngagementTracker
    ) {
        self.timelineUseCase = timelineUseCase
        self.engagementTracker = engagementTracker
        
        setupBindings()
    }
    
    private func setupBindings() {
        // Real-time updates
        timelineUseCase.tweetStream
            .receive(on: DispatchQueue.main)
            .sink { [weak self] newTweet in
                self?.handleNewTweet(newTweet)
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Actions
    
    func loadTimeline() {
        guard state != .loading else { return }
        state = .loading
        
        Task { @MainActor in
            do {
                let tweets = try await timelineUseCase.fetchTimeline()
                self.tweets = tweets
                self.state = .loaded
            } catch {
                self.state = .error(error.localizedDescription)
            }
        }
    }
    
    func refresh() async {
        isRefreshing = true
        defer { isRefreshing = false }
        
        do {
            let freshTweets = try await timelineUseCase.refreshTimeline()
            tweets = freshTweets
            engagementTracker.trackRefresh()
        } catch {
            // Keep existing tweets on refresh failure
        }
    }
    
    func loadMore() {
        guard let lastTweet = tweets.last else { return }
        
        Task { @MainActor in
            do {
                let moreTweets = try await timelineUseCase.fetchMore(after: lastTweet.id)
                tweets.append(contentsOf: moreTweets)
            } catch {
                // Handle pagination error
            }
        }
    }
    
    func likeTweet(_ tweet: Tweet) {
        // Optimistic update
        updateTweet(tweet.id) { $0.isLiked = true; $0.likeCount += 1 }
        
        Task {
            do {
                try await timelineUseCase.likeTweet(tweet.id)
            } catch {
                // Rollback on failure
                updateTweet(tweet.id) { $0.isLiked = false; $0.likeCount -= 1 }
            }
        }
    }
    
    private func updateTweet(_ id: Tweet.ID, update: (inout Tweet) -> Void) {
        guard let index = tweets.firstIndex(where: { $0.id == id }) else { return }
        var tweet = tweets[index]
        update(&tweet)
        tweets[index] = tweet
    }
    
    private func handleNewTweet(_ tweet: Tweet) {
        // Insert at top with animation
        tweets.insert(tweet, at: 0)
        
        // Limit memory usage
        if tweets.count > 500 {
            tweets = Array(tweets.prefix(500))
        }
    }
}

enum TimelineState: Equatable {
    case idle
    case loading
    case loaded
    case error(String)
}
```

---

## Android Architecture

### Architecture Components

Twitter for Android uses a modified MVVM with clean architecture principles:

```kotlin
// ViewModel
class TimelineViewModel @Inject constructor(
    private val getTimelineUseCase: GetTimelineUseCase,
    private val likeTweetUseCase: LikeTweetUseCase,
    private val analyticsTracker: AnalyticsTracker
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<TimelineUiState>(TimelineUiState.Loading)
    val uiState: StateFlow<TimelineUiState> = _uiState.asStateFlow()
    
    private val _tweets = MutableStateFlow<List<Tweet>>(emptyList())
    val tweets: StateFlow<List<Tweet>> = _tweets.asStateFlow()
    
    init {
        loadTimeline()
    }
    
    fun loadTimeline() {
        viewModelScope.launch {
            _uiState.value = TimelineUiState.Loading
            
            getTimelineUseCase()
                .catch { e ->
                    _uiState.value = TimelineUiState.Error(e.message ?: "Unknown error")
                }
                .collect { tweets ->
                    _tweets.value = tweets
                    _uiState.value = TimelineUiState.Success
                }
        }
    }
    
    fun likeTweet(tweetId: String) {
        // Optimistic update
        _tweets.value = _tweets.value.map { tweet ->
            if (tweet.id == tweetId) {
                tweet.copy(isLiked = true, likeCount = tweet.likeCount + 1)
            } else tweet
        }
        
        viewModelScope.launch {
            try {
                likeTweetUseCase(tweetId)
                analyticsTracker.trackLike(tweetId)
            } catch (e: Exception) {
                // Rollback
                _tweets.value = _tweets.value.map { tweet ->
                    if (tweet.id == tweetId) {
                        tweet.copy(isLiked = false, likeCount = tweet.likeCount - 1)
                    } else tweet
                }
            }
        }
    }
    
    fun refresh() {
        viewModelScope.launch {
            try {
                val freshTweets = getTimelineUseCase.refresh()
                _tweets.value = freshTweets
            } catch (e: Exception) {
                // Keep existing on refresh failure
            }
        }
    }
}

sealed class TimelineUiState {
    object Loading : TimelineUiState()
    object Success : TimelineUiState()
    data class Error(val message: String) : TimelineUiState()
}
```

### Dagger Hilt Integration

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        loggingInterceptor: HttpLoggingInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideTwitterApi(retrofit: Retrofit): TwitterApi {
        return retrofit.create(TwitterApi::class.java)
    }
}

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {
    
    @Provides
    @Singleton
    fun provideTimelineRepository(
        api: TwitterApi,
        database: TwitterDatabase,
        networkMonitor: NetworkMonitor
    ): TimelineRepository {
        return TimelineRepositoryImpl(api, database, networkMonitor)
    }
}
```

---

## Timeline Rendering

### Cell Recycling Architecture

```swift
// Tweet cell configuration
final class TweetCell: UICollectionViewCell {
    // Subviews
    private let avatarImageView = AvatarImageView()
    private let nameLabel = UILabel()
    private let handleLabel = UILabel()
    private let contentLabel = TweetTextView()
    private let mediaView = MediaContainerView()
    private let engagementBar = EngagementBarView()
    
    // Reuse handling
    override func prepareForReuse() {
        super.prepareForReuse()
        avatarImageView.cancelLoading()
        mediaView.reset()
        contentLabel.text = nil
    }
    
    func configure(with viewModel: TweetCellViewModel) {
        nameLabel.text = viewModel.displayName
        handleLabel.text = viewModel.handle
        contentLabel.attributedText = viewModel.attributedContent
        
        avatarImageView.loadImage(url: viewModel.avatarURL)
        mediaView.configure(with: viewModel.media)
        engagementBar.configure(
            likes: viewModel.likeCount,
            retweets: viewModel.retweetCount,
            replies: viewModel.replyCount
        )
    }
}

// Diffable data source
final class TimelineDataSource {
    typealias DataSource = UICollectionViewDiffableDataSource<Section, TweetItem>
    typealias Snapshot = NSDiffableDataSourceSnapshot<Section, TweetItem>
    
    enum Section {
        case main
    }
    
    struct TweetItem: Hashable {
        let id: String
        let tweet: Tweet
        
        func hash(into hasher: inout Hasher) {
            hasher.combine(id)
        }
        
        static func == (lhs: TweetItem, rhs: TweetItem) -> Bool {
            lhs.id == rhs.id
        }
    }
    
    private var dataSource: DataSource!
    
    func configure(collectionView: UICollectionView) {
        dataSource = DataSource(collectionView: collectionView) { collectionView, indexPath, item in
            let cell = collectionView.dequeueReusableCell(
                withReuseIdentifier: TweetCell.reuseIdentifier,
                for: indexPath
            ) as! TweetCell
            
            cell.configure(with: TweetCellViewModel(tweet: item.tweet))
            return cell
        }
    }
    
    func apply(tweets: [Tweet], animated: Bool = true) {
        var snapshot = Snapshot()
        snapshot.appendSections([.main])
        snapshot.appendItems(tweets.map { TweetItem(id: $0.id, tweet: $0) })
        dataSource.apply(snapshot, animatingDifferences: animated)
    }
    
    func insert(tweet: Tweet, at index: Int) {
        var snapshot = dataSource.snapshot()
        let item = TweetItem(id: tweet.id, tweet: tweet)
        
        if index == 0 {
            if let firstItem = snapshot.itemIdentifiers.first {
                snapshot.insertItems([item], beforeItem: firstItem)
            } else {
                snapshot.appendItems([item])
            }
        }
        
        dataSource.apply(snapshot, animatingDifferences: true)
    }
}
```

### Layout Calculation

```swift
// Pre-calculating cell heights
final class TweetLayoutCalculator {
    private let cache = NSCache<NSString, NSValue>()
    private let width: CGFloat
    
    init(width: CGFloat) {
        self.width = width
        cache.countLimit = 500
    }
    
    func height(for tweet: Tweet) -> CGFloat {
        let cacheKey = "\(tweet.id)-\(width)" as NSString
        
        if let cached = cache.object(forKey: cacheKey) {
            return cached.cgSizeValue.height
        }
        
        let height = calculateHeight(for: tweet)
        cache.setObject(NSValue(cgSize: CGSize(width: width, height: height)), forKey: cacheKey)
        
        return height
    }
    
    private func calculateHeight(for tweet: Tweet) -> CGFloat {
        var height: CGFloat = 0
        
        // Header (avatar, name, handle)
        height += Constants.headerHeight
        
        // Content text
        let textWidth = width - Constants.horizontalPadding * 2 - Constants.avatarSize - Constants.avatarSpacing
        let textHeight = tweet.attributedContent.boundingRect(
            with: CGSize(width: textWidth, height: .greatestFiniteMagnitude),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            context: nil
        ).height
        height += ceil(textHeight)
        
        // Media
        if !tweet.media.isEmpty {
            height += Constants.mediaSpacing
            height += calculateMediaHeight(tweet.media)
        }
        
        // Engagement bar
        height += Constants.engagementBarHeight
        
        // Padding
        height += Constants.verticalPadding * 2
        
        return height
    }
    
    private func calculateMediaHeight(_ media: [MediaAttachment]) -> CGFloat {
        let mediaWidth = width - Constants.horizontalPadding * 2 - Constants.avatarSize - Constants.avatarSpacing
        
        switch media.count {
        case 1:
            let aspectRatio = media[0].aspectRatio
            return min(mediaWidth / aspectRatio, Constants.maxMediaHeight)
        case 2:
            return Constants.twoMediaHeight
        case 3, 4:
            return Constants.multiMediaHeight
        default:
            return 0
        }
    }
}
```

---

## Networking Layer

### API Client Architecture

```swift
// API client
final class TwitterAPIClient {
    private let session: URLSession
    private let baseURL: URL
    private let authProvider: AuthProvider
    private let requestBuilder: RequestBuilder
    
    init(
        session: URLSession = .shared,
        baseURL: URL,
        authProvider: AuthProvider,
        requestBuilder: RequestBuilder
    ) {
        self.session = session
        self.baseURL = baseURL
        self.authProvider = authProvider
        self.requestBuilder = requestBuilder
    }
    
    func request<T: Decodable>(
        _ endpoint: Endpoint,
        responseType: T.Type
    ) async throws -> T {
        let request = try await buildRequest(for: endpoint)
        
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        try validateResponse(httpResponse, data: data)
        
        return try JSONDecoder.twitter.decode(T.self, from: data)
    }
    
    private func buildRequest(for endpoint: Endpoint) async throws -> URLRequest {
        var request = requestBuilder.build(endpoint, baseURL: baseURL)
        
        // Add auth header
        let token = try await authProvider.getAccessToken()
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        return request
    }
    
    private func validateResponse(_ response: HTTPURLResponse, data: Data) throws {
        switch response.statusCode {
        case 200..<300:
            return
        case 401:
            throw APIError.unauthorized
        case 429:
            let retryAfter = response.value(forHTTPHeaderField: "Retry-After")
            throw APIError.rateLimited(retryAfter: Int(retryAfter ?? "60") ?? 60)
        case 400..<500:
            let error = try? JSONDecoder().decode(APIErrorResponse.self, from: data)
            throw APIError.clientError(error?.message ?? "Unknown error")
        case 500..<600:
            throw APIError.serverError
        default:
            throw APIError.unknown
        }
    }
}

// Endpoint definition
enum TimelineEndpoint: Endpoint {
    case home(maxId: String?, count: Int)
    case user(userId: String, maxId: String?, count: Int)
    case mentions(maxId: String?, count: Int)
    
    var path: String {
        switch self {
        case .home:
            return "/1.1/statuses/home_timeline.json"
        case .user:
            return "/1.1/statuses/user_timeline.json"
        case .mentions:
            return "/1.1/statuses/mentions_timeline.json"
        }
    }
    
    var method: HTTPMethod { .get }
    
    var parameters: [String: Any]? {
        switch self {
        case .home(let maxId, let count):
            var params: [String: Any] = ["count": count, "tweet_mode": "extended"]
            if let maxId = maxId { params["max_id"] = maxId }
            return params
        case .user(let userId, let maxId, let count):
            var params: [String: Any] = ["user_id": userId, "count": count, "tweet_mode": "extended"]
            if let maxId = maxId { params["max_id"] = maxId }
            return params
        case .mentions(let maxId, let count):
            var params: [String: Any] = ["count": count, "tweet_mode": "extended"]
            if let maxId = maxId { params["max_id"] = maxId }
            return params
        }
    }
}
```

### Request Retry and Backoff

```swift
// Retry policy
struct RetryPolicy {
    let maxRetries: Int
    let baseDelay: TimeInterval
    let maxDelay: TimeInterval
    let jitterFactor: Double
    
    static let `default` = RetryPolicy(
        maxRetries: 3,
        baseDelay: 1.0,
        maxDelay: 30.0,
        jitterFactor: 0.2
    )
    
    func delay(for attempt: Int) -> TimeInterval {
        let exponentialDelay = baseDelay * pow(2.0, Double(attempt))
        let clampedDelay = min(exponentialDelay, maxDelay)
        let jitter = clampedDelay * jitterFactor * Double.random(in: -1...1)
        return clampedDelay + jitter
    }
}

// Retry wrapper
func withRetry<T>(
    policy: RetryPolicy = .default,
    operation: () async throws -> T
) async throws -> T {
    var lastError: Error?
    
    for attempt in 0..<policy.maxRetries {
        do {
            return try await operation()
        } catch let error as APIError {
            lastError = error
            
            // Don't retry certain errors
            switch error {
            case .unauthorized, .clientError:
                throw error
            case .rateLimited(let retryAfter):
                try await Task.sleep(nanoseconds: UInt64(retryAfter) * 1_000_000_000)
                continue
            default:
                break
            }
            
            if attempt < policy.maxRetries - 1 {
                let delay = policy.delay(for: attempt)
                try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
            }
        }
    }
    
    throw lastError ?? APIError.unknown
}
```

---

## Offline Support

### Caching Strategy

```swift
// Cache manager
final class TimelineCacheManager {
    private let database: TimelineDatabase
    private let memoryCache: NSCache<NSString, CachedTimeline>
    
    init(database: TimelineDatabase) {
        self.database = database
        self.memoryCache = NSCache()
        self.memoryCache.countLimit = 10
    }
    
    func cache(tweets: [Tweet], for timelineType: TimelineType) async {
        // Memory cache
        let cached = CachedTimeline(tweets: tweets, timestamp: Date())
        memoryCache.setObject(cached, forKey: timelineType.cacheKey as NSString)
        
        // Disk cache
        await database.saveTweets(tweets, for: timelineType)
        
        // Prune old data
        await database.pruneOldTweets(olderThan: Date().addingTimeInterval(-7 * 24 * 60 * 60))
    }
    
    func getCached(for timelineType: TimelineType) async -> [Tweet]? {
        // Check memory first
        if let cached = memoryCache.object(forKey: timelineType.cacheKey as NSString) {
            if cached.isValid {
                return cached.tweets
            }
        }
        
        // Fall back to disk
        if let tweets = await database.getTweets(for: timelineType) {
            // Populate memory cache
            let cached = CachedTimeline(tweets: tweets, timestamp: Date())
            memoryCache.setObject(cached, forKey: timelineType.cacheKey as NSString)
            return tweets
        }
        
        return nil
    }
    
    func invalidate(for timelineType: TimelineType) async {
        memoryCache.removeObject(forKey: timelineType.cacheKey as NSString)
        await database.deleteTweets(for: timelineType)
    }
}

class CachedTimeline {
    let tweets: [Tweet]
    let timestamp: Date
    
    init(tweets: [Tweet], timestamp: Date) {
        self.tweets = tweets
        self.timestamp = timestamp
    }
    
    var isValid: Bool {
        Date().timeIntervalSince(timestamp) < 5 * 60 // 5 minutes
    }
}
```

### Offline-First Repository

```swift
final class TimelineRepository {
    private let api: TwitterAPIClient
    private let cache: TimelineCacheManager
    private let networkMonitor: NetworkMonitor
    
    init(api: TwitterAPIClient, cache: TimelineCacheManager, networkMonitor: NetworkMonitor) {
        self.api = api
        self.cache = cache
        self.networkMonitor = networkMonitor
    }
    
    func getTimeline(
        type: TimelineType,
        forceRefresh: Bool = false
    ) async throws -> [Tweet] {
        // Return cached if offline
        if !networkMonitor.isConnected {
            if let cached = await cache.getCached(for: type) {
                return cached
            }
            throw TimelineError.offlineNoCache
        }
        
        // Return cached while fetching fresh data
        if !forceRefresh, let cached = await cache.getCached(for: type) {
            // Fetch fresh in background
            Task {
                try? await fetchAndCache(type: type)
            }
            return cached
        }
        
        // Fetch fresh data
        return try await fetchAndCache(type: type)
    }
    
    private func fetchAndCache(type: TimelineType) async throws -> [Tweet] {
        let tweets = try await api.request(
            type.endpoint,
            responseType: [TweetDTO].self
        ).map { $0.toDomain() }
        
        await cache.cache(tweets: tweets, for: type)
        
        return tweets
    }
}
```

---

## Media Handling

### Image Pipeline

```swift
// Image loader with caching
final class TweetImageLoader {
    static let shared = TweetImageLoader()
    
    private let memoryCache: NSCache<NSURL, UIImage>
    private let diskCache: DiskCache
    private let downloader: ImageDownloader
    private var tasks: [URL: Task<UIImage, Error>] = [:]
    private let lock = NSLock()
    
    init() {
        memoryCache = NSCache()
        memoryCache.totalCostLimit = 100 * 1024 * 1024 // 100MB
        
        diskCache = DiskCache(
            name: "tweet_images",
            sizeLimit: 500 * 1024 * 1024 // 500MB
        )
        
        downloader = ImageDownloader()
    }
    
    func loadImage(url: URL, size: CGSize? = nil) async throws -> UIImage {
        let cacheKey = cacheKey(for: url, size: size)
        
        // Check memory cache
        if let cached = memoryCache.object(forKey: cacheKey as NSURL) {
            return cached
        }
        
        // Check disk cache
        if let data = await diskCache.get(key: cacheKey.absoluteString),
           let image = UIImage(data: data) {
            let processed = size.map { process(image, targetSize: $0) } ?? image
            memoryCache.setObject(processed, forKey: cacheKey as NSURL, cost: data.count)
            return processed
        }
        
        // Download
        return try await coalesce(url: url) {
            let data = try await downloader.download(url: url)
            
            // Save to disk cache
            await diskCache.set(key: url.absoluteString, data: data)
            
            guard let image = UIImage(data: data) else {
                throw ImageError.invalidData
            }
            
            let processed = size.map { process(image, targetSize: $0) } ?? image
            memoryCache.setObject(processed, forKey: cacheKey as NSURL, cost: data.count)
            
            return processed
        }
    }
    
    private func coalesce(url: URL, operation: @escaping () async throws -> UIImage) async throws -> UIImage {
        lock.lock()
        
        if let existingTask = tasks[url] {
            lock.unlock()
            return try await existingTask.value
        }
        
        let task = Task { try await operation() }
        tasks[url] = task
        lock.unlock()
        
        defer {
            lock.lock()
            tasks[url] = nil
            lock.unlock()
        }
        
        return try await task.value
    }
    
    private func cacheKey(for url: URL, size: CGSize?) -> URL {
        guard let size = size else { return url }
        return url.appendingPathComponent("_\(Int(size.width))x\(Int(size.height))")
    }
    
    private func process(_ image: UIImage, targetSize: CGSize) -> UIImage {
        let renderer = UIGraphicsImageRenderer(size: targetSize)
        return renderer.image { _ in
            image.draw(in: CGRect(origin: .zero, size: targetSize))
        }
    }
}
```

### Video Player

```swift
// Video player manager
final class TweetVideoPlayerManager {
    static let shared = TweetVideoPlayerManager()
    
    private var players: [String: AVPlayer] = [:]
    private var currentlyPlaying: String?
    private let maxConcurrentPlayers = 3
    
    func player(for tweetId: String, url: URL) -> AVPlayer {
        if let existing = players[tweetId] {
            return existing
        }
        
        // Evict if at capacity
        if players.count >= maxConcurrentPlayers {
            evictLeastRecentlyUsed()
        }
        
        let player = AVPlayer(url: url)
        player.automaticallyWaitsToMinimizeStalling = true
        players[tweetId] = player
        
        return player
    }
    
    func play(tweetId: String) {
        // Pause current
        if let current = currentlyPlaying, current != tweetId {
            players[current]?.pause()
        }
        
        players[tweetId]?.play()
        currentlyPlaying = tweetId
    }
    
    func pause(tweetId: String) {
        players[tweetId]?.pause()
        if currentlyPlaying == tweetId {
            currentlyPlaying = nil
        }
    }
    
    func pauseAll() {
        players.values.forEach { $0.pause() }
        currentlyPlaying = nil
    }
    
    private func evictLeastRecentlyUsed() {
        // Remove the oldest non-playing player
        for (id, player) in players {
            if id != currentlyPlaying {
                player.pause()
                players[id] = nil
                break
            }
        }
    }
}
```

---

## Real-Time Features

### WebSocket Connection

```swift
// Real-time streaming
final class TwitterStreamingClient {
    private var socket: URLSessionWebSocketTask?
    private let session: URLSession
    private let authProvider: AuthProvider
    
    private var eventContinuation: AsyncStream<StreamEvent>.Continuation?
    
    var events: AsyncStream<StreamEvent> {
        AsyncStream { continuation in
            self.eventContinuation = continuation
        }
    }
    
    func connect() async throws {
        let token = try await authProvider.getAccessToken()
        
        var request = URLRequest(url: URL(string: "wss://stream.twitter.com/1.1/user.json")!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        socket = session.webSocketTask(with: request)
        socket?.resume()
        
        await receiveMessages()
    }
    
    func disconnect() {
        socket?.cancel(with: .goingAway, reason: nil)
        socket = nil
        eventContinuation?.finish()
    }
    
    private func receiveMessages() async {
        guard let socket = socket else { return }
        
        do {
            while true {
                let message = try await socket.receive()
                
                switch message {
                case .string(let text):
                    if let event = parseEvent(text) {
                        eventContinuation?.yield(event)
                    }
                case .data(let data):
                    if let text = String(data: data, encoding: .utf8),
                       let event = parseEvent(text) {
                        eventContinuation?.yield(event)
                    }
                @unknown default:
                    break
                }
            }
        } catch {
            eventContinuation?.yield(.error(error))
            
            // Reconnect on error
            Task {
                try await Task.sleep(nanoseconds: 5_000_000_000)
                try await connect()
            }
        }
    }
    
    private func parseEvent(_ json: String) -> StreamEvent? {
        guard let data = json.data(using: .utf8) else { return nil }
        
        do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .twitter
            
            // Try different event types
            if let tweet = try? decoder.decode(TweetStreamEvent.self, from: data) {
                return .tweet(tweet.tweet)
            }
            if let like = try? decoder.decode(LikeStreamEvent.self, from: data) {
                return .like(like)
            }
            if let follow = try? decoder.decode(FollowStreamEvent.self, from: data) {
                return .follow(follow)
            }
            
            return nil
        }
    }
}

enum StreamEvent {
    case tweet(Tweet)
    case like(LikeStreamEvent)
    case follow(FollowStreamEvent)
    case error(Error)
}
```

---

## Performance Optimizations

### Prefetching

```swift
// Timeline prefetcher
final class TimelinePrefetcher: NSObject, UICollectionViewDataSourcePrefetching {
    private let imageLoader: TweetImageLoader
    private var prefetchTasks: [IndexPath: [Task<Void, Never>]] = [:]
    
    init(imageLoader: TweetImageLoader) {
        self.imageLoader = imageLoader
    }
    
    func collectionView(
        _ collectionView: UICollectionView,
        prefetchItemsAt indexPaths: [IndexPath]
    ) {
        for indexPath in indexPaths {
            guard let tweet = tweet(at: indexPath) else { continue }
            
            var tasks: [Task<Void, Never>] = []
            
            // Prefetch avatar
            if let avatarURL = tweet.author.avatarURL {
                let task = Task {
                    _ = try? await imageLoader.loadImage(url: avatarURL, size: CGSize(width: 48, height: 48))
                }
                tasks.append(task)
            }
            
            // Prefetch media
            for media in tweet.media.prefix(2) {
                if let thumbnailURL = media.thumbnailURL {
                    let task = Task {
                        _ = try? await imageLoader.loadImage(url: thumbnailURL)
                    }
                    tasks.append(task)
                }
            }
            
            prefetchTasks[indexPath] = tasks
        }
    }
    
    func collectionView(
        _ collectionView: UICollectionView,
        cancelPrefetchingForItemsAt indexPaths: [IndexPath]
    ) {
        for indexPath in indexPaths {
            prefetchTasks[indexPath]?.forEach { $0.cancel() }
            prefetchTasks[indexPath] = nil
        }
    }
    
    private func tweet(at indexPath: IndexPath) -> Tweet? {
        // Get from data source
        return nil
    }
}
```

### Memory Management

```swift
// Memory pressure handler
final class MemoryPressureHandler {
    static let shared = MemoryPressureHandler()
    
    private var observers: [() -> Void] = []
    
    init() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleMemoryWarning),
            name: UIApplication.didReceiveMemoryWarningNotification,
            object: nil
        )
    }
    
    func addObserver(_ handler: @escaping () -> Void) {
        observers.append(handler)
    }
    
    @objc private func handleMemoryWarning() {
        // Clear caches
        URLCache.shared.removeAllCachedResponses()
        TweetImageLoader.shared.clearMemoryCache()
        TweetVideoPlayerManager.shared.pauseAll()
        
        // Notify observers
        observers.forEach { $0() }
    }
}
```

---

## Testing Strategy

### Test Pyramid

```
                    ┌─────────────────┐
                    │    E2E Tests    │  5%
                    │    (UI Tests)   │
                    └────────┬────────┘
                   ┌─────────┴─────────┐
                   │ Integration Tests │  20%
                   │  (Feature Tests)  │
                   └─────────┬─────────┘
                  ┌──────────┴──────────┐
                  │    Unit Tests       │  75%
                  │ (ViewModels, Logic) │
                  └─────────────────────┘
```

### Example Tests

```swift
// ViewModel tests
final class TimelineViewModelTests: XCTestCase {
    var sut: TimelineViewModel!
    var mockUseCase: MockTimelineUseCase!
    var mockTracker: MockEngagementTracker!
    
    override func setUp() {
        super.setUp()
        mockUseCase = MockTimelineUseCase()
        mockTracker = MockEngagementTracker()
        sut = TimelineViewModel(
            timelineUseCase: mockUseCase,
            engagementTracker: mockTracker
        )
    }
    
    func testLoadTimeline_Success() async {
        // Given
        let expectedTweets = [Tweet.mock(), Tweet.mock()]
        mockUseCase.tweetsToReturn = expectedTweets
        
        // When
        sut.loadTimeline()
        
        // Then
        await waitUntil { self.sut.state == .loaded }
        XCTAssertEqual(sut.tweets, expectedTweets)
    }
    
    func testLikeTweet_OptimisticUpdate() {
        // Given
        let tweet = Tweet.mock(isLiked: false, likeCount: 10)
        sut.tweets = [tweet]
        
        // When
        sut.likeTweet(tweet)
        
        // Then - immediate optimistic update
        XCTAssertTrue(sut.tweets[0].isLiked)
        XCTAssertEqual(sut.tweets[0].likeCount, 11)
    }
    
    func testLikeTweet_Rollback_OnFailure() async {
        // Given
        let tweet = Tweet.mock(isLiked: false, likeCount: 10)
        sut.tweets = [tweet]
        mockUseCase.shouldFailLike = true
        
        // When
        sut.likeTweet(tweet)
        
        // Then - rolls back after failure
        await waitUntil { !self.sut.tweets[0].isLiked }
        XCTAssertEqual(sut.tweets[0].likeCount, 10)
    }
}
```

---

## Lessons Learned

### What Worked

| Practice | Benefit |
|----------|---------|
| Offline-first | Better UX on poor connections |
| Optimistic updates | Instant feedback |
| Modular architecture | Faster builds, easier testing |
| Aggressive caching | Reduced API calls |
| Background sync | Fresh data on app open |

### Challenges Faced

| Challenge | Solution |
|-----------|----------|
| Memory pressure | Aggressive cache eviction |
| Battery drain | Coalesced network requests |
| Timeline gaps | Gap detection and filling |
| Media bandwidth | Adaptive quality based on network |
| Real-time sync | Conflict resolution strategy |

### Key Takeaways

1. **Optimize for the common case**: Most users scroll, not interact
2. **Prefetch aggressively**: Network latency is the enemy
3. **Fail gracefully**: Always have cached data to show
4. **Measure everything**: Performance regressions are silent killers
5. **Think globally**: Network conditions vary dramatically

---

## Resources

### Official

- [Twitter Developer Documentation](https://developer.twitter.com/en/docs)
- [Twitter Engineering Blog](https://blog.twitter.com/engineering)

### Conference Talks

- "Building Twitter's iOS app" - UIKonf 2019
- "Scaling Twitter for Mobile" - @Scale 2018
- "Real-time at Twitter" - Strange Loop 2017

### Related Papers

- "TAO: Facebook's Distributed Data Store" (similar patterns)
- "Scaling Memcache at Facebook" (caching strategies)

---

*Last updated: 2024*
