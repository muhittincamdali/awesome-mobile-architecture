# The iOS 27 SDK and the UIScene life cycle

At WWDC25 Apple announced that in the release after iOS 26, an app built with the latest SDK must
use the UIScene life cycle or it will not launch. Apple's technote
[TN3187](https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle)
states it as: "In the next major release following iOS 26, UIScene lifecycle will be required
when building with the latest SDK; otherwise, your app won't launch." That release is iOS 27,
built with Xcode 27.

The change is about where the app's window and its life-cycle events live, so it touches the
outermost layer of every architecture: the app delegate code that creates the first screen and
reacts to foreground and background transitions.

## Does an app need to change?

TN3187 lists two conditions. An app needs to migrate when either is true:

- `Info.plist` has no `UIApplicationSceneManifest` entry, or the entry has no configurations.
- The app delegate does not implement `application(_:configurationForConnecting:options:)`.

## Native apps

- **SwiftUI `App`:** a `WindowGroup` is already a scene. The generated `Info.plist` includes the
  scene manifest when `INFOPLIST_KEY_UIApplicationSceneManifest_Generation` is `YES`, as in the
  [example app's project.yml](../../Examples/ios/ReadingListApp/project.yml).
- **UIKit app delegate:** add a scene manifest and a `UIWindowSceneDelegate`, then move window
  creation from `application(_:didFinishLaunchingWithOptions:)` to
  `scene(_:willConnectTo:options:)`. Move foreground and background handling to the scene
  delegate's `sceneDidBecomeActive(_:)`, `sceneWillResignActive(_:)`,
  `sceneWillEnterForeground(_:)` and `sceneDidEnterBackground(_:)`. Apple's
  [Managing your app's life cycle](https://developer.apple.com/documentation/uikit/managing-your-app-s-life-cycle)
  explains which events go where.

Architectures that keep app start-up in a coordinator or composition root only need that root
to be created by the scene delegate instead of the app delegate; the features below it do not
change.

## Flutter apps

The Flutter page [UIScene adoption](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate)
says apps that have not adopted the life cycle crash on start-up when built with Xcode 27. Since
Flutter 3.41 the CLI migrates an app whose `AppDelegate` has not been customised when you run
`flutter run` or `flutter build ios`; it prints `Finished migration to UIScene lifecycle` on
success. A customised `AppDelegate` is migrated by hand: plugins are registered in the new
`didInitializeImplicitFlutterEngine` callback, and `Info.plist` gets a scene manifest that names
`FlutterSceneDelegate`. Plugins that listen to application life-cycle events need their own
update, described on the same page.

## React Native apps

The [React Native community template](https://github.com/react-native-community/template/blob/main/template/ios/HelloWorld/SceneDelegate.swift),
which new projects start from, creates the React Native factory and the window in a
`SceneDelegate`. An older project that still does this in `AppDelegate` needs the same move as a
UIKit app: a scene manifest in `Info.plist` and a scene delegate that creates
`RCTReactNativeFactory` and the window in `scene(_:willConnectTo:options:)`. Native code that
reads the app delegate's `window` property then finds `nil`, because the window belongs to the
scene delegate; it has to reach the window through the connected `UIWindowScene` instead.

## Checking a project

[sdkbump](https://github.com/muhittincamdali/sdkbump), from the author of this list, scans a
native, Flutter or React Native project for the iOS 27 SDK changes, starting with the scene life
cycle, and names the fix for each finding.
