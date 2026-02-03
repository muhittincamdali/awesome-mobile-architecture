# Riverpod Architecture Guide

A comprehensive guide to building scalable Flutter applications with Riverpod - the reactive state management solution that combines simplicity with power.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Provider Types](#provider-types)
4. [State Management Patterns](#state-management-patterns)
5. [Architecture Layers](#architecture-layers)
6. [Testing Strategies](#testing-strategies)
7. [Advanced Patterns](#advanced-patterns)
8. [Performance Optimization](#performance-optimization)
9. [Best Practices](#best-practices)
10. [Migration Guide](#migration-guide)

---

## Introduction

### What is Riverpod?

Riverpod is a reactive caching and data-binding framework for Dart and Flutter. Created by Remi Rousselet (the author of Provider), it addresses Provider's limitations while maintaining its simplicity.

### Why Riverpod?

| Feature | Provider | Riverpod |
|---------|----------|----------|
| Compile-time safety | ❌ | ✅ |
| No BuildContext required | ❌ | ✅ |
| Multiple providers of same type | ❌ | ✅ |
| Testability | Medium | Excellent |
| Combining providers | Limited | Powerful |
| Code generation | ❌ | ✅ (optional) |

### Core Principles

1. **Declarative**: Define what state you need, not how to get it
2. **Compile-safe**: Errors caught at compile time, not runtime
3. **Testable**: Every provider is easily testable in isolation
4. **Composable**: Providers can depend on other providers
5. **Cacheable**: Automatic caching with configurable disposal

---

## Core Concepts

### ProviderScope

Every Riverpod application needs a `ProviderScope` at the root:

```dart
void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}
```

### Ref Object

The `Ref` object is your gateway to other providers:

```dart
final userProvider = Provider<User>((ref) {
  // Watch another provider (rebuilds when it changes)
  final authState = ref.watch(authProvider);
  
  // Read another provider (doesn't rebuild)
  final config = ref.read(configProvider);
  
  // Listen to changes (side effects)
  ref.listen(errorProvider, (previous, next) {
    showErrorSnackbar(next);
  });
  
  // Cleanup when disposed
  ref.onDispose(() {
    print('Provider disposed');
  });
  
  return User(id: authState.userId);
});
```

### Reading Providers in Widgets

```dart
class UserProfile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch - rebuilds widget when value changes
    final user = ref.watch(userProvider);
    
    // Read - gets current value without subscribing
    final analytics = ref.read(analyticsProvider);
    
    return Column(
      children: [
        Text(user.name),
        ElevatedButton(
          onPressed: () {
            // Use read in callbacks
            ref.read(userProvider.notifier).logout();
          },
          child: Text('Logout'),
        ),
      ],
    );
  }
}
```

### StatefulWidget Alternative

```dart
class UserProfileStateful extends ConsumerStatefulWidget {
  @override
  ConsumerState<UserProfileStateful> createState() => _UserProfileState();
}

class _UserProfileState extends ConsumerState<UserProfileStateful> {
  @override
  void initState() {
    super.initState();
    // Access ref in lifecycle methods
    ref.read(analyticsProvider).trackScreenView('profile');
  }
  
  @override
  Widget build(BuildContext context) {
    final user = ref.watch(userProvider);
    return Text(user.name);
  }
}
```

---

## Provider Types

### Provider (Read-only)

For values that don't change:

```dart
// Simple value
final apiUrlProvider = Provider<String>((ref) {
  return 'https://api.example.com';
});

// Computed value
final fullNameProvider = Provider<String>((ref) {
  final user = ref.watch(userProvider);
  return '${user.firstName} ${user.lastName}';
});

// Service/Repository
final userRepositoryProvider = Provider<UserRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return UserRepository(dio);
});
```

### StateProvider

For simple mutable state:

```dart
final counterProvider = StateProvider<int>((ref) => 0);

final filterProvider = StateProvider<Filter>((ref) => Filter.all);

// Usage
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    
    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).state++,
          child: Text('Increment'),
        ),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).update((state) => state * 2),
          child: Text('Double'),
        ),
      ],
    );
  }
}
```

### StateNotifierProvider

For complex state with logic:

```dart
// State class
@freezed
class TodosState with _$TodosState {
  factory TodosState({
    @Default([]) List<Todo> todos,
    @Default(Filter.all) Filter filter,
    @Default(false) bool isLoading,
    String? error,
  }) = _TodosState;
}

// Notifier
class TodosNotifier extends StateNotifier<TodosState> {
  TodosNotifier(this._repository) : super(TodosState());
  
  final TodoRepository _repository;
  
  Future<void> loadTodos() async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final todos = await _repository.fetchAll();
      state = state.copyWith(todos: todos, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
  
  void addTodo(String title) {
    final todo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
    );
    state = state.copyWith(todos: [...state.todos, todo]);
  }
  
  void toggleTodo(String id) {
    state = state.copyWith(
      todos: [
        for (final todo in state.todos)
          if (todo.id == id) todo.copyWith(completed: !todo.completed)
          else todo,
      ],
    );
  }
  
  void removeTodo(String id) {
    state = state.copyWith(
      todos: state.todos.where((t) => t.id != id).toList(),
    );
  }
  
  void setFilter(Filter filter) {
    state = state.copyWith(filter: filter);
  }
}

// Provider
final todosProvider = StateNotifierProvider<TodosNotifier, TodosState>((ref) {
  final repository = ref.watch(todoRepositoryProvider);
  return TodosNotifier(repository);
});

// Computed provider for filtered todos
final filteredTodosProvider = Provider<List<Todo>>((ref) {
  final state = ref.watch(todosProvider);
  
  switch (state.filter) {
    case Filter.all:
      return state.todos;
    case Filter.active:
      return state.todos.where((t) => !t.completed).toList();
    case Filter.completed:
      return state.todos.where((t) => t.completed).toList();
  }
});
```

### FutureProvider

For async data:

```dart
final userProfileProvider = FutureProvider.autoDispose<UserProfile>((ref) async {
  final userId = ref.watch(userIdProvider);
  final repository = ref.watch(userRepositoryProvider);
  
  return repository.fetchProfile(userId);
});

// With family for parameterized providers
final userProvider = FutureProvider.autoDispose.family<User, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.fetchUser(userId);
});

// Usage
class ProfileScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);
    
    return profileAsync.when(
      data: (profile) => ProfileContent(profile: profile),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => ErrorWidget(error: error),
    );
  }
}
```

### StreamProvider

For reactive data streams:

```dart
final messagesProvider = StreamProvider.autoDispose<List<Message>>((ref) {
  final chatId = ref.watch(currentChatIdProvider);
  final repository = ref.watch(chatRepositoryProvider);
  
  return repository.watchMessages(chatId);
});

final authStateProvider = StreamProvider<AuthState>((ref) {
  final auth = ref.watch(firebaseAuthProvider);
  return auth.authStateChanges().map((user) {
    if (user != null) {
      return AuthState.authenticated(user);
    }
    return AuthState.unauthenticated();
  });
});

// Usage
class ChatScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messagesAsync = ref.watch(messagesProvider);
    
    return messagesAsync.when(
      data: (messages) => MessageList(messages: messages),
      loading: () => MessageListSkeleton(),
      error: (error, stack) => ErrorView(error: error),
    );
  }
}
```

### NotifierProvider (Riverpod 2.0+)

The new recommended approach:

```dart
// Synchronous notifier
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;
  
  void increment() => state++;
  void decrement() => state--;
}

// Async notifier
@riverpod
class UserProfile extends _$UserProfile {
  @override
  Future<User> build() async {
    final userId = ref.watch(userIdProvider);
    return _fetchUser(userId);
  }
  
  Future<User> _fetchUser(String userId) async {
    final repository = ref.read(userRepositoryProvider);
    return repository.fetchUser(userId);
  }
  
  Future<void> updateName(String name) async {
    final user = await future;
    state = AsyncData(user.copyWith(name: name));
    
    await ref.read(userRepositoryProvider).updateUser(user.copyWith(name: name));
  }
}
```

---

## State Management Patterns

### Repository Pattern

```dart
// Abstract repository
abstract class UserRepository {
  Future<User> getUser(String id);
  Future<List<User>> getAllUsers();
  Future<void> createUser(User user);
  Future<void> updateUser(User user);
  Future<void> deleteUser(String id);
}

// Implementation
class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl(this._dio, this._cache);
  
  final Dio _dio;
  final CacheService _cache;
  
  @override
  Future<User> getUser(String id) async {
    // Check cache first
    final cached = await _cache.get<User>('user_$id');
    if (cached != null) return cached;
    
    // Fetch from API
    final response = await _dio.get('/users/$id');
    final user = User.fromJson(response.data);
    
    // Cache result
    await _cache.set('user_$id', user);
    
    return user;
  }
  
  // ... other methods
}

// Provider
final userRepositoryProvider = Provider<UserRepository>((ref) {
  final dio = ref.watch(dioProvider);
  final cache = ref.watch(cacheServiceProvider);
  return UserRepositoryImpl(dio, cache);
});
```

### Service Layer Pattern

```dart
// Authentication service
class AuthService {
  AuthService(this._auth, this._userRepository);
  
  final FirebaseAuth _auth;
  final UserRepository _userRepository;
  
  Stream<AuthState> get authStateChanges => _auth.authStateChanges().asyncMap((firebaseUser) async {
    if (firebaseUser == null) {
      return AuthState.unauthenticated();
    }
    
    final user = await _userRepository.getUser(firebaseUser.uid);
    return AuthState.authenticated(user);
  });
  
  Future<void> signInWithEmail(String email, String password) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
  }
  
  Future<void> signOut() async {
    await _auth.signOut();
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  final auth = ref.watch(firebaseAuthProvider);
  final userRepository = ref.watch(userRepositoryProvider);
  return AuthService(auth, userRepository);
});

final authStateProvider = StreamProvider<AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.authStateChanges;
});
```

### Use Case Pattern

```dart
// Use case interface
abstract class UseCase<Input, Output> {
  Future<Output> execute(Input input);
}

// Implementation
class GetUserUseCase implements UseCase<String, User> {
  GetUserUseCase(this._repository);
  
  final UserRepository _repository;
  
  @override
  Future<User> execute(String userId) {
    return _repository.getUser(userId);
  }
}

class CreateOrderUseCase implements UseCase<CreateOrderParams, Order> {
  CreateOrderUseCase(this._orderRepository, this._paymentService);
  
  final OrderRepository _orderRepository;
  final PaymentService _paymentService;
  
  @override
  Future<Order> execute(CreateOrderParams params) async {
    // Validate
    if (params.items.isEmpty) {
      throw ValidationException('Order must have at least one item');
    }
    
    // Process payment
    final paymentResult = await _paymentService.charge(
      amount: params.totalAmount,
      method: params.paymentMethod,
    );
    
    if (!paymentResult.success) {
      throw PaymentException(paymentResult.error!);
    }
    
    // Create order
    final order = Order(
      id: generateOrderId(),
      items: params.items,
      paymentId: paymentResult.transactionId,
      status: OrderStatus.confirmed,
    );
    
    return _orderRepository.createOrder(order);
  }
}

// Providers
final getUserUseCaseProvider = Provider<GetUserUseCase>((ref) {
  return GetUserUseCase(ref.watch(userRepositoryProvider));
});

final createOrderUseCaseProvider = Provider<CreateOrderUseCase>((ref) {
  return CreateOrderUseCase(
    ref.watch(orderRepositoryProvider),
    ref.watch(paymentServiceProvider),
  );
});
```

---

## Architecture Layers

### Recommended Structure

```
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── extensions/
│   ├── network/
│   └── utils/
├── data/
│   ├── models/
│   ├── repositories/
│   └── sources/
│       ├── local/
│       └── remote/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── presentation/
│   ├── providers/
│   ├── screens/
│   └── widgets/
└── main.dart
```

### Data Layer

```dart
// Remote data source
class UserRemoteDataSource {
  UserRemoteDataSource(this._dio);
  final Dio _dio;
  
  Future<UserModel> getUser(String id) async {
    final response = await _dio.get('/users/$id');
    return UserModel.fromJson(response.data);
  }
}

// Local data source
class UserLocalDataSource {
  UserLocalDataSource(this._database);
  final AppDatabase _database;
  
  Future<UserEntity?> getUser(String id) {
    return _database.userDao.findById(id);
  }
  
  Future<void> cacheUser(UserEntity user) {
    return _database.userDao.insertOrUpdate(user);
  }
}

// Repository implementation
class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl(this._remote, this._local, this._networkInfo);
  
  final UserRemoteDataSource _remote;
  final UserLocalDataSource _local;
  final NetworkInfo _networkInfo;
  
  @override
  Future<Either<Failure, User>> getUser(String id) async {
    if (await _networkInfo.isConnected) {
      try {
        final model = await _remote.getUser(id);
        await _local.cacheUser(model.toEntity());
        return Right(model.toDomain());
      } on DioException catch (e) {
        return Left(ServerFailure(e.message ?? 'Unknown error'));
      }
    } else {
      final cached = await _local.getUser(id);
      if (cached != null) {
        return Right(cached.toDomain());
      }
      return Left(CacheFailure('No cached data available'));
    }
  }
}
```

### Domain Layer

```dart
// Entity (business logic representation)
class User {
  final String id;
  final String email;
  final String name;
  final UserRole role;
  final DateTime createdAt;
  
  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    required this.createdAt,
  });
  
  bool get isAdmin => role == UserRole.admin;
  bool get isNewUser => DateTime.now().difference(createdAt).inDays < 7;
}

// Repository interface
abstract class UserRepository {
  Future<Either<Failure, User>> getUser(String id);
  Future<Either<Failure, List<User>>> getAllUsers();
  Future<Either<Failure, Unit>> updateUser(User user);
}

// Use case
class GetUserProfile implements UseCase<String, User> {
  GetUserProfile(this._repository);
  final UserRepository _repository;
  
  @override
  Future<Either<Failure, User>> call(String userId) {
    return _repository.getUser(userId);
  }
}
```

### Presentation Layer

```dart
// Screen provider
@riverpod
class UserProfileScreen extends _$UserProfileScreen {
  @override
  Future<UserProfileState> build(String userId) async {
    final getUser = ref.watch(getUserProfileProvider);
    final result = await getUser(userId);
    
    return result.fold(
      (failure) => throw failure,
      (user) => UserProfileState(user: user),
    );
  }
  
  Future<void> updateProfile(String name) async {
    final user = state.value!.user;
    state = AsyncLoading();
    
    final updateUser = ref.read(updateUserProfileProvider);
    final result = await updateUser(user.copyWith(name: name));
    
    result.fold(
      (failure) => state = AsyncError(failure, StackTrace.current),
      (_) => ref.invalidateSelf(),
    );
  }
}

// Screen widget
class UserProfilePage extends ConsumerWidget {
  const UserProfilePage({required this.userId});
  final String userId;
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(userProfileScreenProvider(userId));
    
    return Scaffold(
      appBar: AppBar(title: Text('Profile')),
      body: state.when(
        data: (data) => ProfileContent(
          user: data.user,
          onUpdateName: (name) {
            ref.read(userProfileScreenProvider(userId).notifier).updateProfile(name);
          },
        ),
        loading: () => ProfileSkeleton(),
        error: (error, stack) => ErrorView(
          error: error,
          onRetry: () => ref.invalidate(userProfileScreenProvider(userId)),
        ),
      ),
    );
  }
}
```

---

## Testing Strategies

### Unit Testing Providers

```dart
void main() {
  group('UserProfileProvider', () {
    test('returns user data on success', () async {
      final container = ProviderContainer(
        overrides: [
          userRepositoryProvider.overrideWithValue(MockUserRepository()),
        ],
      );
      addTearDown(container.dispose);
      
      final user = await container.read(userProfileProvider.future);
      
      expect(user.name, 'Test User');
    });
    
    test('throws error on failure', () async {
      final mockRepo = MockUserRepository();
      when(() => mockRepo.getUser(any()))
          .thenThrow(ServerException('Network error'));
      
      final container = ProviderContainer(
        overrides: [
          userRepositoryProvider.overrideWithValue(mockRepo),
        ],
      );
      addTearDown(container.dispose);
      
      expect(
        () => container.read(userProfileProvider.future),
        throwsA(isA<ServerException>()),
      );
    });
  });
}
```

### Testing StateNotifier

```dart
void main() {
  group('TodosNotifier', () {
    late MockTodoRepository mockRepository;
    late ProviderContainer container;
    
    setUp(() {
      mockRepository = MockTodoRepository();
      container = ProviderContainer(
        overrides: [
          todoRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
    });
    
    tearDown(() {
      container.dispose();
    });
    
    test('adds todo to list', () {
      final notifier = container.read(todosProvider.notifier);
      
      notifier.addTodo('Test Todo');
      
      final state = container.read(todosProvider);
      expect(state.todos.length, 1);
      expect(state.todos.first.title, 'Test Todo');
    });
    
    test('toggles todo completion', () {
      final notifier = container.read(todosProvider.notifier);
      notifier.addTodo('Test Todo');
      
      final todoId = container.read(todosProvider).todos.first.id;
      notifier.toggleTodo(todoId);
      
      final todo = container.read(todosProvider).todos.first;
      expect(todo.completed, true);
    });
    
    test('loads todos from repository', () async {
      when(() => mockRepository.fetchAll()).thenAnswer(
        (_) async => [Todo(id: '1', title: 'Remote Todo')],
      );
      
      final notifier = container.read(todosProvider.notifier);
      await notifier.loadTodos();
      
      final state = container.read(todosProvider);
      expect(state.todos.length, 1);
      expect(state.todos.first.title, 'Remote Todo');
    });
  });
}
```

### Widget Testing

```dart
void main() {
  group('UserProfilePage', () {
    testWidgets('displays user information', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            userProfileProvider.overrideWith((ref) async {
              return User(id: '1', name: 'Test User', email: 'test@example.com');
            }),
          ],
          child: MaterialApp(
            home: UserProfilePage(userId: '1'),
          ),
        ),
      );
      
      // Wait for async provider
      await tester.pumpAndSettle();
      
      expect(find.text('Test User'), findsOneWidget);
      expect(find.text('test@example.com'), findsOneWidget);
    });
    
    testWidgets('shows loading indicator', (tester) async {
      final completer = Completer<User>();
      
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            userProfileProvider.overrideWith((ref) => completer.future),
          ],
          child: MaterialApp(
            home: UserProfilePage(userId: '1'),
          ),
        ),
      );
      
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
    
    testWidgets('shows error state', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            userProfileProvider.overrideWith((ref) {
              throw Exception('Failed to load');
            }),
          ],
          child: MaterialApp(
            home: UserProfilePage(userId: '1'),
          ),
        ),
      );
      
      await tester.pumpAndSettle();
      
      expect(find.text('Error: Exception: Failed to load'), findsOneWidget);
    });
  });
}
```

### Integration Testing

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('End-to-end test', () {
    testWidgets('complete user flow', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MyApp(),
        ),
      );
      
      // Login
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password');
      await tester.tap(find.byKey(Key('login_button')));
      await tester.pumpAndSettle();
      
      // Verify home screen
      expect(find.text('Welcome, Test User'), findsOneWidget);
      
      // Navigate to profile
      await tester.tap(find.byIcon(Icons.person));
      await tester.pumpAndSettle();
      
      // Update name
      await tester.tap(find.byKey(Key('edit_name_button')));
      await tester.enterText(find.byKey(Key('name_field')), 'Updated Name');
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();
      
      // Verify update
      expect(find.text('Updated Name'), findsOneWidget);
    });
  });
}
```

---

## Advanced Patterns

### Provider Families

```dart
// Family with single parameter
final userProvider = FutureProvider.family<User, String>((ref, userId) async {
  return ref.watch(userRepositoryProvider).getUser(userId);
});

// Family with multiple parameters (use class)
class ChatParams {
  final String chatId;
  final int limit;
  
  const ChatParams(this.chatId, this.limit);
  
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChatParams && chatId == other.chatId && limit == other.limit;
  
  @override
  int get hashCode => Object.hash(chatId, limit);
}

final messagesProvider = FutureProvider.family<List<Message>, ChatParams>((ref, params) async {
  return ref.watch(chatRepositoryProvider).getMessages(
    chatId: params.chatId,
    limit: params.limit,
  );
});
```

### Auto Dispose and Keep Alive

```dart
// Auto dispose when no longer used
final userProvider = FutureProvider.autoDispose<User>((ref) async {
  return ref.watch(userRepositoryProvider).getCurrentUser();
});

// Keep alive for specific duration
final expensiveDataProvider = FutureProvider.autoDispose<Data>((ref) async {
  // Keep provider alive for 5 minutes after last listener removed
  final link = ref.keepAlive();
  
  Timer(Duration(minutes: 5), link.close);
  
  return fetchExpensiveData();
});

// Conditional keep alive
final cacheableProvider = FutureProvider.autoDispose<Data>((ref) async {
  final data = await fetchData();
  
  // Only cache if data is valid
  if (data.isValid) {
    ref.keepAlive();
  }
  
  return data;
});
```

### Scoped Providers

```dart
// Abstract provider to be overridden
final currentUserIdProvider = Provider<String>((ref) {
  throw UnimplementedError('Must be overridden');
});

// Override in specific scope
class UserDetailPage extends ConsumerWidget {
  const UserDetailPage({required this.userId});
  final String userId;
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ProviderScope(
      overrides: [
        currentUserIdProvider.overrideWithValue(userId),
      ],
      child: UserDetailContent(),
    );
  }
}

// Use in child widgets
class UserDetailContent extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userId = ref.watch(currentUserIdProvider);
    final user = ref.watch(userProvider(userId));
    
    return user.when(
      data: (user) => UserCard(user: user),
      loading: () => CircularProgressIndicator(),
      error: (e, s) => ErrorWidget(error: e),
    );
  }
}
```

### Provider Observer

```dart
class AppProviderObserver extends ProviderObserver {
  @override
  void didAddProvider(
    ProviderBase<Object?> provider,
    Object? value,
    ProviderContainer container,
  ) {
    debugPrint('Provider added: ${provider.name ?? provider.runtimeType}');
  }
  
  @override
  void didDisposeProvider(
    ProviderBase<Object?> provider,
    ProviderContainer container,
  ) {
    debugPrint('Provider disposed: ${provider.name ?? provider.runtimeType}');
  }
  
  @override
  void didUpdateProvider(
    ProviderBase<Object?> provider,
    Object? previousValue,
    Object? newValue,
    ProviderContainer container,
  ) {
    debugPrint('''
Provider updated: ${provider.name ?? provider.runtimeType}
Previous: $previousValue
New: $newValue
''');
  }
  
  @override
  void providerDidFail(
    ProviderBase<Object?> provider,
    Object error,
    StackTrace stackTrace,
    ProviderContainer container,
  ) {
    debugPrint('Provider failed: ${provider.name ?? provider.runtimeType}');
    debugPrint('Error: $error');
  }
}

// Usage
void main() {
  runApp(
    ProviderScope(
      observers: [AppProviderObserver()],
      child: MyApp(),
    ),
  );
}
```

---

## Performance Optimization

### Selective Rebuilds

```dart
// Bad: Rebuilds on any state change
class BadExample extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(largeStateProvider);
    return Text(state.title); // Only uses title
  }
}

// Good: Only rebuilds when title changes
class GoodExample extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final title = ref.watch(largeStateProvider.select((s) => s.title));
    return Text(title);
  }
}

// Multiple selections
class MultiSelectExample extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final title = ref.watch(stateProvider.select((s) => s.title));
    final count = ref.watch(stateProvider.select((s) => s.count));
    
    return Column(
      children: [
        Text(title),
        Text('Count: $count'),
      ],
    );
  }
}
```

### Memoization

```dart
final expensiveComputationProvider = Provider<ComputedData>((ref) {
  final input = ref.watch(inputProvider);
  
  // This runs every time input changes
  return computeExpensiveData(input);
});

// Better: Use select to only recompute when necessary
final optimizedProvider = Provider<ComputedData>((ref) {
  final relevantPart = ref.watch(inputProvider.select((s) => s.relevantField));
  
  return computeExpensiveData(relevantPart);
});
```

### Lazy Loading

```dart
// Load only when needed
final heavyFeatureProvider = FutureProvider.autoDispose<HeavyFeature>((ref) async {
  // Only loads when first accessed
  final data = await loadHeavyData();
  return HeavyFeature(data);
});

// Prefetch optimization
class HomeScreen extends ConsumerStatefulWidget {
  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Prefetch data for likely next screens
    Future.microtask(() {
      ref.read(profileDataProvider);
      ref.read(settingsProvider);
    });
  }
  
  @override
  Widget build(BuildContext context) {
    // ...
  }
}
```

---

## Best Practices

### Provider Naming

```dart
// Good: Descriptive names
final currentUserProvider = Provider<User>((ref) => ...);
final userByIdProvider = Provider.family<User, String>((ref, id) => ...);
final filteredTodosProvider = Provider<List<Todo>>((ref) => ...);

// Bad: Vague names
final userProvider = Provider<User>((ref) => ...); // Which user?
final dataProvider = Provider<Data>((ref) => ...); // What data?
```

### State Granularity

```dart
// Bad: Monolithic state
class AppState {
  final User user;
  final List<Todo> todos;
  final Settings settings;
  final List<Message> messages;
  // Everything in one place
}

// Good: Granular state
final userProvider = StateNotifierProvider<UserNotifier, User>((ref) => ...);
final todosProvider = StateNotifierProvider<TodosNotifier, List<Todo>>((ref) => ...);
final settingsProvider = StateNotifierProvider<SettingsNotifier, Settings>((ref) => ...);
final messagesProvider = StreamProvider<List<Message>>((ref) => ...);
```

### Error Handling

```dart
@riverpod
class UserProfile extends _$UserProfile {
  @override
  Future<User> build() async {
    try {
      return await _fetchUser();
    } on NetworkException catch (e) {
      // Try cache on network error
      final cached = await ref.read(userCacheProvider).getUser();
      if (cached != null) return cached;
      rethrow;
    }
  }
}

// Global error handling
class ErrorHandlingObserver extends ProviderObserver {
  @override
  void providerDidFail(
    ProviderBase<Object?> provider,
    Object error,
    StackTrace stackTrace,
    ProviderContainer container,
  ) {
    // Log to crash reporting
    CrashReporting.recordError(error, stackTrace);
  }
}
```

### Testing Guidelines

| Guideline | Description |
|-----------|-------------|
| Isolate providers | Test each provider independently |
| Mock dependencies | Override repository/service providers |
| Test state transitions | Verify state changes for each action |
| Test error cases | Ensure proper error handling |
| Use ProviderContainer | For unit tests without widgets |

---

## Migration Guide

### From Provider to Riverpod

```dart
// Provider package
class UserProvider extends ChangeNotifier {
  User? _user;
  User? get user => _user;
  
  Future<void> loadUser() async {
    _user = await repository.getUser();
    notifyListeners();
  }
}

// Riverpod equivalent
@riverpod
class UserNotifier extends _$UserNotifier {
  @override
  Future<User?> build() async {
    return null;
  }
  
  Future<void> loadUser() async {
    state = AsyncLoading();
    state = AsyncData(await ref.read(repositoryProvider).getUser());
  }
}
```

### From BLoC to Riverpod

```dart
// BLoC
class UserBloc extends Bloc<UserEvent, UserState> {
  UserBloc(this._repository) : super(UserInitial()) {
    on<LoadUser>(_onLoadUser);
  }
  
  final UserRepository _repository;
  
  Future<void> _onLoadUser(LoadUser event, Emitter<UserState> emit) async {
    emit(UserLoading());
    try {
      final user = await _repository.getUser(event.id);
      emit(UserLoaded(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}

// Riverpod equivalent
@riverpod
class User extends _$User {
  @override
  Future<UserData> build(String id) async {
    return ref.watch(userRepositoryProvider).getUser(id);
  }
  
  Future<void> refresh() async {
    ref.invalidateSelf();
  }
}
```

---

## Conclusion

Riverpod provides a robust foundation for Flutter state management. Its compile-time safety, testability, and composability make it an excellent choice for applications of any size.

Key takeaways:

1. **Use the right provider type** for your use case
2. **Keep state granular** for better performance
3. **Leverage code generation** for cleaner code
4. **Test thoroughly** using ProviderContainer
5. **Follow naming conventions** for maintainability

---

*Last updated: 2024*
