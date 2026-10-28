<!-- i18n-source: README.md@584cb953daf98d87db6eafcecde0b55f054184a6 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-light.svg" alt="Mobile Architecture: Checked links on app architecture for iOS, Flutter and React Native, each with the reason to read it."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/awesome-mobile-architecture/actions/workflows/ci.yml/badge.svg" alt="CI 状态"></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-light.svg" alt="最新版本: v2.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-light.svg" alt="语言版本: Node.js 24+"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-light.svg" alt="许可证: MIT"></picture></a>
</p>

<p align="center">
<a href="#快速开始"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-zh-CN-light.svg" alt="开始使用"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-zh-CN-light.svg" alt="指南"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-zh-CN-light.svg" alt="示例"></picture></a>
</p>

> 本文是英文 README 的译文。如两者内容不一致，以英文版为准。

<!-- brand:end -->

介绍如何组织 iOS、Flutter 或 React Native 应用的链接：先是官方指引，然后是把这些思路付诸实践的库、示例应用和工具。每个条目都由人工打开并阅读，并附有一句话，说明你能从中获得什么。每周运行的任务会标出已归档、已重命名或 540 天未更新的仓库，以及无法访问的链接，避免列表悄悄过时。

## 亮点

- **三个平台，一套结构** — iOS、Flutter 和 React Native 各有一个分类相同的章节，另有各类模式的出处，即与平台无关的文章。
- **每个链接都有理由** — 每个条目都有一句话的“为什么”；检查器会拒绝“最佳”之类的营销用语。
- **经过检查，而非随手收集** — 条目保存在 [data/entries.json](data/entries.json) 中，每次 push 都会校验并渲染进本 README；GitHub 活跃度和链接健康状况每周检查一次（[详情](docs/guides/keeping-the-list-current.md)）。
- **同一功能，三套技术栈** — 用 SwiftUI、Flutter 和 React Native 实现的[阅读列表示例](Examples/README.md)，带有 43 个测试，在每个平台上检查相同的规则。
- **跟进平台变化** — 一份关于 iOS 27 scene 生命周期要求的[指南](docs/guides/ios-27-scene-life-cycle.md)，适用于原生、Flutter 和 React Native 应用。

## 快速开始

**1. 选择你的平台。** 跳转到 [iOS](#ios)、[Flutter](#flutter) 或 [React Native](#react-native)。先读 *官方指引* 条目；下面的库都建立在这些思路之上。

**2. 运行对应技术栈的示例。** 这是指南所述结构的最小可运行版本：

```sh
git clone https://github.com/muhittincamdali/awesome-mobile-architecture.git
cd awesome-mobile-architecture/Examples/flutter/reading_list   # or ios/ReadingList, react-native/reading-list
flutter test                                                  # swift test, or npm ci && npm test
```

**3. 决定需要多少结构。** [选择架构](docs/guides/choosing-an-architecture.md)梳理了三个平台共有的思路，并说明 TCA、Bloc 或 Redux Toolkit 之类的库何时开始值得引入。

<p align="center">
<img src="docs/images/reading-list-ios-loaded-light.png" width="240" alt="iOS 阅读列表示例，显示五篇文章，第一篇已标记为已读">
<img src="docs/images/reading-list-ios-loaded-dark.png" width="240" alt="同一屏幕的深色模式">
</p>

<!-- list:start -->

## 目录

- [通用概念](#通用概念) (4)
- [iOS](#ios) (20)
- [Flutter](#flutter) (18)
- [React Native](#react-native) (15)

共 57 个条目。每个条目都经人工打开并检查，最近一次检查在 2026-10-28。

## 通用概念

### 官方指引

- [Guide to app architecture (Android)](https://developer.android.com/topic/architecture) - Google 关于 UI 层、数据层和单向数据流的指南；iOS、Flutter 和 React Native 也采用同样的划分。
- [Presentation Model](https://martinfowler.com/eaaDev/PresentationModel.html) - MVVM 的由来：把视图的状态和行为放进一个无需 UI 即可测试的类中。
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - 关于层与层之间依赖规则的原始文章，大多数移动端 Clean Architecture 模板都以它为基础。
- [The Elm Architecture](https://guide.elm-lang.org/architecture/) - Model、update、view：TCA、Redux 和 BLoC 背后的单向循环，几页短文就能讲清楚。

## iOS

### 官方指引

- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/) - WWDC23 的讲座，介绍 Observation 如何跟踪视图读取的属性，这是当前 SwiftUI 视图模型的基础。
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) - Apple 的讲解：`@Observable` 模型，以及如何用 `@State`、`@Environment` 和 `@Bindable` 确定谁拥有它们。
- [Migrating to the Observable macro](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro) - 把 `ObservableObject` 视图模型迁移到 `@Observable` 所需的具体修改，以及视图更新方式的变化。
- [Swift 6 migration guide](https://www.swift.org/migration/documentation/migrationguide/) - 逐步讲解数据竞争安全、`Sendable` 和 actor 隔离：每个 Swift 6 架构都必须遵守的规则。
- [TN3187 UIKit scene-based life cycle](https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle) - Apple 的技术说明，介绍如何把仅使用 app delegate 的应用迁移到 `UIScene`；使用 iOS 27 SDK 构建的应用必须采用它。

### 状态管理与架构库

- [Swift Async Algorithms](https://github.com/apple/swift-async-algorithms) - Debounce、throttle、merge 等 `AsyncSequence` 操作符，可在视图模型中取代 Combine 管道。
- [Swift Sharing](https://github.com/pointfreeco/swift-sharing) - 通过一个属性包装器在功能之间共享并持久化状态（user defaults、文件、内存）。
- [The Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture) - 把 reducer、effect 和依赖集于一个库中，其测试 store 会断言每一次状态变化。
- [Workflow (Swift)](https://github.com/square/workflow-swift) - Square 的可组合状态机，用来渲染 UI；Android 应用有对应的 Kotlin 库。

### 依赖注入

- [Factory](https://github.com/hmlongco/Factory) - 基于容器的注入，注册项在编译期检查，可按测试覆盖，无需代码生成。
- [Needle](https://github.com/uber/needle) - Uber 的编译期检查依赖图，由代码生成，专为模块众多的应用打造。
- [Swift Dependencies](https://github.com/pointfreeco/swift-dependencies) - environment 风格的依赖注入，在视图之外同样可用，并能为每个测试替换成测试值。
- [Swinject](https://github.com/Swinject/Swinject) - 带对象作用域的运行时容器，常见于在启动时解析依赖的 UIKit 代码库。

### 导航

- [Swift Navigation](https://github.com/pointfreeco/swift-navigation) - 面向 SwiftUI、UIKit 和 AppKit 的状态驱动导航：目标页是模型中的一个 optional 或 enum case。
- [XCoordinator](https://github.com/QuickBirdEng/XCoordinator) - 带类型化路由的 UIKit coordinator 模式，让 view controller 不必再互相 push。

### 示例应用

- [Clean Architecture for SwiftUI](https://github.com/nalexn/clean-architecture-swiftui) - SwiftUI 应用，SwiftData 持久化、网络、依赖注入和单元测试分处不同的层。
- [iOS Clean Architecture MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) - UIKit 模板，各层之间包含 DI 容器、流程 coordinator、DTO 映射和响应缓存。
- [TCA example apps](https://github.com/pointfreeco/swift-composable-architecture/tree/main/Examples) - 案例研究，以及 Todos、Voice Memos、SyncUps 和 Search 应用，随库的每次发布同步更新。

### 测试

- [SnapshotTesting](https://github.com/pointfreeco/swift-snapshot-testing) - 把视图和值记录为参考文件，一有变化就失败，能捕获单元测试漏掉的 UI 回归。

### 项目结构与工具

- [Tuist](https://github.com/tuist/tuist) - 根据 Swift manifest 生成 Xcode 项目，随着应用变大，模块边界始终清晰。

## Flutter

### 官方指引

- [Architecture case study](https://docs.flutter.dev/app-architecture/case-study) - 带你走一遍 Compass 应用，逐层展示指南如何应用到真实代码上。
- [Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations) - 每条建议都标为强烈推荐、推荐或视情况而定，让你知道哪些是可选的。
- [Guide to app architecture (Flutter)](https://docs.flutter.dev/app-architecture/guide) - Flutter 团队推荐的分层（UI、数据、可选的 domain 层），由视图、视图模型和 repository 构成。
- [State management options](https://docs.flutter.dev/data-and-backend/state-mgmt/options) - 状态管理方案的官方索引，附有各个包自己文档的链接。
- [UIScene adoption](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate) - `UIScene` 成为必需后，Flutter 应用的 iOS runner 有哪些变化，以及如何迁移。

### 状态管理与架构库

- [Bloc](https://github.com/felangel/bloc) - 事件进，状态出：业务逻辑留在 widget 之外，用 `bloc_test` 测试。
- [Freezed](https://github.com/rrousselGit/freezed) - 生成不可变状态类、密封联合类型和 `copyWith`，省去状态对象的样板代码。
- [MobX for Dart](https://github.com/mobxjs/mobx.dart) - 借助代码生成提供 observable、action 和 reaction，适合偏好响应式状态的团队。
- [Provider](https://github.com/rrousselGit/provider) - 对 `InheritedWidget` 的一层轻量封装，用于注入 `ChangeNotifier` 模型；Flutter 文档就从它讲起。
- [Riverpod](https://github.com/rrousselGit/riverpod) - 编译期安全的 provider，用于异步状态、缓存和依赖注入，无需 widget 树即可测试。
- [Signals.dart](https://github.com/rodydavis/signals.dart) - 面向 Dart 和 Flutter 的细粒度响应式 signal，只重建读取了变化值的 widget。

### 依赖注入

- [get_it](https://github.com/flutter-it/get_it) - 用于 repository 和服务的 service locator，在 widget 树之外也能访问。

### 导航

- [go_router](https://pub.dev/packages/go_router) - 由 Flutter 团队维护的基于 URL 的声明式路由，支持深层链接、重定向和嵌套 navigator。

### 示例应用

- [Bloc examples](https://github.com/felangel/bloc/tree/master/examples) - 计数器、计时器、登录、待办、无限列表和天气应用，均用 bloc 构建并有测试覆盖。
- [Compass app](https://github.com/flutter/samples/tree/main/compass_app) - 架构指南背后的官方示例，包含单元测试、widget 测试和集成测试。
- [Flutter architecture samples](https://github.com/brianegan/flutter_architecture_samples) - 同一个待办应用分别用 BLoC、Redux、MobX、signal 等实现，方便并排比较各种做法。

### 项目结构与工具

- [Melos](https://github.com/invertase/melos) - 应用拆分为功能包时，在 Dart 工作区中统一运行脚本、管理版本并发布。
- [Very Good CLI](https://github.com/VeryGoodOpenSource/very_good_cli) - 创建分层结构、测试和严格 lint 规则都已配置好的应用与包。

## React Native

### 官方指引

- [About the New Architecture](https://reactnative.dev/architecture/landing-page) - 讲解 Fabric、TurboModules 和 JSI，自 0.76 起新建的 React Native 应用默认采用这套架构。
- [Managing State (React)](https://react.dev/learn/managing-state) - React 自己的指南，讲如何组织状态、把状态提升，以及移入 reducer 和 context。
- [Testing overview](https://reactnative.dev/docs/testing-overview) - 单元测试、组件测试和端到端测试的官方概览，以及各自覆盖应用的哪一层。

### 状态管理与架构库

- [Jotai](https://github.com/pmndrs/jotai) - 原子化状态：用小的 atom 组合，而不是一个全局 store，计算值用派生 atom。
- [Legend-State](https://github.com/LegendApp/legend-state) - 内置持久化的细粒度响应式状态，适合把数据保存在设备上的应用。
- [MobX](https://github.com/mobxjs/mobx) - 自动跟踪依赖的 observable 状态；只有组件读取的内容变化时才会重新渲染。
- [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) - 编写 Redux 的官方方式：slice、写成赋值形式的不可变更新，以及用于服务端数据的 RTK Query。
- [TanStack Query](https://github.com/TanStack/query) - 把服务端数据放在独立的一层，提供缓存、重新获取和重试，与 UI 状态分开。
- [XState](https://github.com/statelyai/xstate) - 适用于状态和转换很多的流程（如结账或新手引导）的状态机和 statechart。
- [Zustand](https://github.com/pmndrs/zustand) - 无需 provider 的小型 hook 式 store；selector 让重新渲染只限于发生变化的部分。

### 导航

- [Expo Router](https://docs.expo.dev/router/introduction/) - 面向 Expo 和 React Native 应用的基于文件的路由，每个页面都有 URL，深层链接即开即用。
- [React Navigation](https://github.com/react-navigation/react-navigation) - React Native 的 stack、tab 和 drawer navigator；Expo Router 构建在它之上。

### 示例应用

- [Ignite](https://github.com/infinitered/ignite) - Infinite Red 的样板和生成器：包含状态、导航和测试的完整应用结构。
- [Obytes React Native template](https://github.com/obytes/react-native-template-obytes) - Expo 和 TypeScript 起步模板，Expo Router、React Query、表单处理和 CI 已接好。

### 测试

- [React Native Testing Library](https://github.com/callstack/react-native-testing-library) - 以用户找到组件的方式查询组件，因此重构屏幕背后的代码时测试依然有效。

<!-- list:end -->

## 条目的选取标准

条目被收录，是因为它有助于组织应用结构且有人读过，而不是因为它流行。它需要满足：

- 是官方来源，或是用可运行代码展示某种模式的库、示例或文章；
- 若是 GitHub 仓库：未归档，且过去 540 天内有过 push；
- 用平实的话写出读者能得到什么的一句话理由。

之后不再满足这些规则的条目会被移除或替换。已知缺口：仅限 Android 以及 Kotlin Multiplatform 的内容不在范围内，付费课程不收录。

## 指南

- [为移动应用选择架构](docs/guides/choosing-an-architecture.md)
- [iOS 27 SDK 与 UIScene 生命周期](docs/guides/ios-27-scene-life-cycle.md)
- [如何让列表保持最新](docs/guides/keeping-the-list-current.md)

## 参与贡献

欢迎提出建议。把条目添加到 [data/entries.json](data/entries.json)，运行 `npm ci && npm run list:render && npm test`，然后发起 pull request；[贡献指南](CONTRIBUTING.md)列出了检查器应用的规则。

## 许可证

[MIT](LICENSE)。所链接的内容归其作者所有，沿用各自的许可证。
