<p align="center">
  <img src="Assets/banner.png" alt="Awesome Mobile Architecture" width="800"/>
</p>

<h1 align="center">Awesome Mobile Architecture</h1>

<p align="center">
  <strong>📱 The ultimate guide to mobile architecture patterns for iOS, Flutter & React Native</strong>
</p>

<p align="center">
  <a href="https://awesome.re">
    <img src="https://awesome.re/badge-flat2.svg" alt="Awesome"/>
  </a>
  <img src="https://img.shields.io/github/stars/muhittincamdali/awesome-mobile-architecture?style=flat-square" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/muhittincamdali/awesome-mobile-architecture?style=flat-square" alt="Forks"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome"/>
</p>

<p align="center">
  <a href="#ios">iOS</a> •
  <a href="#flutter">Flutter</a> •
  <a href="#react-native">React Native</a> •
  <a href="#cross-platform">Cross-Platform</a> •
  <a href="#resources">Resources</a>
</p>

---

## Contents

- [Architecture Patterns](#architecture-patterns)
  - [MVC](#mvc)
  - [MVP](#mvp)
  - [MVVM](#mvvm)
  - [VIPER](#viper)
  - [Clean Architecture](#clean-architecture)
  - [TCA (The Composable Architecture)](#tca)
  - [Redux/Flux](#redux-flux)
  - [BLoC](#bloc)
  - [MVI](#mvi)
- [iOS Architectures](#ios)
- [Flutter Architectures](#flutter)
- [React Native Architectures](#react-native)
- [Design Principles](#design-principles)
- [Testing Strategies](#testing-strategies)
- [Resources](#resources)

---

## Architecture Patterns

### MVC

**Model-View-Controller** - Apple's original recommendation

```
┌─────────────────────────────────────┐
│              Controller              │
│  ┌──────────┐      ┌──────────┐    │
│  │   View   │◄────►│  Model   │    │
│  └──────────┘      └──────────┘    │
└─────────────────────────────────────┘
```

**Pros:**
- Simple and familiar
- Built into UIKit
- Good for small apps

**Cons:**
- Massive View Controllers
- Hard to test
- Tight coupling

**Best For:** Prototypes, simple apps

**Resources:**
- 📖 [Apple's MVC Guide](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html)
- 📺 [Stanford CS193p](https://cs193p.sites.stanford.edu/)

---

### MVP

**Model-View-Presenter**

```
┌──────────┐    ┌─────────────┐    ┌──────────┐
│   View   │◄──►│  Presenter  │◄──►│  Model   │
└──────────┘    └─────────────┘    └──────────┘
     │                                    
     └── Passive View (no logic)          
```

**Pros:**
- Testable presenters
- Clear separation
- View is passive

**Cons:**
- Boilerplate code
- One presenter per view

**Best For:** Android (historically), testable UI

---

### MVVM

**Model-View-ViewModel** - The SwiftUI default

```
┌──────────┐    ┌─────────────┐    ┌──────────┐
│   View   │◄───│  ViewModel  │◄──►│  Model   │
└──────────┘    └─────────────┘    └──────────┘
     │                │
     └── Data Binding─┘
```

**iOS Implementation:**
```swift
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var isLoading = false
    
    private let repository: UserRepository
    
    func loadUsers() async {
        isLoading = true
        users = await repository.fetchUsers()
        isLoading = false
    }
}

struct UserListView: View {
    @StateObject var viewModel = UserViewModel()
    
    var body: some View {
        List(viewModel.users) { user in
            UserRow(user: user)
        }
        .task { await viewModel.loadUsers() }
    }
}
```

**Pros:**
- Native SwiftUI support
- Reactive updates
- Testable ViewModels

**Cons:**
- Can grow large
- Binding complexity

**Best For:** SwiftUI apps, reactive UIs

**Resources:**
- 📖 [MVVM in SwiftUI](https://www.hackingwithswift.com/books/ios-swiftui/introducing-mvvm-into-your-swiftui-project)
- 📺 [Ray Wenderlich MVVM](https://www.raywenderlich.com/34-design-patterns-by-tutorials-mvvm)

---

### VIPER

**View-Interactor-Presenter-Entity-Router**

```
┌──────────┐    ┌─────────────┐    ┌────────────┐
│   View   │◄──►│  Presenter  │◄──►│ Interactor │
└──────────┘    └─────────────┘    └────────────┘
                      │                   │
                      ▼                   ▼
                ┌──────────┐        ┌──────────┐
                │  Router  │        │  Entity  │
                └──────────┘        └──────────┘
```

**Components:**
- **View**: UI only, no logic
- **Interactor**: Business logic
- **Presenter**: View logic, formatting
- **Entity**: Data models
- **Router**: Navigation

**Pros:**
- Highly testable
- Single responsibility
- Scalable for large teams

**Cons:**
- Lots of boilerplate
- Steep learning curve
- Overkill for small apps

**Best For:** Large enterprise apps, big teams

**Resources:**
- 📖 [VIPER Architecture](https://www.objc.io/issues/13-architecture/viper/)
- 🔧 [VIPER Templates](https://github.com/ferranabello/Viperit)

---

### Clean Architecture

**Uncle Bob's layers**

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│    ┌─────────────────────────────────┐      │
│    │         Domain Layer            │      │
│    │    ┌─────────────────────┐     │      │
│    │    │    Data Layer       │     │      │
│    │    └─────────────────────┘     │      │
│    └─────────────────────────────────┘      │
└─────────────────────────────────────────────┘
```

**Layers:**
- **Presentation**: UI, ViewModels
- **Domain**: Business logic, Use Cases
- **Data**: Repositories, Data Sources

**Dependency Rule:** Inner layers know nothing about outer layers

**iOS Example:**
```swift
// Domain Layer
protocol UserRepository {
    func getUsers() async throws -> [User]
}

struct GetUsersUseCase {
    let repository: UserRepository
    
    func execute() async throws -> [User] {
        try await repository.getUsers()
    }
}

// Data Layer
class UserRepositoryImpl: UserRepository {
    func getUsers() async throws -> [User] {
        // API call
    }
}

// Presentation Layer
class UserViewModel: ObservableObject {
    let useCase: GetUsersUseCase
    
    func load() async {
        users = try? await useCase.execute()
    }
}
```

**Pros:**
- Framework independent
- Highly testable
- Flexible

**Cons:**
- Complex setup
- Many files

**Best For:** Long-term maintainable apps

---

### TCA

**The Composable Architecture** - Point-Free's SwiftUI architecture

```swift
@Reducer
struct CounterFeature {
    @ObservableState
    struct State: Equatable {
        var count = 0
    }
    
    enum Action {
        case increment
        case decrement
    }
    
    var body: some ReducerOf<Self> {
        Reduce { state, action in
            switch action {
            case .increment:
                state.count += 1
                return .none
            case .decrement:
                state.count -= 1
                return .none
            }
        }
    }
}
```

**Pros:**
- Composable modules
- Testable
- Side effect management

**Resources:**
- 📖 [TCA GitHub](https://github.com/pointfreeco/swift-composable-architecture)
- 📺 [Point-Free Videos](https://www.pointfree.co/)

---

### BLoC

**Business Logic Component** - Flutter's pattern

```dart
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<Increment>((event, emit) => emit(state + 1));
    on<Decrement>((event, emit) => emit(state - 1));
  }
}
```

**Resources:**
- 📖 [bloc library](https://bloclibrary.dev/)

---

## iOS

| Architecture | Best For | Complexity | Testability |
|-------------|----------|------------|-------------|
| MVC | Prototypes | ⭐ | ⭐⭐ |
| MVVM | SwiftUI apps | ⭐⭐ | ⭐⭐⭐⭐ |
| VIPER | Enterprise | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Clean | Long-term | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| TCA | Modern SwiftUI | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Example Projects

- 🔗 [Clean Architecture iOS](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM)
- 🔗 [TCA Examples](https://github.com/pointfreeco/swift-composable-architecture/tree/main/Examples)
- 🔗 [VIPER iOS](https://github.com/infinum/iOS-VIPER-Xcode-Templates)

---

## Flutter

| Architecture | Best For | Complexity | Testability |
|-------------|----------|------------|-------------|
| Provider | Simple apps | ⭐⭐ | ⭐⭐⭐ |
| BLoC | Medium-large | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Riverpod | Modern apps | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| GetX | Rapid dev | ⭐⭐ | ⭐⭐⭐ |
| Clean | Enterprise | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Example Projects

- 🔗 [Flutter BLoC Examples](https://github.com/felangel/bloc/tree/master/examples)
- 🔗 [Riverpod Examples](https://github.com/rrousselGit/riverpod/tree/master/packages/riverpod/example)

---

## React Native

| Architecture | Best For | Complexity | Testability |
|-------------|----------|------------|-------------|
| Redux | Large apps | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| MobX | Reactive | ⭐⭐ | ⭐⭐⭐ |
| Zustand | Simple state | ⭐ | ⭐⭐⭐⭐ |
| Recoil | Atomic state | ⭐⭐ | ⭐⭐⭐⭐ |

---

## Design Principles

### SOLID

| Principle | Description |
|-----------|-------------|
| **S**ingle Responsibility | One reason to change |
| **O**pen/Closed | Open for extension, closed for modification |
| **L**iskov Substitution | Subtypes must be substitutable |
| **I**nterface Segregation | Many specific interfaces |
| **D**ependency Inversion | Depend on abstractions |

### Other Principles

- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple, Stupid
- **YAGNI** - You Aren't Gonna Need It
- **Composition over Inheritance**

---

## Testing Strategies

### Testing Pyramid

```
         ┌───────┐
         │  E2E  │ Few
        ┌┴───────┴┐
        │ Integr. │ Some
       ┌┴─────────┴┐
       │   Unit    │ Many
       └───────────┘
```

### What to Test by Layer

| Layer | Test Type | Tools |
|-------|-----------|-------|
| Domain | Unit | XCTest, Quick |
| Data | Unit + Integration | Mock servers |
| Presentation | Unit + Snapshot | ViewInspector |
| UI | E2E | XCUITest |

---

## Resources

### Books

- 📚 [Clean Architecture](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- 📚 [Domain-Driven Design](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)
- 📚 [Patterns of Enterprise Application Architecture](https://www.amazon.com/Patterns-Enterprise-Application-Architecture-Martin/dp/0321127420)

### Talks

- 📺 [Uncle Bob - Clean Architecture](https://www.youtube.com/watch?v=o_TH-Y78tt4)
- 📺 [WWDC - Modern Swift Concurrency](https://developer.apple.com/videos/play/wwdc2021/10132/)

### Articles

- 📖 [iOS Architecture Patterns](https://medium.com/ios-os-x-development/ios-architecture-patterns-ecba4c38de52)
- 📖 [Flutter Architecture](https://docs.flutter.dev/app-architecture)

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE).

---

<p align="center">
  <sub>⭐ Star this repo if you find it useful!</sub>
</p>

---

## 📈 Star History

<a href="https://star-history.com/#muhittincamdali/awesome-mobile-architecture&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=muhittincamdali/awesome-mobile-architecture&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=muhittincamdali/awesome-mobile-architecture&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=muhittincamdali/awesome-mobile-architecture&type=Date" />
 </picture>
</a>

---

## 🚀 How to Use This List

1. **Browse by Category** - Find the architecture pattern you need
2. **Star Favorites** - Save resources for later
3. **Contribute** - Add missing resources via PR

## 📊 Quick Reference

| Pattern | Best For | Complexity |
|---------|----------|------------|
| MVC | Simple apps | ⭐ |
| MVVM | Medium apps | ⭐⭐ |
| Clean Architecture | Large apps | ⭐⭐⭐ |
| TCA | Complex state | ⭐⭐⭐⭐ |

## 📚 Learning Path

```
Beginner → MVC → MVVM → Clean Architecture → TCA/Redux
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE).

---

<div align="center">

**Curated with ❤️ by [Muhittin Camdali](https://github.com/muhittincamdali)**

If you find this useful, please ⭐ this repository!

</div>
