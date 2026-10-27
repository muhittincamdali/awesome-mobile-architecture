<!-- i18n-source: README.md@d993da6c400c808eb254c759491df673edfbf5ad status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/banner-light.svg" alt="Mobile Architecture: Checked links on app architecture for iOS, Flutter and React Native, each with the reason to read it."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/awesome-mobile-architecture/actions/workflows/ci.yml/badge.svg" alt="État de la CI"></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-version-light.svg" alt="Dernière version: v1.0.0"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-language-light.svg" alt="Version du langage: Node.js 24+"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/badge-license-light.svg" alt="Licence: MIT"></picture></a>
</p>

<p align="center">
<a href="#démarrage-rapide"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-start-fr-light.svg" alt="Commencer"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-guides-fr-light.svg" alt="Guides"></picture></a>
<a href="https://github.com/muhittincamdali/awesome-mobile-architecture/tree/main/Examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/awesome-mobile-architecture/main/.github/brand/button-examples-fr-light.svg" alt="Exemples"></picture></a>
</p>

> Ceci est une traduction du README anglais. En cas de différence, la version anglaise fait foi.

<!-- brand:end -->

Des liens sur la façon de structurer une application iOS, Flutter ou React Native : d’abord les recommandations officielles, puis les bibliothèques, applications d’exemple et outils qui les mettent en pratique. Chaque entrée a été ouverte et lue par une personne et s’accompagne d’une ligne qui dit ce qu’on en retire. Une tâche hebdomadaire signale tout dépôt listé qui est archivé, renommé ou sans mise à jour depuis 540 jours, ainsi que tout lien qui ne répond plus, pour que la liste ne se dégrade pas en silence.

## Points forts

- **Trois plateformes, une structure** — des sections iOS, Flutter et React Native avec les mêmes catégories, plus les articles indépendants de la plateforme dont viennent les patterns.
- **Une raison pour chaque lien** — chaque entrée a un « pourquoi » d’une ligne ; le vérificateur rejette les mots de marketing comme « meilleur ».
- **Vérifié, pas simplement collecté** — les entrées se trouvent dans [data/entries.json](data/entries.json), sont validées à chaque push et intégrées à ce README ; l’activité GitHub et l’état des liens sont contrôlés chaque semaine ([comment](docs/guides/keeping-the-list-current.md)).
- **La même fonctionnalité dans trois stacks** — un [exemple de liste de lecture](Examples/README.md) en SwiftUI, Flutter et React Native, avec 43 tests qui vérifient les mêmes règles sur chaque plateforme.
- **Changements récents des plateformes** — un [guide sur l’exigence du cycle de vie des scènes d’iOS 27](docs/guides/ios-27-scene-life-cycle.md) pour les applications natives, Flutter et React Native.

## Démarrage rapide

**1. Choisissez votre plateforme.** Allez à [iOS](#ios), [Flutter](#flutter) ou [React Native](#react-native). Lisez d’abord les entrées *Recommandations officielles* ; les bibliothèques en dessous reprennent ces idées.

**2. Lancez l’exemple de votre stack.** C’est la plus petite version fonctionnelle de la structure que décrivent les guides :

```sh
git clone https://github.com/muhittincamdali/awesome-mobile-architecture.git
cd awesome-mobile-architecture/Examples/flutter/reading_list   # or ios/ReadingList, react-native/reading-list
flutter test                                                  # swift test, or npm ci && npm test
```

**3. Décidez de la quantité de structure dont vous avez besoin.** [Choisir une architecture](docs/guides/choosing-an-architecture.md) met en regard les idées communes aux trois plateformes et indique à partir de quand une bibliothèque comme TCA, Bloc ou Redux Toolkit devient rentable.

<p align="center">
<img src="docs/images/reading-list-ios-loaded-light.png" width="240" alt="L’exemple de liste de lecture iOS avec cinq articles, le premier marqué comme lu">
<img src="docs/images/reading-list-ios-loaded-dark.png" width="240" alt="Le même écran en mode sombre">
</p>

<!-- list:start -->

## Sommaire

- [Concepts valables partout](#concepts-valables-partout) (4)
- [iOS](#ios) (20)
- [Flutter](#flutter) (18)
- [React Native](#react-native) (15)

57 entrées. Chacune a été ouverte et vérifiée à la main ; la vérification la plus récente date du 2026-10-28.

## Concepts valables partout

### Recommandations officielles

- [Guide to app architecture (Android)](https://developer.android.com/topic/architecture) - Le guide de Google sur la couche UI, la couche de données et le flux de données unidirectionnel ; la même séparation est utilisée sur iOS, Flutter et React Native.
- [Presentation Model](https://martinfowler.com/eaaDev/PresentationModel.html) - Le pattern dont MVVM est issu : l’état et le comportement de la vue regroupés dans une classe que l’on peut tester sans interface.
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - L’article d’origine sur la règle de dépendance entre les couches, sur lequel s’appuient la plupart des modèles mobiles de clean architecture.
- [The Elm Architecture](https://guide.elm-lang.org/architecture/) - Model, update, view : la boucle unidirectionnelle derrière TCA, Redux et BLoC, expliquée en quelques pages courtes.

## iOS

### Recommandations officielles

- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/) - Session de la WWDC23 sur la façon dont Observation suit les propriétés lues par une vue, base des view models SwiftUI actuels.
- [Managing model data in your app](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) - Le tutoriel d’Apple sur les modèles `@Observable` et sur la manière d’en détenir la propriété avec `@State`, `@Environment` et `@Bindable`.
- [Migrating to the Observable macro](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro) - Les modifications exactes pour passer un view model `ObservableObject` à `@Observable`, et ce qui change dans la mise à jour des vues.
- [Swift 6 migration guide](https://www.swift.org/migration/documentation/migrationguide/) - Sécurité face aux data races, `Sendable` et isolation des actors, pas à pas : les règles que toute architecture Swift 6 doit respecter.
- [TN3187 UIKit scene-based life cycle](https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle) - La note technique d’Apple pour faire passer une application reposant uniquement sur un app delegate à `UIScene`, que les applications compilées avec le SDK iOS 27 doivent adopter.

### Bibliothèques d’état et d’architecture

- [Swift Async Algorithms](https://github.com/apple/swift-async-algorithms) - Debounce, throttle, merge et d’autres opérateurs `AsyncSequence` qui remplacent les pipelines Combine dans les view models.
- [Swift Sharing](https://github.com/pointfreeco/swift-sharing) - Partage et conserve l’état entre fonctionnalités (user defaults, fichiers, mémoire) grâce à un seul property wrapper.
- [The Composable Architecture](https://github.com/pointfreeco/swift-composable-architecture) - Reducers, effects et dépendances dans une seule bibliothèque, avec un test store qui vérifie chaque changement d’état.
- [Workflow (Swift)](https://github.com/square/workflow-swift) - Les machines à états composables de Square qui produisent l’interface, avec une bibliothèque Kotlin équivalente pour l’application Android.

### Injection de dépendances

- [Factory](https://github.com/hmlongco/Factory) - Injection par conteneur avec des enregistrements vérifiés à la compilation et des remplacements par test, sans génération de code.
- [Needle](https://github.com/uber/needle) - Le graphe de dépendances d’Uber, vérifié à la compilation et généré à partir du code, conçu pour les applications à nombreux modules.
- [Swift Dependencies](https://github.com/pointfreeco/swift-dependencies) - Injection de dépendances de type environment qui fonctionne aussi hors des vues et substitue des valeurs de test pour chaque test.
- [Swinject](https://github.com/Swinject/Swinject) - Conteneur d’exécution avec portées d’objets, courant dans les bases de code UIKit qui résolvent les dépendances au démarrage.

### Navigation

- [Swift Navigation](https://github.com/pointfreeco/swift-navigation) - Navigation pilotée par l’état pour SwiftUI, UIKit et AppKit : une destination est un optional ou un cas d’enum dans le modèle.
- [XCoordinator](https://github.com/QuickBirdEng/XCoordinator) - Pattern Coordinator pour UIKit avec des routes typées, pour que les view controllers ne se poussent plus les uns les autres.

### Applications d’exemple

- [Clean Architecture for SwiftUI](https://github.com/nalexn/clean-architecture-swiftui) - Application SwiftUI avec persistance SwiftData, réseau, injection de dépendances et tests unitaires dans des couches séparées.
- [iOS Clean Architecture MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM) - Modèle UIKit avec conteneur de DI, coordinators de flux, mapping de DTO et mise en cache des réponses à travers les couches.
- [TCA example apps](https://github.com/pointfreeco/swift-composable-architecture/tree/main/Examples) - Des études de cas ainsi que les applications Todos, Voice Memos, SyncUps et Search, maintenues en phase avec chaque version de la bibliothèque.

### Tests

- [SnapshotTesting](https://github.com/pointfreeco/swift-snapshot-testing) - Enregistre des vues et des valeurs comme fichiers de référence et échoue en cas de changement, ce qui détecte les régressions d’interface que les tests unitaires manquent.

### Structure du projet et outillage

- [Tuist](https://github.com/tuist/tuist) - Génère des projets Xcode à partir de manifestes Swift, ce qui garde les frontières des modules explicites à mesure que l’application grandit.

## Flutter

### Recommandations officielles

- [Architecture case study](https://docs.flutter.dev/app-architecture/case-study) - Parcourt l’application Compass pour montrer le guide appliqué à du code réel, couche par couche.
- [Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations) - Chaque recommandation est notée fortement recommandée, recommandée ou conditionnelle, pour que vous sachiez ce qui est facultatif.
- [Guide to app architecture (Flutter)](https://docs.flutter.dev/app-architecture/guide) - Les couches recommandées par l’équipe Flutter (UI, données, domaine facultatif), construites avec des vues, des view models et des repositories.
- [State management options](https://docs.flutter.dev/data-and-backend/state-mgmt/options) - L’index officiel des approches de gestion d’état, avec des liens vers la documentation de chaque package.
- [UIScene adoption](https://docs.flutter.dev/release/breaking-changes/uiscenedelegate) - Ce qui change pour le runner iOS d’une application Flutter quand `UIScene` devient obligatoire, et comment le migrer.

### Bibliothèques d’état et d’architecture

- [Bloc](https://github.com/felangel/bloc) - Des événements en entrée, des états en sortie : la logique métier reste hors des widgets et se teste avec `bloc_test`.
- [Freezed](https://github.com/rrousselGit/freezed) - Génère des classes d’état immuables, des unions scellées et `copyWith`, et supprime le code répétitif des objets d’état.
- [MobX for Dart](https://github.com/mobxjs/mobx.dart) - Observables, actions et reactions avec génération de code, pour les équipes qui préfèrent l’état réactif.
- [Provider](https://github.com/rrousselGit/provider) - Une fine couche au-dessus d’`InheritedWidget` pour injecter des modèles `ChangeNotifier` ; la documentation Flutter commence par elle.
- [Riverpod](https://github.com/rrousselGit/riverpod) - Des providers sûrs à la compilation pour l’état asynchrone, le cache et l’injection de dépendances, testables sans arbre de widgets.
- [Signals.dart](https://github.com/rodydavis/signals.dart) - Des signals réactifs à grain fin pour Dart et Flutter, qui ne reconstruisent que les widgets lisant une valeur modifiée.

### Injection de dépendances

- [get_it](https://github.com/flutter-it/get_it) - Service locator pour les repositories et les services, accessible aussi en dehors de l’arbre de widgets.

### Navigation

- [go_router](https://pub.dev/packages/go_router) - Routage déclaratif basé sur les URL, maintenu par l’équipe Flutter, avec deep links, redirections et navigators imbriqués.

### Applications d’exemple

- [Bloc examples](https://github.com/felangel/bloc/tree/master/examples) - Applications compteur, minuteur, connexion, todo, liste infinie et météo, chacune construite avec bloc et couverte par des tests.
- [Compass app](https://github.com/flutter/samples/tree/main/compass_app) - L’exemple officiel derrière le guide d’architecture, avec des tests unitaires, de widgets et d’intégration.
- [Flutter architecture samples](https://github.com/brianegan/flutter_architecture_samples) - Une même application todo construite avec BLoC, Redux, MobX, signals et d’autres, pour comparer les approches côte à côte.

### Structure du projet et outillage

- [Melos](https://github.com/invertase/melos) - Exécute scripts, versionnement et publication dans un workspace Dart lorsqu’une application est découpée en packages de fonctionnalités.
- [Very Good CLI](https://github.com/VeryGoodOpenSource/very_good_cli) - Crée des applications et des packages avec une structure en couches, des tests et des lints stricts déjà configurés.

## React Native

### Recommandations officielles

- [About the New Architecture](https://reactnative.dev/architecture/landing-page) - Explique Fabric, TurboModules et JSI, l’architecture que les nouvelles applications React Native utilisent par défaut depuis la 0.76.
- [Managing State (React)](https://react.dev/learn/managing-state) - Le guide de React lui-même pour structurer l’état, le faire remonter et le déplacer vers des reducers et un contexte.
- [Testing overview](https://reactnative.dev/docs/testing-overview) - La carte officielle des tests unitaires, de composants et de bout en bout, et de la couche de l’application que chacun couvre.

### Bibliothèques d’état et d’architecture

- [Jotai](https://github.com/pmndrs/jotai) - État atomique : composez de petits atoms plutôt qu’un store global unique, avec des atoms dérivés pour les valeurs calculées.
- [Legend-State](https://github.com/LegendApp/legend-state) - État réactif à grain fin avec persistance intégrée, pour les applications qui conservent leurs données sur l’appareil.
- [MobX](https://github.com/mobxjs/mobx) - État observable avec suivi automatique des dépendances ; un composant ne se rend à nouveau que lorsque ce qu’il a lu change.
- [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) - La manière officielle d’écrire du Redux : slices, mises à jour immuables écrites comme des mutations et RTK Query pour les données serveur.
- [TanStack Query](https://github.com/TanStack/query) - Garde les données serveur dans leur propre couche, avec cache, rechargement et nouvelles tentatives, séparée de l’état de l’interface.
- [XState](https://github.com/statelyai/xstate) - Machines à états et statecharts pour les parcours comportant beaucoup d’états et de transitions, comme le paiement ou l’onboarding.
- [Zustand](https://github.com/pmndrs/zustand) - Un petit store basé sur des hooks qui n’a pas besoin de provider ; les selectors limitent les nouveaux rendus à ce qui a changé.

### Navigation

- [Expo Router](https://docs.expo.dev/router/introduction/) - Routage basé sur les fichiers pour les applications Expo et React Native, où chaque écran reçoit une URL et où les deep links fonctionnent.
- [React Navigation](https://github.com/react-navigation/react-navigation) - Navigators stack, tab et drawer pour React Native ; Expo Router est construit dessus.

### Applications d’exemple

- [Ignite](https://github.com/infinitered/ignite) - Le boilerplate et les générateurs d’Infinite Red : une structure d’application complète avec état, navigation et tests.
- [Obytes React Native template](https://github.com/obytes/react-native-template-obytes) - Modèle de départ Expo et TypeScript avec Expo Router, React Query, gestion des formulaires et CI déjà câblés ensemble.

### Tests

- [React Native Testing Library](https://github.com/callstack/react-native-testing-library) - Interroge les composants comme le fait un utilisateur pour les trouver, si bien que les tests résistent aux refactorisations du code derrière un écran.

<!-- list:end -->

## Comment les entrées sont choisies

Une entrée est ajoutée lorsqu’elle aide à structurer une application et qu’une personne l’a lue, pas parce qu’elle est populaire. Il lui faut :

- une source officielle, ou une bibliothèque, un exemple ou un article qui montre un pattern dans du code fonctionnel ;
- pour un dépôt GitHub : ne pas être archivé et avoir reçu un push au cours des 540 derniers jours ;
- une raison d’une ligne qui dit, en termes simples, ce que le lecteur en retire.

Les entrées qui ne respectent plus ces règles par la suite sont retirées ou remplacées. Lacunes connues : le contenu limité à Android et à Kotlin Multiplatform est hors du périmètre, et les cours payants ne sont pas listés.

## Guides

- [Choisir une architecture pour une application mobile](docs/guides/choosing-an-architecture.md)
- [Le SDK iOS 27 et le cycle de vie UIScene](docs/guides/ios-27-scene-life-cycle.md)
- [Comment la liste est tenue à jour](docs/guides/keeping-the-list-current.md)

## Contribuer

Les suggestions sont les bienvenues. Ajoutez l’entrée à [data/entries.json](data/entries.json), lancez `npm ci && npm run list:render && npm test` et ouvrez une pull request ; le [guide de contribution](CONTRIBUTING.md) liste les règles appliquées par le vérificateur.

## Licence

[MIT](LICENSE). Le contenu référencé appartient à ses auteurs et conserve sa propre licence.
