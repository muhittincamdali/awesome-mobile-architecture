<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-light.svg" alt="Mobile Architecture: Checked links on app architecture for iOS, Flutter and React Native, each with the reason to read it."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/awesome-mobile-architecture/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-light.svg" alt="Latest version: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-light.svg" alt="Language version: Node.js 24+"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-light.svg" alt="License: MIT"></picture></a>
</p>

<p align="center">
<a href="#quick-start"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-en-light.svg" alt="Get started"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-en-light.svg" alt="Guides"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-en-light.svg" alt="Examples"></picture></a>
</p>

<!-- brand:end -->

Links on how to structure an iOS, Flutter or React Native app: the official guidance first, then
the libraries, sample apps and tools that put it into practice. Every entry was opened and read
by a person and comes with one line saying what you get from it. A weekly job flags any listed
repository that is archived, renamed or has not been updated in 540 days, and any link that
stops answering, so the list does not quietly rot.

## Highlights

- **Three platforms, one structure** — iOS, Flutter and React Native sections with the same
  categories, plus the platform-independent articles the patterns come from.
- **A reason for every link** — each entry has a one-line "why"; marketing words such as "best"
  are rejected by the checker.
- **Checked, not collected** — entries live in [data/entries.json](data/entries.json), are
  validated on every push and rendered into this README; GitHub activity and link health are
  checked every week ([how](docs/guides/keeping-the-list-current.md)).
- **The same feature in three stacks** — a [reading list example](Examples/README.md) in
  SwiftUI, Flutter and React Native with 43 tests that check the same rules on each platform.
- **Current platform changes** — a [guide to the iOS 27 scene life cycle](docs/guides/ios-27-scene-life-cycle.md)
  requirement for native, Flutter and React Native apps.

## Quick start

**1. Pick your platform.** Jump to [iOS](#ios), [Flutter](#flutter) or
[React Native](#react-native). Read the *Official guidance* entries first; the libraries below
them build on those ideas.

**2. Run the example for your stack.** It is the smallest working version of the structure the
guides describe:

```sh
git clone https://github.com/muhittincamdali/awesome-mobile-architecture.git
cd awesome-mobile-architecture/Examples/flutter/reading_list   # or ios/ReadingList, react-native/reading-list
flutter test                                                  # swift test, or npm ci && npm test
```

**3. Decide how much structure you need.** [Choosing an architecture](docs/guides/choosing-an-architecture.md)
maps the shared ideas across the three platforms and says when a library such as TCA, Bloc or
Redux Toolkit starts to pay off.

<p align="center">
<img src="docs/images/reading-list-ios-loaded-light.png" width="240" alt="The iOS reading list example showing five articles, the first one marked as read">
<img src="docs/images/reading-list-ios-loaded-dark.png" width="240" alt="The same screen in dark mode">
</p>

<!-- list:start -->

## Contents

- [Concepts that apply everywhere](#concepts-that-apply-everywhere) (4)
- [iOS](#ios) (20)
- [Flutter](#flutter) (18)
- [React Native](#react-native) (15)

57 entries. Each one was opened and checked by hand; the newest check is from 2026-10-28.

## Concepts that apply everywhere

### Official guidance

- [Guide to app architecture (Android)](https://developer.android.com/topic/architecture) - Google's UI layer, data layer and unidirectional data flow guide; the same split is used on iOS, Flutter and React Native.
- [Presentation Model](https://martinfowler.com/eaaDev/PresentationModel.html) - The pattern MVVM grew out of: the view's state and behaviour kept in a class you can test without a UI.
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - The original article on the dependency rule between layers, which most mobile clean-architecture templates build on.
- [The Elm Architecture](https://guide.elm-lang.org/architecture/) - Model, update, view: the unidirectional loop behind TCA, Redux and BLoC, explained in a few short pages.

## iOS

### Official guidance

- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/) - WWDC23 session on how Observation tracks the properties a view reads, the basis of current SwiftUI view models.
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) - Apple's walkthrough of `@Observable` models and who owns them with `@State`, `@Environment` and `@Bindable`.
- [Migrating to the Observable macro](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro) - The exact edits that move an `ObservableObject` view model to `@Observable`, and how view updates change.
- [Swift 6 migration guide](https://www.swift.org/migration/documentation/migrationguide/) - Data-race safety, `Sendable` and actor isolation step by step: the rules every Swift 6 architecture has to fit.
- [TN3187 UIKit scene-based life cycle](https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle) - Apple's technote for moving an app delegate-only app to `UIScene`, which apps built with the iOS 27 SDK must adopt.

### State and architecture libraries

- [Swift Async Algorithms](https://github.com/apple/swift-async-algorithms) - Debounce, throttle, merge and other `AsyncSequence` operators that replace Combine pipelines in view models.
- [Swift Sharing](https://github.com/pointfreeco/swift-sharing) - Shares and persists state between features (user defaults, files, memory) through one property wrapper.
- [The Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture) - Reducers, effects and dependencies in one library, with a test store that asserts every state change.
- [Workflow (Swift)](https://github.com/square/workflow-swift) - Square's composable state machines that render UI, with a matching Kotlin library for the Android app.

### Dependency injection

- [Factory](https://github.com/hmlongco/Factory) - Container-based injection with compile-time checked registrations and per-test overrides, without code generation.
- [Needle](https://github.com/uber/needle) - Uber's compile-time checked dependency graph, generated from code and built for apps with many modules.
- [Swift Dependencies](https://github.com/pointfreeco/swift-dependencies) - Environment-style dependency injection that also works outside views and swaps in test values per test.
- [Swinject](https://github.com/Swinject/Swinject) - Runtime container with object scopes, common in UIKit code bases that resolve dependencies at startup.

### Navigation

- [Swift Navigation](https://github.com/pointfreeco/swift-navigation) - State-driven navigation for SwiftUI, UIKit and AppKit: a destination is an optional or an enum case in the model.
- [XCoordinator](https://github.com/QuickBirdEng/XCoordinator) - Coordinator pattern for UIKit with typed routes, so view controllers no longer push each other.

### Sample apps

- [Clean Architecture for SwiftUI](https://github.com/nalexn/clean-architecture-swiftui) - SwiftUI app with SwiftData persistence, networking, dependency injection and unit tests in separate layers.
- [iOS Clean Architecture MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) - UIKit template with a DI container, flow coordinators, DTO mapping and response caching across layers.
- [TCA example apps](https://github.com/pointfreeco/swift-composable-architecture/tree/main/Examples) - Case studies plus Todos, Voice Memos, SyncUps and Search apps, kept in step with each library release.

### Testing

- [SnapshotTesting](https://github.com/pointfreeco/swift-snapshot-testing) - Records views and values as reference files and fails on changes, catching UI regressions unit tests miss.

### Project structure and tooling

- [Tuist](https://github.com/tuist/tuist) - Generates Xcode projects from Swift manifests, which keeps module boundaries explicit as an app grows.

## Flutter

### Official guidance

- [Architecture case study](https://docs.flutter.dev/app-architecture/case-study) - Walks through the Compass app to show the guide applied to real code, layer by layer.
- [Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations) - Each recommendation is rated strongly recommended, recommended or conditional, so you know what is optional.
- [Guide to app architecture (Flutter)](https://docs.flutter.dev/app-architecture/guide) - The Flutter team's recommended layers (UI, data, optional domain) built from views, view models and repositories.
- [State management options](https://docs.flutter.dev/data-and-backend/state-mgmt/options) - The official index of state management approaches, with links to each package's own documentation.
- [UIScene adoption](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate) - What changes for the iOS runner of a Flutter app when `UIScene` becomes required, and how to migrate it.

### State and architecture libraries

- [Bloc](https://github.com/felangel/bloc) - Events in, states out: business logic kept out of widgets and tested with `bloc_test`.
- [Freezed](https://github.com/rrousselGit/freezed) - Generates immutable state classes, sealed unions and `copyWith`, removing boilerplate from state objects.
- [MobX for Dart](https://github.com/mobxjs/mobx.dart) - Observables, actions and reactions with code generation, for teams that prefer reactive state.
- [Provider](https://github.com/rrousselGit/provider) - A thin layer over `InheritedWidget` for injecting `ChangeNotifier` models; the Flutter docs start with it.
- [Riverpod](https://github.com/rrousselGit/riverpod) - Compile-safe providers for async state, caching and dependency injection, testable without a widget tree.
- [Signals.dart](https://github.com/rodydavis/signals.dart) - Fine-grained reactive signals for Dart and Flutter that rebuild only the widgets reading a changed value.

### Dependency injection

- [get_it](https://github.com/flutter-it/get_it) - Service locator for repositories and services that is reachable outside the widget tree.

### Navigation

- [go_router](https://pub.dev/packages/go_router) - URL-based declarative routing maintained by the Flutter team, with deep links, redirects and nested navigators.

### Sample apps

- [Bloc examples](https://github.com/felangel/bloc/tree/master/examples) - Counter, timer, login, todos, infinite list and weather apps, each built with bloc and covered by tests.
- [Compass app](https://github.com/flutter/samples/tree/main/compass_app) - The official sample behind the architecture guide, with unit, widget and integration tests.
- [Flutter architecture samples](https://github.com/brianegan/flutter_architecture_samples) - One todo app built with BLoC, Redux, MobX, signals and more, so the approaches can be compared side by side.

### Project structure and tooling

- [Melos](https://github.com/invertase/melos) - Runs scripts, versioning and publishing across a Dart workspace when an app is split into feature packages.
- [Very Good CLI](https://github.com/VeryGoodOpenSource/very_good_cli) - Creates apps and packages with a layered structure, tests and strict lints already set up.

## React Native

### Official guidance

- [About the New Architecture](https://reactnative.dev/architecture/landing-page) - Explains Fabric, TurboModules and JSI, the architecture new React Native apps have used by default since 0.76.
- [Managing State (React)](https://react.dev/learn/managing-state) - React's own guide to structuring state, lifting it up and moving it into reducers and context.
- [Testing overview](https://reactnative.dev/docs/testing-overview) - The official map of unit, component and end-to-end tests and which layer of an app each one covers.

### State and architecture libraries

- [Jotai](https://github.com/pmndrs/jotai) - Atomic state: compose small atoms instead of one global store, with derived atoms for computed values.
- [Legend-State](https://github.com/LegendApp/legend-state) - Fine-grained reactive state with built-in persistence, for apps that keep data on the device.
- [MobX](https://github.com/mobxjs/mobx) - Observable state with automatic dependency tracking; a component re-renders only when what it read changes.
- [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) - The official way to write Redux: slices, immutable updates written as mutations and RTK Query for server data.
- [TanStack Query](https://github.com/TanStack/query) - Keeps server data in its own layer with caching, refetching and retries, separate from UI state.
- [XState](https://github.com/statelyai/xstate) - State machines and statecharts for flows with many states and transitions, such as checkout or onboarding.
- [Zustand](https://github.com/pmndrs/zustand) - A small hook-based store that needs no provider; selectors keep re-renders limited to what changed.

### Navigation

- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing for Expo and React Native apps, where every screen gets a URL and deep links work.
- [React Navigation](https://github.com/react-navigation/react-navigation) - Stack, tab and drawer navigators for React Native; Expo Router is built on top of it.

### Sample apps

- [Ignite](https://github.com/infinitered/ignite) - Infinite Red's boilerplate and generators: a complete app structure with state, navigation and tests.
- [Obytes React Native template](https://github.com/obytes/react-native-template-obytes) - Expo and TypeScript starter with Expo Router, React Query, form handling and CI already wired together.

### Testing

- [React Native Testing Library](https://github.com/callstack/react-native-testing-library) - Queries components the way a user finds them, so tests survive refactors of the code behind a screen.

<!-- list:end -->

## How entries are chosen

An entry is added when it helps someone structure an app and a person has read it, not because
it is popular. It needs:

- an official source, or a library, sample or article that shows a pattern in working code;
- for a GitHub repository: not archived and a push within the last 540 days;
- a one-line reason that says what the reader gets, in plain words.

Entries that fail these rules later are removed or replaced. Known gaps: Android-only and Kotlin
Multiplatform material is out of scope, and paid courses are not listed.

## Guides

- [Choosing an architecture for a mobile app](docs/guides/choosing-an-architecture.md)
- [The iOS 27 SDK and the UIScene life cycle](docs/guides/ios-27-scene-life-cycle.md)
- [How the list is kept current](docs/guides/keeping-the-list-current.md)

## Contributing

Suggestions are welcome. Add the entry to [data/entries.json](data/entries.json), run
`npm ci && npm run list:render && npm test`, and open a pull request; the
[contributing guide](CONTRIBUTING.md) lists the rules the checker applies.

## License

[MIT](LICENSE). The linked material belongs to its authors and keeps its own license.
