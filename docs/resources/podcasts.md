# Mobile Architecture Podcasts & Audio Resources

> A curated collection of podcasts, conference talks, and audio content focused on mobile app architecture, design patterns, and engineering best practices.

---

## Table of Contents

- [iOS Focused Podcasts](#ios-focused-podcasts)
- [Android Focused Podcasts](#android-focused-podcasts)
- [Cross-Platform & General](#cross-platform--general)
- [Conference Talks (Audio)](#conference-talks-audio)
- [Architecture Deep Dives](#architecture-deep-dives)
- [Interview Series](#interview-series)
- [Learning Resources](#learning-resources)
- [Community Shows](#community-shows)
- [Archived / Completed Series](#archived--completed-series)
- [How to Contribute](#how-to-contribute)

---

## iOS Focused Podcasts

### Swift by Sundell

**Host:** John Sundell  
**Website:** [swiftbysundell.com/podcast](https://swiftbysundell.com/podcast)  
**Frequency:** Weekly  
**Episode Length:** 45-60 minutes

One of the most respected voices in the Swift community. John interviews prominent iOS developers and discusses architecture patterns, testing strategies, and Swift language features.

**Notable Architecture Episodes:**

| Episode | Topic | Guest |
|---------|-------|-------|
| #98 | Modular Architecture at Scale | Krzysztof Zabłocki |
| #87 | The Composable Architecture | Brandon Williams & Stephen Celis |
| #76 | Clean Architecture in Swift | Robert C. Martin |
| #65 | Dependency Injection Patterns | Shai Mishali |
| #54 | Protocol-Oriented Programming | Dave Abrahams |
| #42 | MVVM vs MVC Debate | Ash Furrow |
| #31 | Testing Architecture | Jon Reid |
| #23 | Redux in Swift | Benjamin Encz |

**Key Takeaways:**
- Focus on practical, real-world architecture decisions
- Emphasis on testability and maintainability
- Regular discussion of Swift evolution and its impact on architecture

---

### Stacktrace

**Hosts:** John Sundell & Gui Rambo  
**Website:** [stacktracepodcast.fm](https://stacktracepodcast.fm)  
**Frequency:** Weekly  
**Episode Length:** 60-90 minutes

A conversational podcast covering Apple development, with frequent discussions about app architecture, SwiftUI adoption, and framework design.

**Architecture-Relevant Episodes:**

| Episode | Topic | Key Points |
|---------|-------|------------|
| #187 | SwiftUI Architecture Patterns | State management, view composition |
| #165 | Migrating from UIKit | Incremental adoption strategies |
| #143 | Combine in Production | Reactive patterns, error handling |
| #121 | Multi-Module Projects | Build time optimization, code isolation |
| #98 | Testing Philosophy | Unit vs integration, mocking strategies |

---

### iOS Dev Discussions

**Host:** Sean Allen  
**Website:** [youtube.com/seanallen](https://www.youtube.com/seanallen)  
**Frequency:** 2-3 times per week  
**Episode Length:** 15-45 minutes

Practical iOS development content with a focus on real-world application. Sean covers architecture patterns through concrete examples.

**Architecture Playlist:**

1. MVC Done Right - 45 min
2. MVVM from Scratch - 60 min
3. Coordinator Pattern Deep Dive - 38 min
4. Repository Pattern in Swift - 42 min
5. Clean Architecture Implementation - 55 min
6. Dependency Injection Without Frameworks - 35 min
7. Protocol-Oriented Services - 40 min
8. Navigation Architecture - 48 min

**Learning Path Recommendation:**
```
Beginner → MVC Done Right → MVVM from Scratch
Intermediate → Coordinator Pattern → Repository Pattern
Advanced → Clean Architecture → Protocol-Oriented Services
```

---

### Empower Apps

**Host:** Leo Dion  
**Website:** [empowerapps.show](https://empowerapps.show)  
**Frequency:** Bi-weekly  
**Episode Length:** 45-75 minutes

Focuses on the business and technical aspects of app development, with regular architecture discussions.

**Architecture Episodes:**

| # | Title | Description |
|---|-------|-------------|
| 156 | Scaling Your Codebase | When to refactor, when to rewrite |
| 142 | Plugin Architecture | Extensibility patterns |
| 128 | Feature Flags in Practice | Architecture for experimentation |
| 115 | Offline-First Design | Sync strategies, conflict resolution |
| 101 | Analytics Architecture | Decoupling tracking from business logic |

---

### Swift over Coffee

**Hosts:** Paul Hudson & Erica Sadun  
**Website:** [swiftovercoffee.com](https://anchor.fm/swiftovercoffee)  
**Frequency:** Weekly  
**Episode Length:** 30-45 minutes

Casual discussions about Swift development, often touching on architectural decisions and best practices.

**Recommended Episodes:**

- Episode 78: "When MVVM Goes Wrong"
- Episode 65: "The State of SwiftUI Architecture"
- Episode 52: "Dependency Hell and How to Escape"
- Episode 41: "Modular Monoliths"
- Episode 33: "Testing Strategies That Work"

---

### Launched

**Host:** Charlie Chapman  
**Website:** [launchedfm.com](https://launchedfm.com)  
**Frequency:** Weekly  
**Episode Length:** 30-45 minutes

Interviews with indie developers about their apps, often discussing architectural decisions and trade-offs.

**Architecture Highlights:**

| App | Developer | Architecture Discussed |
|-----|-----------|----------------------|
| Things | Cultured Code | Custom sync engine |
| Carrot Weather | Brian Mueller | Widget architecture |
| Apollo | Christian Selig | Offline caching |
| Halide | Sebastiaan de With | Camera pipeline |
| Drafts | Greg Pierce | Action system design |

---

## Android Focused Podcasts

### Android Developers Backstage

**Hosts:** Chet Haase, Romain Guy, Tor Norbye  
**Website:** [androidbackstage.blogspot.com](http://androidbackstage.blogspot.com)  
**Frequency:** Bi-weekly  
**Episode Length:** 45-90 minutes

Official Google podcast with deep technical discussions about Android architecture and framework design.

**Essential Architecture Episodes:**

| Episode | Title | Topics Covered |
|---------|-------|----------------|
| #189 | Architecture Components | ViewModel, LiveData design decisions |
| #176 | Jetpack Compose Internals | Composition, recomposition |
| #165 | Navigation Component | Graph-based navigation |
| #152 | Room Database | Schema migrations, relations |
| #141 | Kotlin Coroutines | Structured concurrency |
| #128 | WorkManager | Background task architecture |
| #115 | Dagger & Hilt | DI framework evolution |
| #102 | Data Binding | Two-way binding internals |

**Why Listen:**
- Direct insights from framework designers
- Understanding the "why" behind architecture decisions
- Early access to upcoming features

---

### Fragmented

**Hosts:** Donn Felker & Kaushik Gopal  
**Website:** [fragmentedpodcast.com](https://fragmentedpodcast.com)  
**Frequency:** Weekly  
**Episode Length:** 30-60 minutes

Practical Android development discussions with strong focus on architecture and testing.

**Architecture Series:**

**Clean Architecture Track:**
1. Episode 142: Introduction to Clean Architecture
2. Episode 143: Use Cases and Interactors
3. Episode 144: Repository Pattern Deep Dive
4. Episode 145: Presentation Layer Options
5. Episode 146: Error Handling Strategies
6. Episode 147: Testing Clean Architecture

**MVVM Track:**
1. Episode 121: MVVM Fundamentals
2. Episode 122: LiveData vs StateFlow
3. Episode 123: ViewModel Testing
4. Episode 124: Navigation with MVVM
5. Episode 125: Common MVVM Mistakes

**MVI Track:**
1. Episode 156: Introduction to MVI
2. Episode 157: State Machines in Practice
3. Episode 158: Side Effects and Intents
4. Episode 159: MVI Libraries Comparison
5. Episode 160: Scaling MVI

---

### The Context

**Hosts:** Artur Dryomov & Hannes Dorfmann  
**Website:** [github.com/nickolay-borzov/the-context-podcast](https://github.com/nickolay-borzov/the-context-podcast)  
**Frequency:** Monthly  
**Episode Length:** 60-90 minutes

Deep technical discussions with industry experts about Android architecture.

**Notable Episodes:**

| # | Guest | Topic |
|---|-------|-------|
| 12 | Jake Wharton | Retrofit and API Architecture |
| 10 | Chris Banes | Architecture at Tivi |
| 8 | Florina Muntenescu | Android Architecture Components |
| 6 | Jesse Wilson | Okio and Efficient I/O |
| 4 | Gabor Varadi | Simple-Stack Navigation |

---

### Talking Kotlin

**Host:** Hadi Hariri  
**Website:** [talkingkotlin.com](https://talkingkotlin.com)  
**Frequency:** Bi-weekly  
**Episode Length:** 45-60 minutes

Official Kotlin podcast with architecture discussions relevant to Android development.

**Architecture Episodes:**

- "Kotlin Multiplatform Architecture" - Episode 98
- "Coroutines in Production" - Episode 87
- "State Management with Kotlin" - Episode 76
- "Functional Architecture Patterns" - Episode 65
- "DSLs for Configuration" - Episode 54

---

### Android Leaks

**Host:** The Android Team  
**Website:** [androidleakspodcast.com](https://androidleakspodcast.com)  
**Frequency:** Weekly  
**Episode Length:** 30-45 minutes

Short, focused episodes on specific Android topics.

**Architecture Mini-Series:**

```
Week 1: Single Activity Architecture
Week 2: Fragment vs Compose Navigation
Week 3: ViewModel Scoping
Week 4: Repository Implementation
Week 5: Caching Strategies
Week 6: Offline-First Patterns
Week 7: Testing Architecture
Week 8: Modularization
```

---

## Cross-Platform & General

### Software Engineering Radio

**Website:** [se-radio.net](https://www.se-radio.net)  
**Frequency:** Weekly  
**Episode Length:** 60 minutes

Long-running podcast covering software engineering topics, including mobile architecture.

**Mobile Architecture Episodes:**

| Episode | Title | Relevance |
|---------|-------|-----------|
| #512 | Mobile App Architecture | Overview of patterns |
| #478 | Event-Driven Systems | Applicable to mobile |
| #445 | Domain-Driven Design | Mobile DDD patterns |
| #412 | Testing Strategies | Cross-platform testing |
| #378 | Microservices | Backend for mobile |
| #345 | Clean Code | Universal principles |

---

### The Changelog

**Website:** [changelog.com/podcast](https://changelog.com/podcast)  
**Frequency:** Weekly  
**Episode Length:** 60-90 minutes

General programming podcast with occasional mobile architecture discussions.

**Recommended Episodes:**

- "Flutter Architecture" - Episode 456
- "React Native at Scale" - Episode 423
- "Cross-Platform Development" - Episode 398
- "Mobile DevOps" - Episode 367
- "App Performance" - Episode 334

---

### CoRecursive

**Host:** Adam Gordon Bell  
**Website:** [corecursive.com](https://corecursive.com)  
**Frequency:** Monthly  
**Episode Length:** 60 minutes

Software engineering stories with deep technical content.

**Relevant Episodes:**

| Title | Topic | Mobile Relevance |
|-------|-------|------------------|
| "Building SQLite" | Database internals | Mobile storage |
| "Git Internals" | Version control | Code architecture |
| "The Art of Code Review" | Team practices | Code quality |
| "Functional Programming" | FP patterns | SwiftUI, Compose |

---

### Maintainable

**Host:** Robby Russell  
**Website:** [maintainable.fm](https://maintainable.fm)  
**Frequency:** Weekly  
**Episode Length:** 30-45 minutes

Focus on maintainable software, relevant to mobile architecture decisions.

**Key Episodes:**

1. "Technical Debt in Mobile Apps"
2. "Refactoring Legacy Code"
3. "Documentation That Works"
4. "Testing for Maintainability"
5. "Code Review Best Practices"

---

## Conference Talks (Audio)

### WWDC Sessions

**Source:** Apple Developer  
**Available:** Podcasts app, Apple Developer app

**Architecture-Focused Sessions:**

| Year | Session | Topic |
|------|---------|-------|
| 2023 | 10166 | Swift macros for architecture |
| 2023 | 10148 | Observation framework |
| 2022 | 110354 | Swift concurrency patterns |
| 2022 | 110352 | Navigation in SwiftUI |
| 2021 | 10134 | Swift 5.5 async/await |
| 2021 | 10062 | AR architecture |
| 2020 | 10041 | App Clips architecture |
| 2020 | 10037 | Modern cell configuration |
| 2019 | 226 | Data Flow in SwiftUI |
| 2019 | 231 | Combine in Practice |

---

### Droidcon Talks

**Source:** [droidcon.com](https://www.droidcon.com)  
**Available:** YouTube (audio extractable)

**Top Architecture Talks:**

| Talk | Speaker | Conference |
|------|---------|------------|
| "MVI in the Real World" | Hannes Dorfmann | Berlin 2022 |
| "Navigation Architecture" | Ian Lake | SF 2022 |
| "Compose Architecture" | Adam Powell | NYC 2022 |
| "Multi-Module Apps" | Jeroen Mols | London 2021 |
| "Testing Strategies" | Sam Edwards | Berlin 2021 |

---

### try! Swift

**Source:** [tryswift.co](https://www.tryswift.co)  
**Available:** YouTube, Realm Academy

**Notable Talks:**

| Title | Speaker | Year |
|-------|---------|------|
| "Protocol-Oriented Architecture" | Natasha Murashev | 2019 |
| "Reactive Swift" | Ash Furrow | 2018 |
| "Swift Dependency Injection" | Shai Mishali | 2020 |
| "Modular iOS" | Pedro Piñera | 2021 |
| "The Composable Architecture" | Brandon Williams | 2022 |

---

### Swift Heroes

**Source:** [swiftheroes.com](https://swiftheroes.com)  
**Available:** YouTube

**Architecture Sessions:**

1. "Building Apps at Scale" - 2022
2. "SwiftUI in Production" - 2022
3. "Clean Architecture Workshop" - 2021
4. "MVVM vs TCA" - 2021
5. "Testing Best Practices" - 2020

---

## Architecture Deep Dives

### Point-Free

**Hosts:** Brandon Williams & Stephen Celis  
**Website:** [pointfree.co](https://www.pointfree.co)  
**Format:** Video + Audio (subscribers)  
**Episode Length:** 30-60 minutes

The definitive resource for functional programming in Swift and The Composable Architecture.

**Architecture Series:**

**Composable Architecture:**
```
Episodes 1-10: Foundation
├── Episode 1: Introduction to Reducers
├── Episode 2: State Management
├── Episode 3: Testing Reducers
├── Episode 4: Higher-Order Reducers
├── Episode 5: Modularity
├── Episode 6: Side Effects
├── Episode 7: Dependency Management
├── Episode 8: Navigation
├── Episode 9: Alerts and Sheets
└── Episode 10: Focus State

Episodes 11-20: Advanced
├── Episode 11: Testing Async Code
├── Episode 12: Timer-Based Features
├── Episode 13: Scoping State
├── Episode 14: Shared State
├── Episode 15: Performance
├── Episode 16: Debugging
├── Episode 17: Stack Navigation
├── Episode 18: Tree-Based Navigation
├── Episode 19: Integration Testing
└── Episode 20: Production Patterns
```

**Parsing Series:**
- Episode 100-115: Parser combinators
- Relevant for input validation architecture

**Dependencies Series:**
- Episode 150-160: Dependency injection patterns
- Environment-based architecture

---

### NSScreencast

**Host:** Ben Scheirman  
**Website:** [nsscreencast.com](https://nsscreencast.com)  
**Format:** Video + Audio  
**Episode Length:** 15-30 minutes

Practical iOS development screencasts.

**Architecture Courses:**

| Course | Episodes | Topics |
|--------|----------|--------|
| MVVM | 12 | View models, binding, testing |
| Clean Architecture | 8 | Use cases, boundaries |
| Coordinator Pattern | 6 | Navigation, deep linking |
| Dependency Injection | 10 | Swinject, DIY approaches |
| Testing | 15 | Unit, UI, snapshot testing |

---

### Kodeco (formerly Ray Wenderlich)

**Website:** [kodeco.com/podcast](https://www.kodeco.com/podcast)  
**Frequency:** Weekly  
**Episode Length:** 30-45 minutes

Accessible content for all skill levels.

**Architecture Content:**

**Beginner Path:**
1. "Understanding MVC"
2. "Your First MVVM App"
3. "Introduction to Protocols"
4. "Basic Testing"

**Intermediate Path:**
1. "Clean Architecture Basics"
2. "Coordinator Pattern"
3. "Repository Pattern"
4. "Advanced Testing"

**Advanced Path:**
1. "VIPER Implementation"
2. "Modular Architecture"
3. "RIBs Architecture"
4. "Custom Architectures"

---

## Interview Series

### Under the Radar

**Hosts:** Marco Arment & David Smith  
**Website:** [relay.fm/radar](https://www.relay.fm/radar)  
**Frequency:** Weekly  
**Episode Length:** 30 minutes (strict)

Indie developer discussions, often covering architectural decisions.

**Architecture Episodes:**

| # | Title | Key Points |
|---|-------|------------|
| 234 | "Rewriting Overcast" | Migration strategy |
| 212 | "Widget Architecture" | Timeline updates |
| 198 | "Sync Engine Design" | Conflict resolution |
| 185 | "Watch App Patterns" | Companion architecture |
| 172 | "Background Processing" | Task scheduling |

---

### App Story

**Hosts:** Indie Developers  
**Website:** [appstory.fm](https://appstory.fm)  
**Frequency:** Bi-weekly

Deep dives into specific apps and their architecture.

**Featured Apps:**

| App | Architecture Focus |
|-----|-------------------|
| Fantastical | Parser architecture |
| Pcalc | State management |
| Working Copy | Git implementation |
| Procreate | Canvas rendering |
| Bear | Sync and encryption |

---

## Learning Resources

### Essential Listening Order

**For iOS Developers:**

```
1. Swift by Sundell: #87 (TCA Introduction)
2. Point-Free: Episodes 1-10 (TCA Foundation)
3. iOS Dev Discussions: Clean Architecture
4. NSScreencast: MVVM Course
5. Under the Radar: Architecture episodes
```

**For Android Developers:**

```
1. Android Backstage: #189 (Architecture Components)
2. Fragmented: Clean Architecture Series
3. The Context: Episode 10 (Tivi Architecture)
4. Talking Kotlin: Coroutines in Production
5. Droidcon: MVI in the Real World
```

**For Cross-Platform:**

```
1. Software Engineering Radio: #512 (Mobile Architecture)
2. The Changelog: Cross-Platform Development
3. Maintainable: Technical Debt in Mobile
4. CoRecursive: Building SQLite
```

---

### Podcast Playlist: Architecture Learning Path

**Week 1-2: Foundations**
- [ ] SE Radio #512: Mobile App Architecture
- [ ] Swift by Sundell #42: MVC vs MVVM
- [ ] Fragmented #121: MVVM Fundamentals
- [ ] iOS Dev Discussions: MVC Done Right

**Week 3-4: Intermediate Patterns**
- [ ] Point-Free Episodes 1-5
- [ ] Fragmented Clean Architecture Series
- [ ] NSScreencast: Coordinator Pattern
- [ ] Android Backstage #189

**Week 5-6: Advanced Topics**
- [ ] Swift by Sundell #87: TCA
- [ ] The Context #10: Tivi Architecture
- [ ] Point-Free Episodes 6-10
- [ ] Fragmented MVI Series

**Week 7-8: Real-World Applications**
- [ ] Under the Radar Architecture Episodes
- [ ] App Story: Featured Apps
- [ ] Conference Talks Selection
- [ ] Maintainable: Refactoring Episodes

---

## Community Shows

### iOS Coffee Break

**Format:** Short-form daily content  
**Platform:** Spotify, Apple Podcasts  
**Episode Length:** 5-15 minutes

Quick tips and patterns for iOS development.

**Architecture Quick Tips:**
- "SOLID in 5 Minutes"
- "When to Use Singletons"
- "Protocol Extensions for Architecture"
- "Testing Quick Wins"

---

### Hacking with Swift Live

**Host:** Paul Hudson  
**Platform:** YouTube Live (archived)  
**Frequency:** Weekly

Live coding sessions often covering architecture.

**Popular Sessions:**
- "Building a MVVM App Live"
- "SwiftUI Navigation Patterns"
- "Testing Workshop"
- "Clean Architecture Demo"

---

### Android Weekly Podcast

**Format:** News and discussion  
**Frequency:** Weekly  
**Episode Length:** 30-45 minutes

Weekly Android news with architecture discussions.

**Regular Segments:**
- Architecture Component Updates
- Library Spotlight
- Community Questions
- Best Practices Discussion

---

## Archived / Completed Series

### Retired but Valuable

**iPhreaks (Completed 2021)**
- 350+ episodes of iOS development
- Many architecture deep dives
- Still valuable historical content

**Android Dialogs (Completed 2020)**
- Interview series with Android developers
- Architecture decision discussions
- Available on YouTube

**Swift Unwrapped (Completed 2021)**
- Swift language evolution
- Impact on architecture patterns
- JP Simard & Jesse Squires

**Core Intuition (Completed 2022)**
- Indie development focus
- Real-world architecture decisions
- Daniel Jalkut & Manton Reece

---

## How to Contribute

### Adding New Podcasts

1. Fork this repository
2. Add podcast to appropriate section
3. Include:
   - Name and hosts
   - Website URL
   - Frequency and typical length
   - 3-5 relevant architecture episodes
4. Submit pull request

### Suggesting Episodes

Open an issue with:
- Podcast name
- Episode number/title
- Why it's architecture-relevant
- Key takeaways

### Updating Dead Links

If you find broken links:
1. Open an issue
2. Provide working alternative if available
3. Or submit PR with correction

---

## Resources Summary

| Category | Count | Top Pick |
|----------|-------|----------|
| iOS Podcasts | 7 | Swift by Sundell |
| Android Podcasts | 5 | Android Backstage |
| Cross-Platform | 4 | Software Engineering Radio |
| Conference Talks | 4 | WWDC Sessions |
| Deep Dives | 3 | Point-Free |
| Interview Series | 2 | Under the Radar |
| Community Shows | 3 | Hacking with Swift Live |
| Archived | 4 | iPhreaks |

**Total Episodes Referenced:** 200+  
**Total Listen Time:** 500+ hours

---

## Final Notes

### Listening Tips

1. **Use playback speed** - 1.5x works well for most technical content
2. **Take notes** - Especially for architecture discussions
3. **Follow along with code** - When examples are provided
4. **Join communities** - Many podcasts have Slack/Discord
5. **Support creators** - Patreon, subscriptions, shares

### Staying Updated

- Subscribe to RSS feeds
- Follow hosts on Twitter/Mastodon
- Join podcast Slack communities
- Check show notes for links

---

*Last updated: February 2025*  
*Contributions welcome via pull request*
