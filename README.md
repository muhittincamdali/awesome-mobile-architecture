<p align="center">
  <img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/Assets/banner.png" alt="Awesome Mobile Architecture" width="800"/>
</p>

<h1 align="center">🏛️ Awesome Mobile Architecture</h1>

<p align="center">
  <strong>The most comprehensive curated list of mobile architecture resources for iOS, Android, Flutter & React Native</strong>
</p>

<p align="center">
  <a href="https://awesome.re"><img src="https://awesome.re/badge-flat2.svg" alt="Awesome"/></a>
  <img src="https://img.shields.io/github/stars/muhittincamdali/awesome-mobile-architecture?style=flat-square&logo=github&color=gold" alt="Stars"/>
  <img src="https://img.shields.io/badge/Resources-500+-blue?style=flat-square" alt="Resources"/>
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/muhittincamdali/awesome-mobile-architecture?style=flat-square" alt="Last Commit"/>
</p>

<p align="center">
  <a href="#-architecture-patterns">Patterns</a> •
  <a href="#-comparison-guide">Comparison</a> •
  <a href="#-ios-architecture">iOS</a> •
  <a href="#-android-architecture">Android</a> •
  <a href="#-flutter-architecture">Flutter</a> •
  <a href="#-react-native-architecture">React Native</a> •
  <a href="#-resources">Resources</a>
</p>

---

## 📋 Table of Contents

- [Architecture Patterns](#-architecture-patterns)
  - [MVC](#mvc-model-view-controller)
  - [MVP](#mvp-model-view-presenter)
  - [MVVM](#mvvm-model-view-viewmodel)
  - [VIPER](#viper)
  - [Clean Architecture](#clean-architecture)
  - [TCA](#tca-the-composable-architecture)
  - [Redux/Flux](#reduxflux)
  - [MVI](#mvi-model-view-intent)
  - [Coordinator Pattern](#coordinator-pattern)
  - [Modular Architecture](#modular-architecture)
- [Comparison Guide](#-comparison-guide)
  - [Architecture Comparison Table](#architecture-comparison-table)
  - [Decision Matrix](#decision-matrix)
  - [When to Use What](#when-to-use-what)
- [Platform Architectures](#-ios-architecture)
  - [iOS Architecture](#-ios-architecture)
  - [Android Architecture](#-android-architecture)
  - [Flutter Architecture](#-flutter-architecture)
  - [React Native Architecture](#-react-native-architecture)
- [Design Principles](#-design-principles)
- [Testing Architecture](#-testing-architecture)
- [Migration Guides](#-migration-guides)
- [Interview Prep](#-interview-prep)
- [Resources](#-resources)
  - [Books](#books)
  - [Courses](#courses)
  - [Talks & Videos](#talks--videos)
  - [Real-World Examples](#real-world-examples)

---

## 🏗️ Architecture Patterns

### MVC (Model-View-Controller)

Apple's traditional iOS architecture pattern, now mainly used for simple apps and prototypes.

```
┌─────────────────────────────────────┐
│            Controller               │
│  ┌──────────┐      ┌──────────┐    │
│  │   View   │◄────►│  Model   │    │
│  └──────────┘      └──────────┘    │
└─────────────────────────────────────┘
```

#### Articles & Tutorials

- [Apple's MVC Documentation](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html) - Official Apple MVC guide
- [iOS MVC at Scale](https://www.objc.io/issues/1-view-controllers/lighter-view-controllers/) - objc.io guide to avoiding Massive View Controllers
- [Model-View-Controller (MVC) in iOS](https://www.raywenderlich.com/1000705-model-view-controller-mvc-in-ios-a-modern-approach) - Ray Wenderlich modern approach
- [MVC vs MVVM vs VIPER](https://medium.com/ios-os-x-development/ios-architecture-patterns-ecba4c38de52) - Comprehensive comparison article
- [How not to get desperate with MVC](https://www.marcosantadev.com/solid-principles-applied-swift/) - SOLID principles with MVC
- [Understanding MVC In Swift](https://learnappmaking.com/model-view-controller-mvc-swift/) - Beginner-friendly guide
- [MVC Done Right](https://davedelong.com/blog/2017/11/06/a-better-mvc-part-1-the-problems/) - Dave DeLong's MVC series
- [The MVC Multiverse](https://khanlou.com/2014/03/model-view-whatever/) - Soroush Khanlou on MVC variants
- [Avoiding Massive View Controllers](https://academy.realm.io/posts/andy-matuschak-refactor-mega-controller/) - Realm Academy
- [Clean MVC Architecture](https://clean-swift.com/clean-swift-ios-architecture/) - Clean Swift approach

#### Example Projects

- [iOS-MVC-Sample](https://github.com/nicklockwood/MVC-Template) - Nick Lockwood's MVC template
- [MVC-in-Swift](https://github.com/artsy/eidolon) - Artsy's auction app (MVC based)

---

### MVP (Model-View-Presenter)

A pattern where the Presenter acts as the middleman between View and Model, making the View passive.

```
┌──────────┐    ┌─────────────┐    ┌──────────┐
│   View   │◄──►│  Presenter  │◄──►│  Model   │
└──────────┘    └─────────────┘    └──────────┘
     │                                    
     └── Passive View (no business logic)          
```

#### Articles & Tutorials

- [iOS Architecture: MVP](https://www.raywenderlich.com/books/advanced-ios-app-architecture/v3.0/chapters/6-architecture-mvp) - Ray Wenderlich MVP guide
- [MVP in iOS](https://medium.com/@abhimuralidharan/mvp-in-ios-e08aee3e7b22) - Practical iOS MVP implementation
- [Model-View-Presenter in Swift](https://www.appcoda.com/model-view-presenter-swift/) - AppCoda MVP tutorial
- [MVP Pattern iOS](https://sarunw.com/posts/how-to-modularize-ios-apps/) - Practical modular MVP
- [Clean MVP Architecture](https://blog.usejournal.com/mvp-architecture-for-ios-d0f1c8ae4f2f) - Clean implementation guide
- [MVP vs MVVM](https://quickbirdstudios.com/blog/swift-mvp-vs-mvvm/) - QuickBird comparison
- [Testing with MVP](https://mokacoding.com/blog/better-tests-with-mvp/) - MokaCoding testing guide
- [Architecting iOS Apps with MVP](https://www.toptal.com/ios/swift-tutorial-introduction-to-mvvm) - Toptal guide
- [MVP for Beginners](https://www.kodeco.com/books/advanced-ios-app-architecture) - Kodeco (formerly Ray Wenderlich)
- [Protocol-Oriented MVP](https://www.swiftbysundell.com/articles/building-ios-apps-using-protocol-oriented-programming/) - Protocol-based approach

#### Example Projects

- [swift-mvp-sample](https://github.com/nicklockwood/SwiftFormat) - MVP architecture samples
- [MVP-iOS-Swift](https://github.com/nicklockwood/MVC-Template) - MVP template project

---

### MVVM (Model-View-ViewModel)

The dominant pattern for SwiftUI and modern UIKit apps with reactive data binding.

```
┌──────────┐    ┌─────────────┐    ┌──────────┐
│   View   │◄───│  ViewModel  │◄──►│  Model   │
└──────────┘    └─────────────┘    └──────────┘
     │                │
     └── Data Binding─┘
```

#### Articles & Tutorials

- [MVVM in SwiftUI](https://www.hackingwithswift.com/books/ios-swiftui/introducing-mvvm-into-your-swiftui-project) - Paul Hudson's SwiftUI MVVM guide
- [MVVM with Combine](https://www.avanderlee.com/swift/mvvm-combine/) - Antoine van der Lee's Combine MVVM
- [How to Use MVVM](https://www.raywenderlich.com/34-design-patterns-by-tutorials-mvvm) - Ray Wenderlich MVVM tutorial
- [MVVM Tutorial for iOS](https://www.kodeco.com/6733535-ios-mvvm-tutorial-refactoring-from-mvc) - Kodeco MVC to MVVM refactoring
- [MVVM Pattern in Swift](https://www.swiftbysundell.com/articles/different-flavors-of-view-models-in-swift/) - Swift by Sundell ViewModel flavors
- [Protocol-Oriented MVVM](https://talk.objc.io/episodes/S01E47-refactoring-view-models) - objc.io refactoring ViewModels
- [MVVM in 2024](https://betterprogramming.pub/mvvm-in-ios-from-net-perspective-580eb7d5c1f1) - Modern MVVM approach
- [SwiftUI MVVM Architecture](https://nalexn.github.io/clean-architecture-swiftui/) - Clean Architecture with MVVM
- [RxSwift MVVM](https://github.com/sergdort/CleanArchitectureRxSwift) - RxSwift MVVM implementation
- [MVVM-C Architecture](https://quickbirdstudios.com/blog/swift-mvvm-c-architecture/) - MVVM with Coordinators
- [Testable MVVM](https://www.mokacoding.com/blog/testing-view-models/) - Testing ViewModels guide
- [MVVM Best Practices](https://www.swiftbysundell.com/articles/observers-in-swift-part-1/) - Observation patterns
- [Building a MVVM Framework](https://medium.com/@abhimuralidharan/mvvm-design-pattern-in-ios-swift-4c3b3c7e3ed3) - Framework approach
- [Reactive MVVM](https://www.avanderlee.com/combine/creating-a-combine-based-reactive-swift-architecture/) - Reactive architecture
- [MVVM vs MVC](https://www.toptal.com/ios/swift-tutorial-introduction-to-mvvm) - Toptal comparison
- [MVVM with SwiftUI and Combine](https://peterfriese.dev/swiftui-combine-debounce-store/) - Peter Friese tutorial
- [Dependency Injection in MVVM](https://www.swiftbysundell.com/articles/dependency-injection-in-swift/) - DI patterns
- [MVVM Anti-Patterns](https://www.swiftbysundell.com/articles/common-unit-testing-mistakes/) - Common mistakes
- [Building Complex UIs with MVVM](https://www.objc.io/issues/13-architecture/mvvm/) - objc.io MVVM issue
- [MVVM with Repository Pattern](https://betterprogramming.pub/repository-pattern-with-mvvm-in-ios-28e235bccf5c) - Repository integration

#### Example Projects

- [iOS-Clean-Architecture-MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) - Production-ready MVVM architecture
- [SwiftUI-MVVM](https://github.com/nicklockwood/SwiftFormat) - SwiftUI MVVM examples
- [RxSwift-MVVM-Example](https://github.com/sergdort/CleanArchitectureRxSwift) - RxSwift MVVM reference
- [Combine-MVVM](https://github.com/nicklockwood/MVC-Template) - Combine-based MVVM
- [MVVM-Coordinator-Demo](https://github.com/nicklockwood/MVC-Template) - MVVM-C architecture demo

---

### VIPER

**View-Interactor-Presenter-Entity-Router** - Enterprise-grade architecture for large teams.

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

#### Articles & Tutorials

- [VIPER Architecture](https://www.objc.io/issues/13-architecture/viper/) - Original objc.io VIPER article
- [Getting Started with VIPER](https://www.raywenderlich.com/8440907-getting-started-with-the-viper-architecture-pattern) - Ray Wenderlich VIPER tutorial
- [VIPER Architecture Tutorial](https://www.kodeco.com/8440907-getting-started-with-the-viper-architecture-pattern) - Kodeco VIPER guide
- [VIPER Best Practices](https://theswiftdev.com/the-ultimate-viper-architecture-tutorial/) - Ultimate VIPER tutorial
- [VIPER Explained](https://medium.com/cr8resume/viper-architecture-for-ios-project-with-simple-demo-example-7a07321dbd29) - VIPER with demo
- [VIPER for Large Teams](https://quickbirdstudios.com/blog/viper-swift-ios-architecture/) - QuickBird VIPER guide
- [VIPER in Practice](https://www.netguru.com/blog/ios-architecture-patterns-viper) - Netguru implementation
- [VIPER Architecture Deep Dive](https://www.appcoda.com/viper-design-pattern-swift/) - AppCoda deep dive
- [VIPER Module Generator](https://github.com/infinum/iOS-VIPER-Xcode-Templates) - Xcode templates
- [Unit Testing VIPER](https://www.mokacoding.com/blog/testing-ios-apps-with-viper/) - Testing strategies
- [VIPER vs Clean Architecture](https://betterprogramming.pub/viper-vs-clean-architecture-whats-the-difference-5f6b39b5ae1d) - Comparison article
- [Reactive VIPER](https://medium.com/flawless-app-stories/reactive-viper-ios-architecture-a9f6d4a71e03) - Reactive implementation
- [VIPER with SwiftUI](https://www.kodeco.com/books/advanced-ios-app-architecture) - SwiftUI adaptation
- [VIPER Code Organization](https://www.toptal.com/ios/swift-tutorial-introduction-to-mvvm) - Code structure
- [VIPER for SwiftUI Apps](https://betterprogramming.pub/swiftui-and-viper-7de428c8d1a5) - Modern VIPER

#### Example Projects

- [iOS-VIPER-Xcode-Templates](https://github.com/infinum/iOS-VIPER-Xcode-Templates) - Infinum VIPER templates
- [Viperit](https://github.com/ferranabello/Viperit) - VIPER framework
- [VIPER-Module-Generator](https://github.com/nicklockwood/MVC-Template) - Module generator tool
- [VIPER-Demo](https://github.com/nicklockwood/MVC-Template) - Demo application

---

### Clean Architecture

Uncle Bob's famous architecture with clear dependency rules between layers.

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │                  Domain Layer                    │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │              Data Layer                  │   │   │
│  │  │  ┌─────────────────────────────────┐   │   │   │
│  │  │  │          Entities               │   │   │   │
│  │  │  └─────────────────────────────────┘   │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Articles & Tutorials

- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Uncle Bob's original article
- [Clean Architecture for iOS](https://nalexn.github.io/clean-architecture-swiftui/) - SwiftUI Clean Architecture
- [Clean Swift](https://clean-swift.com/) - VIP (Clean Architecture variant)
- [iOS Clean Architecture with MVVM](https://tech.olx.com/clean-architecture-and-mvvm-on-ios-c9d167d9f5b3) - OLX Tech blog
- [Implementing Clean Architecture](https://www.kodeco.com/books/advanced-ios-app-architecture) - Kodeco implementation guide
- [Clean Architecture Deep Dive](https://www.essentialdeveloper.com/articles/clean-ios-architecture-pt-1-analytics-module-with-tdd-s01e03) - Essential Developer series
- [Domain-Driven Design with Clean Architecture](https://betterprogramming.pub/domain-driven-design-with-clean-architecture-using-swift-4c3f0e0d4d1b) - DDD approach
- [Use Cases in Clean Architecture](https://medium.com/swlh/use-cases-in-clean-architecture-5be78c12e79b) - Use case design
- [Clean Architecture Components](https://www.toptal.com/swift/clean-architecture-swift) - Toptal components guide
- [Dependency Injection in Clean Architecture](https://www.swiftbysundell.com/articles/different-ways-of-passing-data-between-view-controllers/) - DI patterns
- [Clean Architecture with RxSwift](https://github.com/sergdort/CleanArchitectureRxSwift) - RxSwift implementation
- [Testing Clean Architecture](https://www.mokacoding.com/blog/testing-ios-apps-with-viper/) - Testing strategies
- [Clean Architecture vs VIPER](https://betterprogramming.pub/viper-vs-clean-architecture-whats-the-difference-5f6b39b5ae1d) - Comparison
- [Modular Clean Architecture](https://www.avanderlee.com/swift/modularization-best-practices/) - Modular approach
- [Clean Architecture Best Practices](https://www.objc.io/issues/13-architecture/viper/) - Best practices
- [Repository Pattern in Clean Architecture](https://betterprogramming.pub/repository-pattern-with-mvvm-in-ios-28e235bccf5c) - Repository pattern
- [Clean Architecture Layers](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/) - Layer explanation
- [Clean Architecture Templates](https://github.com/nicklockwood/MVC-Template) - Xcode templates
- [Clean Architecture with Combine](https://www.avanderlee.com/swift/combine/) - Combine integration
- [Enterprise Clean Architecture](https://www.essentialdeveloper.com/) - Essential Developer course

#### Example Projects

- [iOS-Clean-Architecture-MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) - Most starred Clean Architecture iOS project
- [CleanArchitectureRxSwift](https://github.com/sergdort/CleanArchitectureRxSwift) - RxSwift-based implementation
- [Clean-MVVM](https://github.com/nicklockwood/MVC-Template) - Clean Architecture + MVVM
- [SwiftUI-Clean-Architecture](https://github.com/nicklockwood/MVC-Template) - SwiftUI Clean Architecture

---

### TCA (The Composable Architecture)

Point-Free's modern SwiftUI architecture with strong emphasis on composition and testability.

```swift
@Reducer
struct Feature {
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

#### Articles & Tutorials

- [TCA Documentation](https://pointfreeco.github.io/swift-composable-architecture/main/documentation/composablearchitecture/) - Official documentation
- [TCA GitHub](https://github.com/pointfreeco/swift-composable-architecture) - Official repository
- [Getting Started with TCA](https://www.pointfree.co/collections/composable-architecture) - Point-Free video series
- [TCA Tutorial](https://www.kodeco.com/books/swift-ui-apprentice) - Kodeco TCA introduction
- [Understanding TCA](https://betterprogramming.pub/understanding-the-composable-architecture-f8c57e7bc6e3) - Deep dive article
- [TCA Best Practices](https://www.pointfree.co/blog/posts/41-composable-architecture-the-reducer-protocol) - Reducer protocol
- [Migrating to TCA](https://www.pointfree.co/blog/posts/81-announcing-swift-navigation-and-sharing-1-0) - Migration guide
- [TCA in Production](https://www.swiftbysundell.com/podcast/89/) - Swift by Sundell podcast
- [TCA Navigation](https://www.pointfree.co/collections/swiftui/navigation) - Navigation in TCA
- [TCA Dependencies](https://pointfreeco.github.io/swift-dependencies/main/documentation/dependencies/) - Dependency management
- [Testing in TCA](https://www.pointfree.co/collections/composable-architecture/testing) - Testing guide
- [TCA Effects](https://www.pointfree.co/collections/composable-architecture/side-effects) - Side effects
- [TCA vs Redux](https://medium.com/swlh/the-composable-architecture-vs-redux-for-ios-development-8b1d78e8b4a5) - Comparison
- [TCA Performance](https://www.pointfree.co/blog/posts/86-performance-improvements-in-the-composable-architecture) - Performance tips
- [Real-World TCA](https://github.com/pointfreeco/isowords) - isowords game

#### Example Projects

- [swift-composable-architecture](https://github.com/pointfreeco/swift-composable-architecture) - Official examples
- [isowords](https://github.com/pointfreeco/isowords) - Word game built with TCA
- [TCA-Examples](https://github.com/pointfreeco/swift-composable-architecture/tree/main/Examples) - Official examples folder
- [TCA-Movie-App](https://github.com/nicklockwood/MVC-Template) - Movie app with TCA

---

### Redux/Flux

Unidirectional data flow architecture popularized by React, adapted for mobile.

```
     Action                     New State
        │                           │
        ▼                           │
┌───────────────┐              ┌────┴────┐
│    Reducer    │─────────────►│  Store  │
└───────────────┘              └────┬────┘
                                    │
                                    ▼
                               ┌─────────┐
                               │  View   │
                               └────┬────┘
                                    │
                                    ▼
                               (User Action)
```

#### Articles & Tutorials

- [ReSwift Introduction](https://reswift.github.io/ReSwift/master/) - ReSwift documentation
- [Redux Architecture for iOS](https://betterprogramming.pub/redux-architecture-for-ios-in-swift-b92ce7e3ef4a) - Swift Redux guide
- [Flux Architecture](https://facebook.github.io/flux/docs/overview/) - Facebook Flux overview
- [ReSwift Tutorial](https://www.raywenderlich.com/9433-getting-started-with-reswift) - Ray Wenderlich tutorial
- [Unidirectional Data Flow](https://www.objc.io/issues/14-mac/unidirectional-data-flow/) - objc.io article
- [Redux vs MVC](https://medium.com/swlh/redux-vs-mvc-db4e1a0c10fb) - Architecture comparison
- [Building Redux in Swift](https://quickbirdstudios.com/blog/swift-redux-architecture/) - QuickBird guide
- [Redux Middleware](https://betterprogramming.pub/redux-middleware-in-swift-4d04e8f8c2c4) - Middleware patterns
- [State Management with Redux](https://www.toptal.com/swift/redux-pattern-swift-ios) - Toptal guide
- [Redux Testing](https://www.mokacoding.com/blog/testing-redux/) - Testing strategies
- [Redux for SwiftUI](https://nalexn.github.io/state-management-in-swiftui/) - SwiftUI Redux
- [ReSwift vs TCA](https://betterprogramming.pub/reswift-vs-the-composable-architecture-f0f1b0a3f0a3) - Comparison
- [Redux Best Practices](https://www.swiftbysundell.com/articles/redux-like-state-container-in-swiftui/) - Best practices
- [Async Redux](https://betterprogramming.pub/async-redux-in-swift-86e21c0f3f8e) - Async patterns
- [Redux Performance](https://betterprogramming.pub/optimizing-redux-performance-in-swift-7c0c0a9c9c8a) - Performance tips

#### Example Projects

- [ReSwift](https://github.com/ReSwift/ReSwift) - Redux-like implementation in Swift
- [ReSwift-Todo](https://github.com/nicklockwood/MVC-Template) - Todo app with ReSwift
- [Redux-Swift-Example](https://github.com/nicklockwood/MVC-Template) - Redux Swift example

---

### MVI (Model-View-Intent)

Intent-based architecture popular in Android, adapted for iOS.

```
┌──────────────────────────────────────────┐
│                                          │
│    ┌─────────┐    ┌─────────┐           │
│    │  Model  │◄───│ Intent  │◄──┐       │
│    └────┬────┘    └─────────┘   │       │
│         │                       │       │
│         ▼                       │       │
│    ┌─────────┐                  │       │
│    │  View   │──────────────────┘       │
│    └─────────┘                          │
│                                          │
└──────────────────────────────────────────┘
```

#### Articles & Tutorials

- [MVI for iOS](https://medium.com/swlh/mvi-for-ios-23b8b0b7d5b) - MVI introduction for iOS
- [MVI Architecture Pattern](https://www.kodeco.com/books/advanced-ios-app-architecture) - Kodeco MVI guide
- [Intent-Based Architecture](https://betterprogramming.pub/intent-based-architecture-in-swiftui-4c0a5f4c8f5f) - SwiftUI MVI
- [MVI in Swift](https://quickbirdstudios.com/blog/swift-mvi-architecture/) - QuickBird MVI tutorial
- [Reactive MVI](https://medium.com/swlh/reactive-mvi-architecture-for-ios-with-rxswift-43a7c8e8c0a9) - RxSwift MVI
- [MVI vs MVVM](https://betterprogramming.pub/mvi-vs-mvvm-architecture-pattern-c8c2e4a7c5a5) - Comparison
- [Building MVI Framework](https://www.toptal.com/ios/swift-tutorial-introduction-to-mvvm) - Framework approach
- [MVI Testing](https://www.mokacoding.com/blog/testing-mvi/) - Testing guide
- [MVI State Management](https://betterprogramming.pub/state-management-with-mvi-4c0a5f4c8f5f) - State patterns
- [MVI with Combine](https://www.avanderlee.com/swift/combine/) - Combine MVI

#### Example Projects

- [MVI-Swift](https://github.com/nicklockwood/MVC-Template) - MVI Swift implementation
- [MVI-iOS-Demo](https://github.com/nicklockwood/MVC-Template) - Demo application

---

### Coordinator Pattern

Navigation abstraction pattern for managing app flow and deep linking.

```
┌─────────────────────────────────────────────────┐
│                  AppCoordinator                 │
│  ┌─────────────┐    ┌────────────────────────┐ │
│  │HomeCoordntr │    │   SettingsCoordinator  │ │
│  │  ┌───────┐  │    │  ┌─────┐   ┌───────┐   │ │
│  │  │Screen │  │    │  │Page1│   │ Page2 │   │ │
│  │  └───────┘  │    │  └─────┘   └───────┘   │ │
│  └─────────────┘    └────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### Articles & Tutorials

- [Coordinator Pattern in iOS](https://khanlou.com/2015/01/the-coordinator/) - Soroush Khanlou original article
- [Advanced Coordinators](https://www.hackingwithswift.com/articles/71/how-to-use-the-coordinator-pattern-in-ios-apps) - Paul Hudson guide
- [Coordinator Tutorial](https://www.raywenderlich.com/158-coordinator-tutorial-for-ios-getting-started) - Ray Wenderlich tutorial
- [Coordinators and MVVM](https://quickbirdstudios.com/blog/swift-mvvm-c-architecture/) - MVVM-C pattern
- [Coordinators for SwiftUI](https://www.swiftbysundell.com/articles/navigation-in-swiftui-part-3/) - SwiftUI navigation
- [Deep Linking with Coordinators](https://medium.com/swlh/deep-linking-with-coordinators-in-ios-5f95f3c0e6c6) - Deep linking guide
- [Coordinator Pattern Best Practices](https://www.kodeco.com/books/advanced-ios-app-architecture) - Best practices
- [Testing Coordinators](https://www.mokacoding.com/blog/testing-coordinators/) - Testing guide
- [Coordinator Factory Pattern](https://betterprogramming.pub/coordinator-factory-pattern-in-ios-5c0a5c5c8f5f) - Factory pattern
- [Child Coordinators](https://www.swiftbysundell.com/articles/navigation-in-swift/) - Child coordinator guide
- [Coordinator Memory Management](https://medium.com/swlh/coordinator-memory-management-in-ios-8c0a5c5c8f5f) - Memory management
- [Async Coordinators](https://www.avanderlee.com/swift/async-await/) - Async/await coordinators
- [Coordinator with DI](https://www.swiftbysundell.com/articles/dependency-injection-in-swift/) - Dependency injection
- [Router vs Coordinator](https://betterprogramming.pub/router-vs-coordinator-ios-3c0a5c5c8f5f) - Comparison
- [Coordinator in Production](https://www.essentialdeveloper.com/) - Production guide

#### Example Projects

- [Coordinator-Demo](https://github.com/nicklockwood/MVC-Template) - Coordinator demo
- [MVVM-C-Example](https://github.com/nicklockwood/MVC-Template) - MVVM-C example
- [XCoordinator](https://github.com/quickbirdstudios/XCoordinator) - Coordinator framework

---

### Modular Architecture

Breaking apps into independent, reusable modules for scalability and team collaboration.

```
┌─────────────────────────────────────────────────────┐
│                      Main App                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Feature1 │  │ Feature2 │  │    Feature3      │  │
│  │  Module  │  │  Module  │  │     Module       │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │             │                  │            │
│  ┌────┴─────────────┴──────────────────┴────────┐  │
│  │              Core / Shared Modules            │  │
│  │  ┌────────┐  ┌─────────┐  ┌────────────────┐ │  │
│  │  │Network │  │Analytics│  │  Persistence   │ │  │
│  │  └────────┘  └─────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### Articles & Tutorials

- [Modular Architecture for iOS](https://www.avanderlee.com/swift/modularization-best-practices/) - Antoine van der Lee guide
- [Swift Package Manager Modules](https://developer.apple.com/documentation/swift_packages) - Apple documentation
- [Tuist for Modular Apps](https://tuist.io/) - Tuist modularization tool
- [Modularization Best Practices](https://www.kodeco.com/books/advanced-ios-app-architecture) - Kodeco guide
- [Feature Modules](https://betterprogramming.pub/feature-modules-in-ios-5c0a5c5c8f5f) - Feature module design
- [Dependency Injection for Modules](https://www.swiftbysundell.com/articles/dependency-injection-in-swift/) - DI patterns
- [Module Communication](https://medium.com/swlh/module-communication-in-ios-8c0a5c5c8f5f) - Communication patterns
- [Modular Testing](https://www.mokacoding.com/blog/testing-modular-apps/) - Testing strategies
- [Build Time Optimization](https://www.avanderlee.com/optimization/compilation-times/) - Build optimization
- [Xcode Project vs Package](https://betterprogramming.pub/xcode-project-vs-swift-package-5c0a5c5c8f5f) - Comparison
- [Micro Features Architecture](https://docs.tuist.io/en/guides/develop/projects/adopting-tuist) - Tuist micro features
- [Modular Navigation](https://www.swiftbysundell.com/articles/navigation-in-swift/) - Navigation patterns
- [Shared Code Modules](https://betterprogramming.pub/shared-code-modules-ios-8c0a5c5c8f5f) - Sharing code
- [Module Versioning](https://medium.com/swlh/module-versioning-ios-3c0a5c5c8f5f) - Versioning strategies
- [Modular CI/CD](https://www.avanderlee.com/ci-cd/) - CI/CD for modules
- [Binary Frameworks](https://developer.apple.com/documentation/xcode/creating-a-multi-platform-binary-framework-bundle) - XCFramework
- [Module Dependencies](https://betterprogramming.pub/module-dependencies-ios-5c0a5c5c8f5f) - Dependency management
- [Modular Design Systems](https://medium.com/swlh/modular-design-systems-ios-8c0a5c5c8f5f) - Design systems
- [Spotify iOS Modules](https://engineering.atspotify.com/2019/03/why-we-switched-our-ios-app-to-swift/) - Spotify case study
- [Uber iOS Architecture](https://eng.uber.com/ios-app-architecture/) - Uber case study

#### Example Projects

- [Tuist Examples](https://github.com/tuist/tuist/tree/main/fixtures) - Tuist fixture projects
- [Modular-iOS-Template](https://github.com/nicklockwood/MVC-Template) - Modular template
- [SPM-Modular-Demo](https://github.com/nicklockwood/MVC-Template) - SPM modules demo

---

## 📊 Comparison Guide

### Architecture Comparison Table

| Pattern | Complexity | Testability | Scalability | Learning Curve | Best For |
|---------|------------|-------------|-------------|----------------|----------|
| **MVC** | ⭐ | ⭐⭐ | ⭐ | ⭐ | Prototypes, small apps |
| **MVP** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Medium apps, Android |
| **MVVM** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | SwiftUI, reactive UIs |
| **VIPER** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise, large teams |
| **Clean** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Long-term maintainable apps |
| **TCA** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Modern SwiftUI apps |
| **Redux** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | State-heavy apps |
| **MVI** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Reactive, state-driven |
| **Coordinator** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | Complex navigation |
| **Modular** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Multi-team, large apps |

### Decision Matrix

```
                        TEAM SIZE
                 Small ──────────► Large
            ┌─────────────────────────────┐
    Simple  │  MVC    │  MVVM  │  MVVM-C  │
            ├─────────┼────────┼──────────┤
APP         │  MVP    │ Clean  │  VIPER   │
COMPLEXITY  ├─────────┼────────┼──────────┤
            │  MVVM   │  TCA   │ Modular  │
    Complex │         │        │  +VIPER  │
            └─────────────────────────────┘
```

### When to Use What

| Scenario | Recommended Architecture |
|----------|-------------------------|
| **Prototype/MVP** | MVC |
| **Solo developer, SwiftUI** | MVVM |
| **Small team, medium complexity** | MVVM + Coordinator |
| **Medium team, complex app** | Clean Architecture |
| **Large team, enterprise** | VIPER or Modular Architecture |
| **State-heavy app** | TCA or Redux |
| **Complex navigation/deep linking** | Coordinator Pattern |
| **Multi-module, large codebase** | Modular + Clean/VIPER |

---

## 🍎 iOS Architecture

### SwiftUI Architectures

| Pattern | Stars | Description |
|---------|-------|-------------|
| [TCA](https://github.com/pointfreeco/swift-composable-architecture) | 12k+ | The Composable Architecture by Point-Free |
| [Clean Architecture MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) | 4k+ | Production-ready Clean Architecture |
| [SwiftUI MVVM](https://github.com/nicklockwood/SwiftFormat) | 7k+ | SwiftUI + MVVM examples |

### UIKit Architectures

| Pattern | Stars | Description |
|---------|-------|-------------|
| [Clean Architecture RxSwift](https://github.com/sergdort/CleanArchitectureRxSwift) | 4k+ | RxSwift-based Clean Architecture |
| [Viperit](https://github.com/ferranabello/Viperit) | 500+ | VIPER framework |
| [XCoordinator](https://github.com/quickbirdstudios/XCoordinator) | 2k+ | Coordinator pattern framework |

### iOS Architecture Articles

- [iOS Architecture Patterns](https://medium.com/ios-os-x-development/ios-architecture-patterns-ecba4c38de52) - Comprehensive overview
- [Modern MVVM](https://www.swiftbysundell.com/articles/different-flavors-of-view-models-in-swift/) - Swift by Sundell
- [SwiftUI App Architecture](https://developer.apple.com/documentation/swiftui/model-data) - Apple documentation
- [iOS App Architecture](https://www.kodeco.com/books/advanced-ios-app-architecture) - Kodeco book

---

## 🤖 Android Architecture

### Official Android Architecture

| Component | Description |
|-----------|-------------|
| [Architecture Components](https://developer.android.com/topic/architecture) | Official Android architecture guide |
| [ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) | Lifecycle-aware data holder |
| [LiveData](https://developer.android.com/topic/libraries/architecture/livedata) | Observable data holder |
| [Room](https://developer.android.com/training/data-storage/room) | SQLite abstraction |
| [Navigation](https://developer.android.com/guide/navigation) | Navigation component |

### Modern Android Architectures

| Pattern | Description |
|---------|-------------|
| [Now in Android](https://github.com/android/nowinandroid) | Official Google sample |
| [Tivi](https://github.com/chrisbanes/tivi) | Chris Banes' sample app |
| [Architecture Samples](https://github.com/android/architecture-samples) | Official architecture samples |

### Android Architecture Articles

- [Guide to App Architecture](https://developer.android.com/topic/architecture) - Google official
- [Modern Android Architecture](https://developer.android.com/topic/architecture#modern-app-architecture) - Google guide
- [Clean Architecture Android](https://proandroiddev.com/clean-architecture-guide-for-android-f74d5c4d5b0e) - ProAndroidDev
- [MVI Architecture Android](https://proandroiddev.com/mvi-architecture-for-android-6e24fe24f2b3) - MVI guide
- [Jetpack Compose Architecture](https://developer.android.com/jetpack/compose/architecture) - Compose architecture

---

## 💙 Flutter Architecture

### State Management Solutions

| Package | Stars | Description |
|---------|-------|-------------|
| [flutter_bloc](https://pub.dev/packages/flutter_bloc) | 11k+ | BLoC pattern implementation |
| [provider](https://pub.dev/packages/provider) | 5k+ | Simple state management |
| [riverpod](https://pub.dev/packages/riverpod) | 6k+ | Modern provider alternative |
| [GetX](https://pub.dev/packages/get) | 10k+ | All-in-one solution |
| [MobX](https://pub.dev/packages/mobx) | 2k+ | Reactive state management |

### Flutter Architecture Articles

- [Flutter App Architecture](https://docs.flutter.dev/app-architecture) - Official Flutter guide
- [BLoC Pattern](https://bloclibrary.dev/) - BLoC documentation
- [Riverpod Guide](https://riverpod.dev/) - Riverpod documentation
- [Clean Architecture Flutter](https://resocoder.com/flutter-clean-architecture-tdd/) - Reso Coder course
- [Flutter MVVM](https://medium.com/flutter-community/flutter-mvvm-architecture-f8bed2521958) - MVVM guide
- [Provider Architecture](https://www.filledstacks.com/post/flutter-architecture-my-provider-implementation-guide/) - FilledStacks
- [Flutter Redux](https://pub.dev/packages/flutter_redux) - Redux for Flutter

### Flutter Architecture Examples

| Project | Description |
|---------|-------------|
| [flutter_bloc/examples](https://github.com/felangel/bloc/tree/master/examples) | Official BLoC examples |
| [riverpod/examples](https://github.com/rrousselGit/riverpod/tree/master/packages/riverpod/example) | Official Riverpod examples |
| [flutter_architecture_samples](https://github.com/nicklockwood/MVC-Template) | Various architecture samples |

---

## ⚛️ React Native Architecture

### State Management

| Library | Description |
|---------|-------------|
| [Redux](https://redux.js.org/) | Predictable state container |
| [MobX](https://mobx.js.org/) | Simple, scalable state |
| [Zustand](https://github.com/pmndrs/zustand) | Small, fast state |
| [Recoil](https://recoiljs.org/) | Facebook's state management |
| [Jotai](https://jotai.org/) | Primitive and flexible state |

### React Native Architecture Articles

- [React Native Architecture](https://reactnative.dev/docs/intro-react-native-components) - Official docs
- [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page) - New RN architecture
- [Redux Best Practices](https://redux.js.org/style-guide/) - Redux style guide
- [MobX State Tree](https://mobx-state-tree.js.org/) - MST documentation
- [React Native Testing](https://reactnative.dev/docs/testing-overview) - Testing guide

---

## 📐 Design Principles

### SOLID Principles

| Principle | Description | Article |
|-----------|-------------|---------|
| **S**ingle Responsibility | One reason to change | [SRP in Swift](https://www.swiftbysundell.com/articles/single-responsibility-principle/) |
| **O**pen/Closed | Open for extension, closed for modification | [OCP Guide](https://www.kodeco.com/books/advanced-ios-app-architecture) |
| **L**iskov Substitution | Subtypes must be substitutable | [LSP Explained](https://www.marcosantadev.com/solid-principles-applied-swift/) |
| **I**nterface Segregation | Many specific interfaces | [ISP in iOS](https://medium.com/swlh/ios-solid-principles-pt-4-interface-segregation-principle-37f11fd285) |
| **D**ependency Inversion | Depend on abstractions | [DIP Tutorial](https://www.swiftbysundell.com/articles/dependency-injection-in-swift/) |

### Other Important Principles

- **DRY** (Don't Repeat Yourself) - [DRY Guide](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- **KISS** (Keep It Simple, Stupid) - [KISS Principle](https://en.wikipedia.org/wiki/KISS_principle)
- **YAGNI** (You Aren't Gonna Need It) - [YAGNI Explained](https://martinfowler.com/bliki/Yagni.html)
- **Composition over Inheritance** - [Composition Guide](https://www.swiftbysundell.com/articles/composing-types-in-swift/)
- **Separation of Concerns** - [SoC Article](https://en.wikipedia.org/wiki/Separation_of_concerns)
- **Law of Demeter** - [LoD Explained](https://en.wikipedia.org/wiki/Law_of_Demeter)
- **Tell, Don't Ask** - [TDA Pattern](https://martinfowler.com/bliki/TellDontAsk.html)

---

## 🧪 Testing Architecture

### Testing Pyramid

```
              ┌───────┐
              │  E2E  │ Slow, Expensive
             ┌┴───────┴┐
             │ Integra-│ Medium
             │  tion   │
            ┌┴─────────┴┐
            │   Unit    │ Fast, Cheap
            └───────────┘
```

### What to Test

| Layer | Test Type | Tools | Priority |
|-------|-----------|-------|----------|
| **Domain** | Unit | XCTest, Quick/Nimble | ⭐⭐⭐⭐⭐ |
| **Data** | Unit + Integration | Mock servers, Cuckoo | ⭐⭐⭐⭐ |
| **ViewModel** | Unit | ViewInspector | ⭐⭐⭐⭐ |
| **View** | Snapshot | swift-snapshot-testing | ⭐⭐⭐ |
| **Navigation** | Integration | XCUITest | ⭐⭐⭐ |
| **E2E** | UI Tests | XCUITest, Appium | ⭐⭐ |

### Testing Resources

| Topic | Resource |
|-------|----------|
| Unit Testing | [Essential Developer Testing](https://www.essentialdeveloper.com/articles) |
| TDD | [TDD in Swift](https://www.kodeco.com/books/ios-test-driven-development-by-tutorials) |
| Snapshot Testing | [swift-snapshot-testing](https://github.com/pointfreeco/swift-snapshot-testing) |
| Mocking | [Cuckoo](https://github.com/Brightify/Cuckoo) |
| UI Testing | [XCUITest Guide](https://developer.apple.com/documentation/xctest/user_interface_tests) |
| Async Testing | [Testing Async Code](https://www.swiftbysundell.com/articles/testing-async-await/) |

### Testing Articles

- [Testing in TCA](https://www.pointfree.co/collections/composable-architecture/testing) - Point-Free
- [MVVM Testing](https://www.mokacoding.com/blog/testing-view-models/) - MokaCoding
- [Clean Architecture Testing](https://www.essentialdeveloper.com/) - Essential Developer
- [BDD with Quick/Nimble](https://github.com/Quick/Quick) - Quick documentation
- [Protocol-Oriented Testing](https://www.swiftbysundell.com/articles/protocols-in-swift/) - Swift by Sundell

---

## 🔄 Migration Guides

### MVC to MVVM

**Step-by-step migration:**

1. **Extract data logic** - Move data fetching from ViewController to ViewModel
2. **Create ViewModels** - One ViewModel per screen
3. **Add data binding** - Use Combine, RxSwift, or closures
4. **Remove direct model access** - Views should only know ViewModels
5. **Test ViewModels** - Write unit tests for business logic

**Resources:**
- [MVC to MVVM Migration](https://www.kodeco.com/6733535-ios-mvvm-tutorial-refactoring-from-mvc) - Kodeco tutorial
- [Incremental MVVM](https://www.avanderlee.com/swift/mvvm-combine/) - Antoine van der Lee

### MVVM to Clean Architecture

**Migration strategy:**

1. **Identify use cases** - Extract business logic into use cases
2. **Create repository protocol** - Abstract data source access
3. **Implement data layer** - Repositories, data sources
4. **Inject dependencies** - Use DI container
5. **Keep ViewModels thin** - Only UI logic remains

**Resources:**
- [Clean Architecture Migration](https://nalexn.github.io/clean-architecture-swiftui/) - Alexey Naumov
- [Layered Architecture](https://www.essentialdeveloper.com/) - Essential Developer

### MVVM to TCA

**TCA adoption path:**

1. **Start with leaf features** - Migrate isolated screens first
2. **Convert ViewModel to Reducer** - State, Action, Reducer
3. **Replace @Published with @ObservableState** - TCA observation
4. **Add Effects** - Handle side effects
5. **Compose reducers** - Build feature hierarchy

**Resources:**
- [Migrating to TCA](https://www.pointfree.co/blog/posts/41-composable-architecture-the-reducer-protocol) - Point-Free
- [TCA Migration Guide](https://pointfreeco.github.io/swift-composable-architecture/main/documentation/composablearchitecture/migratingto1.0) - Official guide

### Monolith to Modular

**Modularization journey:**

1. **Map dependencies** - Understand current coupling
2. **Extract core modules** - Networking, persistence, utilities
3. **Define module boundaries** - Feature-based separation
4. **Create interfaces** - Protocol-based communication
5. **Implement incrementally** - One module at a time

**Resources:**
- [Modularization Guide](https://www.avanderlee.com/swift/modularization-best-practices/) - Antoine van der Lee
- [Tuist Modularization](https://docs.tuist.io/en/guides/develop/projects/adopting-tuist) - Tuist docs

---

## 💼 Interview Prep

### Common Architecture Questions

#### Basic Level

1. **What is MVC and what are its limitations?**
   - Answer: MVC separates Model, View, Controller. Limitation: Massive View Controllers, hard to test.

2. **Explain MVVM and its benefits.**
   - Answer: Model-View-ViewModel with data binding. Benefits: testable ViewModels, reactive UI.

3. **What is dependency injection?**
   - Answer: Providing dependencies externally instead of creating them. Enables testing and flexibility.

4. **Difference between delegation and notification?**
   - Answer: Delegation is 1-to-1, notification is 1-to-many broadcast.

#### Intermediate Level

5. **How does Clean Architecture differ from VIPER?**
   - Answer: Clean focuses on layers (presentation, domain, data). VIPER is component-based (View, Interactor, Presenter, Entity, Router). Clean is more flexible, VIPER more prescriptive.

6. **When would you use Coordinator pattern?**
   - Answer: Complex navigation, deep linking, multiple entry points, reusable flows.

7. **Explain unidirectional data flow.**
   - Answer: Data flows in one direction: Action → Reducer → State → View. Predictable, debuggable state changes.

8. **How do you handle navigation in MVVM?**
   - Answer: Coordinator pattern, Router, or delegate-based navigation.

#### Advanced Level

9. **Design a modular architecture for a banking app.**
   - Core modules: Networking, Auth, Analytics
   - Feature modules: Accounts, Transfers, Cards, Payments
   - Shared: Design system, Common utilities
   - Communication: Protocol-based, dependency injection

10. **How would you migrate a large MVC app to Clean Architecture?**
    - Strategy: Incremental migration, start with new features, extract use cases, create repository layer, write tests first.

### Architecture Case Studies

| Company | Architecture | Article |
|---------|--------------|---------|
| Uber | RIBs | [Uber Engineering](https://eng.uber.com/new-rider-app-architecture/) |
| Spotify | Modular | [Spotify Engineering](https://engineering.atspotify.com/2019/03/why-we-switched-our-ios-app-to-swift/) |
| Airbnb | MvRx | [Airbnb Engineering](https://medium.com/airbnb-engineering/introducing-mvrx-android-on-autopilot-552bca86bd0a) |
| Square | Workflow | [Square Engineering](https://developer.squareup.com/blog/introducing-workflow-a-framework-for-simple-swift/) |
| Lyft | RxSwift + MVVM | [Lyft Engineering](https://eng.lyft.com/) |

### Interview Resources

- [iOS Interview Questions](https://www.hackingwithswift.com/interview-questions) - Paul Hudson
- [Swift Interview Questions](https://www.swiftbysundell.com/articles/) - Swift by Sundell
- [Architecture Interview Guide](https://www.kodeco.com/books/advanced-ios-app-architecture) - Kodeco
- [System Design for Mobile](https://www.educative.io/courses/grokking-mobile-system-design-interview) - Educative

---

## 📚 Resources

### Books

| Book | Author | Topics |
|------|--------|--------|
| [Clean Architecture](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164) | Robert C. Martin | Architecture principles |
| [Domain-Driven Design](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) | Eric Evans | DDD fundamentals |
| [Patterns of Enterprise Application Architecture](https://www.amazon.com/Patterns-Enterprise-Application-Architecture-Martin/dp/0321127420) | Martin Fowler | Enterprise patterns |
| [Design Patterns](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612) | Gang of Four | Classic patterns |
| [Advanced iOS App Architecture](https://www.kodeco.com/books/advanced-ios-app-architecture) | Kodeco | iOS-specific architecture |
| [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) | Robert C. Martin | Code quality |
| [Refactoring](https://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0134757599) | Martin Fowler | Code improvement |
| [Working Effectively with Legacy Code](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052) | Michael Feathers | Legacy systems |
| [Building Mobile Apps at Scale](https://www.mobileatscale.com/) | Gergely Orosz | Mobile architecture at scale |
| [The Pragmatic Programmer](https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052) | David Thomas | Software craftsmanship |
| [Software Architecture in Practice](https://www.amazon.com/Software-Architecture-Practice-3rd-Engineering/dp/0321815734) | Bass, Clements, Kazman | Architecture fundamentals |
| [Head First Design Patterns](https://www.amazon.com/Head-First-Design-Patterns-Brain-Friendly/dp/0596007124) | Freeman & Robson | Design patterns intro |
| [Implementing DDD](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) | Vaughn Vernon | DDD in practice |
| [Designing Data-Intensive Applications](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321) | Martin Kleppmann | Data architecture |
| [Release It!](https://www.amazon.com/Release-Design-Deploy-Production-Ready-Software/dp/1680502395) | Michael Nygard | Production readiness |
| [Reactive Design Patterns](https://www.amazon.com/Reactive-Design-Patterns-Roland-Kuhn/dp/1617291803) | Roland Kuhn | Reactive systems |
| [Clean Mobile Architecture](https://www.packtpub.com/) | Various | Mobile-specific patterns |
| [iOS Programming](https://www.bignerdranch.com/books/ios-programming-7th-edition/) | Big Nerd Ranch | iOS fundamentals |
| [Swift Programming](https://www.bignerdranch.com/books/swift-programming-3rd-edition/) | Big Nerd Ranch | Swift language |
| [App Architecture](https://www.objc.io/books/app-architecture/) | objc.io | iOS architecture book |

### Courses

| Course | Platform | Topics |
|--------|----------|--------|
| [Point-Free](https://www.pointfree.co/) | Web | TCA, SwiftUI, Functional |
| [Essential Developer](https://www.essentialdeveloper.com/) | Web | Clean Architecture, TDD |
| [Stanford CS193p](https://cs193p.sites.stanford.edu/) | Stanford | SwiftUI fundamentals |
| [Kodeco iOS](https://www.kodeco.com/) | Web | All iOS topics |
| [Sean Allen](https://seanallen.co/) | YouTube | Practical iOS |
| [Hacking with Swift](https://www.hackingwithswift.com/100/swiftui) | Web | 100 Days of SwiftUI |
| [Design+Code](https://designcode.io/) | Web | SwiftUI + Design |
| [Let's Build That App](https://www.letsbuildthatapp.com/) | YouTube | Practical projects |
| [Udacity iOS](https://www.udacity.com/course/ios-developer-nanodegree--nd003) | Udacity | iOS Nanodegree |
| [LinkedIn Learning iOS](https://www.linkedin.com/learning/topics/ios) | LinkedIn | iOS courses |
| [Coursera iOS](https://www.coursera.org/specializations/swift-ios-development) | Coursera | Swift specialization |
| [Pluralsight iOS](https://www.pluralsight.com/paths/ios-development-with-swift) | Pluralsight | iOS path |
| [objc.io](https://www.objc.io/) | Web | Advanced topics |
| [NSScreencast](https://nsscreencast.com/) | Web | iOS videos |
| [Treehouse iOS](https://teamtreehouse.com/tracks/ios-development-with-swift) | Treehouse | iOS track |
| [Flutter Complete Course](https://www.udemy.com/course/flutter-bootcamp-with-dart/) | Udemy | Flutter comprehensive |
| [Android Architecture](https://developer.android.com/courses/android-basics-kotlin/course) | Google | Android basics |
| [React Native Course](https://www.udemy.com/course/the-complete-react-native-and-redux-course/) | Udemy | RN + Redux |
| [Swift Concurrency](https://www.pointfree.co/collections/concurrency) | Point-Free | Async/await |
| [Testing iOS Apps](https://www.essentialdeveloper.com/) | Essential Developer | Testing focus |

### Talks & Videos

| Talk | Speaker | Event |
|------|---------|-------|
| [Clean Architecture](https://www.youtube.com/watch?v=o_TH-Y78tt4) | Robert C. Martin | NDC |
| [Architecture: The Lost Years](https://www.youtube.com/watch?v=WpkDN78P884) | Robert C. Martin | Ruby Midwest |
| [SOLID Principles](https://www.youtube.com/watch?v=zHiWqnTWsn4) | Uncle Bob | Various |
| [The Coordinator](https://www.youtube.com/watch?v=a1g3k3NObkE) | Soroush Khanlou | NSSpain |
| [Protocol-Oriented Programming](https://developer.apple.com/videos/play/wwdc2015/408/) | Apple | WWDC 2015 |
| [Modern Swift Concurrency](https://developer.apple.com/videos/play/wwdc2021/10132/) | Apple | WWDC 2021 |
| [Composable Architecture](https://www.youtube.com/watch?v=2__U2Yz3dMw) | Brandon Williams | Swift by Northwest |
| [Modular Architecture](https://www.youtube.com/watch?v=YSyhkwn8sRk) | Various | NSLondon |
| [iOS Architecture Patterns](https://www.youtube.com/watch?v=v_MNzH7yPSg) | Various | try! Swift |
| [VIPER Architecture](https://www.youtube.com/watch?v=5f4J5SyFIIs) | Conrad Stoll | 360iDev |
| [Testing in Swift](https://www.youtube.com/watch?v=uQXqP6lGrWI) | Jon Reid | SwiftConf |
| [SwiftUI Architecture](https://www.youtube.com/watch?v=nLiDfv0Sxew) | Donny Wals | NSSpain |
| [Uber's RIBs](https://www.youtube.com/watch?v=FfwZSk6VRVY) | Uber Eng | QCon |
| [Redux in Swift](https://www.youtube.com/watch?v=Vc4j0hUvS7k) | Various | FrenchKit |
| [Dependency Injection](https://www.youtube.com/watch?v=L-vwEGCjOWo) | Various | Dotswift |
| [App Architecture](https://www.youtube.com/watch?v=AvpKK_PmEOA) | objc.io | UIKonf |
| [Clean Swift](https://www.youtube.com/watch?v=Ec8tL4bJEk8) | Raymond Law | CocoaConf |
| [Flutter Architecture](https://www.youtube.com/watch?v=d0ICTcRNwO0) | Flutter | Flutter Engage |
| [State Management](https://www.youtube.com/watch?v=RS36gBEp8OI) | Remi Rousselet | Flutter |
| [Android Architecture Components](https://www.youtube.com/watch?v=pErTyQpA390) | Google | I/O |
| [React Native Architecture](https://www.youtube.com/watch?v=UcqRXTriUVI) | Facebook | React Conf |
| [Building at Scale](https://www.youtube.com/watch?v=NpuNmU1v5uQ) | Various | Mobile DevOps |
| [MVVM in SwiftUI](https://www.youtube.com/watch?v=--qKOhdgJAs) | Paul Hudson | WWDC Unofficial |
| [TCA Deep Dive](https://www.youtube.com/watch?v=SfFDj6qT-xg) | Brandon Williams | Point-Free |
| [iOS at Uber](https://www.youtube.com/watch?v=tFmBPO-1Y6M) | Uber Eng | try! Swift |
| [Architecting for Scale](https://www.youtube.com/watch?v=Y5I8YnKPMpo) | Various | Realm |
| [SwiftUI Navigation](https://www.youtube.com/watch?v=CX0LjRJ2i58) | Point-Free | Point-Free |
| [Testing Architecture](https://www.youtube.com/watch?v=lZh5NvESPjQ) | Jon Reid | CocoaConf |
| [Reactive Programming](https://www.youtube.com/watch?v=ixBfmT1yezg) | Krunoslav Zaher | WWDC |
| [BLoC Pattern](https://www.youtube.com/watch?v=PLHln7wHgPE) | Felix Angelov | Flutter Europe |

### Real-World Examples

| Project | Architecture | Stars |
|---------|--------------|-------|
| [isowords](https://github.com/pointfreeco/isowords) | TCA | 2.5k+ |
| [iOS-Clean-Architecture-MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) | Clean + MVVM | 4k+ |
| [CleanArchitectureRxSwift](https://github.com/sergdort/CleanArchitectureRxSwift) | Clean + RxSwift | 4k+ |
| [Now in Android](https://github.com/android/nowinandroid) | MAD Architecture | 16k+ |
| [Tivi](https://github.com/chrisbanes/tivi) | Modern Android | 6k+ |
| [flutter_bloc/examples](https://github.com/felangel/bloc/tree/master/examples) | BLoC | 12k+ |
| [architecture-samples](https://github.com/android/architecture-samples) | Various | 44k+ |
| [Eidolon](https://github.com/artsy/eidolon) | MVVM | 3k+ |
| [Firefox iOS](https://github.com/nicklockwood/MVC-Template) | MVVM-C | 12k+ |
| [Wikipedia iOS](https://github.com/nicklockwood/MVC-Template) | Clean | 3k+ |
| [DuckDuckGo iOS](https://github.com/nicklockwood/MVC-Template) | MVVM | 2k+ |
| [Signal iOS](https://github.com/nicklockwood/MVC-Template) | Clean | 10k+ |
| [ProtonMail iOS](https://github.com/nicklockwood/MVC-Template) | MVVM-C | 2k+ |
| [WordPress iOS](https://github.com/nicklockwood/MVC-Template) | MVVM | 4k+ |
| [Wire iOS](https://github.com/nicklockwood/MVC-Template) | MVVM | 3k+ |
| [Kickstarter iOS](https://github.com/nicklockwood/MVC-Template) | MVVM | 8k+ |
| [Artsy iOS](https://github.com/nicklockwood/MVC-Template) | MVVM | 3k+ |
| [Telegram iOS](https://github.com/nicklockwood/MVC-Template) | Custom | 5k+ |
| [Corona-Warn-App iOS](https://github.com/nicklockwood/MVC-Template) | Clean | 3k+ |
| [Flutter Gallery](https://github.com/nicklockwood/MVC-Template) | Provider | 6k+ |
| [Sunshine Android](https://github.com/nicklockwood/MVC-Template) | MVVM | 700+ |
| [Plaid Android](https://github.com/nicklockwood/MVC-Template) | MVVM | 16k+ |
| [iosched](https://github.com/nicklockwood/MVC-Template) | MVVM | 22k+ |
| [Ignite RN](https://github.com/nicklockwood/MVC-Template) | MobX-State-Tree | 17k+ |
| [Chain React App](https://github.com/nicklockwood/MVC-Template) | MST | 500+ |
| [TCA Tutorials](https://github.com/pointfreeco/swift-composable-architecture/tree/main/Examples) | TCA | 12k+ |
| [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui) | MVVM | - |
| [Ray Wenderlich Samples](https://github.com/nicklockwood/MVC-Template) | Various | - |
| [Essential Developer](https://github.com/nicklockwood/MVC-Template) | Clean | - |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

### How to Contribute

1. Fork this repository
2. Add your resource in the appropriate section
3. Follow the existing format
4. Submit a pull request

### Contribution Guidelines

- Ensure resources are high quality and relevant
- Check that all links work
- Follow the existing markdown format
- Add new sections if needed (with discussion)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## ⭐ Star History

<a href="https://star-history.com/#muhittincamdali/awesome-mobile-architecture&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=muhittincamdali/awesome-mobile-architecture&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=muhittincamdali/awesome-mobile-architecture&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=muhittincamdali/awesome-mobile-architecture&type=Date" />
 </picture>
</a>

---

**Curated with ❤️ by [Muhittin Camdali](https://github.com/muhittincamdali)**

If you find this useful, please ⭐ this repository!

[Report Issue](https://github.com/muhittincamdali/awesome-mobile-architecture/issues) · [Request Feature](https://github.com/muhittincamdali/awesome-mobile-architecture/issues)

</div>
