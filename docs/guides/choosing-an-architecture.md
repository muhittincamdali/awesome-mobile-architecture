# Choosing an architecture for a mobile app

The three platform guides in this list (Apple's model data articles, the Flutter architecture
guide and React's state guide) agree on more than their vocabulary suggests. This page puts the
shared ideas side by side and gives a short way to decide how much structure an app needs. The
[reading list example](../../Examples/README.md) shows each idea in Swift, Dart and TypeScript.

## The ideas every platform guide shares

| Idea                         | iOS (SwiftUI)                                | Flutter                                   | React Native                                     |
| ---------------------------- | -------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| UI is a function of state    | `View.body` reads an `@Observable` model     | `build` reads a `ChangeNotifier` or state | a component renders props and state              |
| One owner per piece of state | the view model owns the list; views read it  | the view model owns it; widgets read it   | a store or reducer owns it; components subscribe |
| Events flow one way          | view calls a method, the model changes state | widget calls a method, notifier notifies  | component dispatches or calls the store          |
| Data access behind a type    | a protocol (`ArticleRepository`)             | an `abstract interface class`             | a TypeScript interface                           |
| States are explicit          | an `enum` with one case per screen state     | a `sealed class` hierarchy                | a discriminated union                            |

Sources: [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app),
the Flutter [guide to app architecture](https://docs.flutter.dev/app-architecture/guide), React's
[Managing State](https://react.dev/learn/managing-state) and, for the one-way loop these all
follow, [The Elm Architecture](https://guide.elm-lang.org/architecture/).

## How much structure an app needs

Start with the smallest setup that keeps the rules above, and add a library when a concrete
problem appears, not before.

1. **A screen or two, one developer.** A view model per screen and a repository interface is
   enough: `@Observable` on iOS, `ChangeNotifier` with `ListenableBuilder` on Flutter,
   `useReducer` or a small store with `useSyncExternalStore` on React Native. This is what the
   example in this repository uses, with no dependencies.
2. **State shared between screens.** Move it out of the screens into an object the screens
   receive: an `@Observable` model in the SwiftUI environment, a Riverpod provider or an
   injected repository on Flutter, a Zustand, Redux Toolkit or Jotai store on React Native.
   Server data that many screens read benefits from a cache layer such as TanStack Query.
3. **Many features, several teams.** Split the app into modules or packages with explicit
   dependencies (Tuist or Swift packages on iOS, Dart workspaces with Melos on Flutter, a
   monorepo on React Native) and consider a library that makes every state change explicit and
   testable: The Composable Architecture on iOS, Bloc on Flutter, Redux Toolkit or XState on
   React Native.

Signals that a step up is due: two screens keep the same data in sync by hand, a bug fix in one
feature breaks another, or tests need the whole app to start before they can check a rule.

## What to test at each layer

- **View model or store:** every state transition, including failures and requests that finish
  in an unexpected order. Use a fake repository whose calls the test completes, as the example
  tests do, instead of real delays.
- **Repository:** mapping between the network or database format and the app's types.
- **View:** that each state renders and that taps call the right method; keep logic out of it
  so these tests stay short.

## The iOS 27 SDK and the scene life cycle

Whatever the architecture, an iOS app built with the iOS 27 SDK has to use the UIScene life
cycle. [The scene life cycle guide](ios-27-scene-life-cycle.md) covers what that means for native,
Flutter and React Native apps.
