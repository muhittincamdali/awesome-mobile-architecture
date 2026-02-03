# Mobile Architecture Comparison Matrix

> A comprehensive comparison of mobile app architecture patterns across multiple dimensions, helping teams make informed decisions for their specific needs.

---

## Table of Contents

- [Quick Reference](#quick-reference)
- [Pattern Overview](#pattern-overview)
- [Detailed Comparisons](#detailed-comparisons)
  - [Learning Curve](#learning-curve)
  - [Testability](#testability)
  - [Scalability](#scalability)
  - [Performance](#performance)
  - [Code Organization](#code-organization)
  - [Team Size Fit](#team-size-fit)
  - [Debugging Experience](#debugging-experience)
  - [Boilerplate Requirements](#boilerplate-requirements)
- [Platform-Specific Matrices](#platform-specific-matrices)
  - [iOS Patterns](#ios-patterns)
  - [Android Patterns](#android-patterns)
  - [Cross-Platform](#cross-platform-patterns)
- [Decision Trees](#decision-trees)
- [Migration Complexity](#migration-complexity)
- [Real-World Adoption](#real-world-adoption)
- [Tool & Library Support](#tool--library-support)

---

## Quick Reference

### At a Glance

| Pattern | Complexity | Best For | Avoid When |
|---------|------------|----------|------------|
| **MVC** | ⭐ | Prototypes, small apps | Large teams, complex state |
| **MVP** | ⭐⭐ | Legacy modernization | Reactive UI requirements |
| **MVVM** | ⭐⭐ | Medium apps, data binding | Simple CRUD apps |
| **MVI** | ⭐⭐⭐ | Complex state, analytics | Rapid prototyping |
| **VIPER** | ⭐⭐⭐⭐ | Enterprise apps | Small teams, tight deadlines |
| **RIBs** | ⭐⭐⭐⭐⭐ | Super apps, large teams | Startups, MVPs |
| **TCA** | ⭐⭐⭐⭐ | SwiftUI apps, state-heavy | UIKit-only projects |
| **Clean** | ⭐⭐⭐ | Long-term projects | Short-lived apps |

### Emoji Legend

| Symbol | Meaning |
|--------|---------|
| ⭐ | Very Low / Minimal |
| ⭐⭐ | Low / Basic |
| ⭐⭐⭐ | Medium / Moderate |
| ⭐⭐⭐⭐ | High / Significant |
| ⭐⭐⭐⭐⭐ | Very High / Maximum |
| ✅ | Excellent / Recommended |
| ⚠️ | Caution / Consider |
| ❌ | Not Recommended |

---

## Pattern Overview

### Architecture Patterns Compared

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE COMPLEXITY SPECTRUM                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Simple                                                    Complex       │
│    │                                                           │         │
│    ▼                                                           ▼         │
│   MVC ──── MVP ──── MVVM ──── MVI ──── Clean ──── VIPER ──── RIBs      │
│    │        │        │         │         │          │          │        │
│    └────────┴────────┴─────────┴─────────┴──────────┴──────────┘        │
│                                                                          │
│  Features:                                                               │
│  • Fewer files                                        • More files       │
│  • Less abstraction                              • More abstraction      │
│  • Faster initial dev                            • Better scalability    │
│  • Harder to test                                   • Easier to test     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core Components by Pattern

| Pattern | View | State Manager | Business Logic | Navigation | Data |
|---------|------|---------------|----------------|------------|------|
| MVC | Controller | Controller | Controller | Controller | Model |
| MVP | View | Presenter | Presenter | Presenter | Model |
| MVVM | View | ViewModel | ViewModel | Coordinator* | Model |
| MVI | View | Store | Reducer | Navigator | State |
| VIPER | View | Presenter | Interactor | Router | Entity |
| RIBs | View | Interactor | Interactor | Router | - |
| TCA | View | Store | Reducer | - | State |
| Clean | View | Presenter | Use Case | - | Entity |

*Optional but recommended

---

## Detailed Comparisons

### Learning Curve

How long it takes for developers to become productive.

| Pattern | Junior Dev | Mid Dev | Senior Dev | Team Onboarding |
|---------|------------|---------|------------|-----------------|
| MVC | 1 week | 2 days | 1 day | ⭐ Easy |
| MVP | 2 weeks | 1 week | 3 days | ⭐⭐ Easy |
| MVVM | 3 weeks | 2 weeks | 1 week | ⭐⭐ Moderate |
| MVI | 1 month | 3 weeks | 2 weeks | ⭐⭐⭐ Moderate |
| VIPER | 2 months | 1 month | 2 weeks | ⭐⭐⭐⭐ Hard |
| RIBs | 3 months | 2 months | 1 month | ⭐⭐⭐⭐⭐ Very Hard |
| TCA | 2 months | 1 month | 3 weeks | ⭐⭐⭐⭐ Hard |
| Clean | 1 month | 3 weeks | 2 weeks | ⭐⭐⭐ Moderate |

**Prerequisites by Pattern:**

| Pattern | Required Knowledge | Helpful Knowledge |
|---------|-------------------|-------------------|
| MVC | Basic OOP | - |
| MVP | Interfaces, delegation | Unit testing |
| MVVM | Data binding, reactive | RxSwift/Combine |
| MVI | Functional concepts | State machines |
| VIPER | SOLID principles | Clean Architecture |
| RIBs | Advanced OOP, DI | Enterprise patterns |
| TCA | Swift, functional | Combine, SwiftUI |
| Clean | DDD basics | Hexagonal architecture |

---

### Testability

How easy it is to write and maintain tests.

| Pattern | Unit Tests | Integration Tests | UI Tests | Snapshot Tests | Overall |
|---------|------------|-------------------|----------|----------------|---------|
| MVC | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ Poor |
| MVP | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ Good |
| MVVM | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ Good |
| MVI | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ Excellent |
| VIPER | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ Excellent |
| RIBs | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ Excellent |
| TCA | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ Excellent |
| Clean | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ Excellent |

**Test Coverage Targets:**

| Pattern | Realistic Target | Optimal Target | Effort Required |
|---------|------------------|----------------|-----------------|
| MVC | 30-40% | 50% | ⭐⭐⭐⭐⭐ Very High |
| MVP | 60-70% | 80% | ⭐⭐⭐ Medium |
| MVVM | 60-70% | 85% | ⭐⭐⭐ Medium |
| MVI | 80-90% | 95% | ⭐⭐ Low |
| VIPER | 75-85% | 90% | ⭐⭐ Low |
| RIBs | 80-90% | 95% | ⭐⭐ Low |
| TCA | 85-95% | 98% | ⭐ Very Low |
| Clean | 75-85% | 90% | ⭐⭐ Low |

---

### Scalability

How well the pattern handles growth in codebase, features, and team size.

| Pattern | 10K LOC | 50K LOC | 100K LOC | 500K LOC | 1M+ LOC |
|---------|---------|---------|----------|----------|---------|
| MVC | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| MVP | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| MVVM | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| MVI | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| VIPER | ✅ | ✅ | ✅ | ✅ | ✅ |
| RIBs | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| TCA | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Clean | ✅ | ✅ | ✅ | ✅ | ✅ |

**Team Size Recommendations:**

| Pattern | 1-2 Devs | 3-5 Devs | 6-15 Devs | 15-50 Devs | 50+ Devs |
|---------|----------|----------|-----------|------------|----------|
| MVC | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| MVP | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| MVVM | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| MVI | ⚠️ | ✅ | ✅ | ✅ | ⚠️ |
| VIPER | ❌ | ✅ | ✅ | ✅ | ✅ |
| RIBs | ❌ | ⚠️ | ✅ | ✅ | ✅ |
| TCA | ✅ | ✅ | ✅ | ⚠️ | ❌ |
| Clean | ⚠️ | ✅ | ✅ | ✅ | ✅ |

---

### Performance

Runtime performance characteristics.

| Pattern | Memory Overhead | CPU Overhead | Startup Impact | Battery Impact |
|---------|-----------------|--------------|----------------|----------------|
| MVC | ⭐ Minimal | ⭐ Minimal | ⭐ None | ⭐ Minimal |
| MVP | ⭐ Minimal | ⭐ Minimal | ⭐ None | ⭐ Minimal |
| MVVM | ⭐⭐ Low | ⭐⭐ Low | ⭐ None | ⭐⭐ Low |
| MVI | ⭐⭐⭐ Medium | ⭐⭐ Low | ⭐⭐ Low | ⭐⭐ Low |
| VIPER | ⭐⭐ Low | ⭐ Minimal | ⭐⭐ Low | ⭐ Minimal |
| RIBs | ⭐⭐⭐ Medium | ⭐⭐ Low | ⭐⭐ Low | ⭐⭐ Low |
| TCA | ⭐⭐⭐ Medium | ⭐⭐⭐ Medium | ⭐⭐ Low | ⭐⭐ Low |
| Clean | ⭐⭐ Low | ⭐ Minimal | ⭐ None | ⭐ Minimal |

**Performance Optimization Potential:**

| Pattern | Optimization Ease | Profiling Ease | Bottleneck Identification |
|---------|-------------------|----------------|---------------------------|
| MVC | ⭐⭐⭐ Easy | ⭐⭐ Moderate | ⭐⭐ Moderate |
| MVP | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy |
| MVVM | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy |
| MVI | ⭐⭐ Moderate | ⭐⭐⭐⭐ Very Easy | ⭐⭐⭐⭐ Very Easy |
| VIPER | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy |
| RIBs | ⭐⭐ Moderate | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy |
| TCA | ⭐⭐ Moderate | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| Clean | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy | ⭐⭐⭐ Easy |

---

### Code Organization

How the pattern affects project structure.

| Pattern | File Count | Folder Depth | Naming Consistency | Feature Isolation |
|---------|------------|--------------|--------------------|--------------------|
| MVC | ⭐ Few | ⭐ Shallow | ⭐⭐ Variable | ⭐ Poor |
| MVP | ⭐⭐ Moderate | ⭐⭐ Moderate | ⭐⭐⭐ Good | ⭐⭐ Moderate |
| MVVM | ⭐⭐ Moderate | ⭐⭐ Moderate | ⭐⭐⭐ Good | ⭐⭐⭐ Good |
| MVI | ⭐⭐⭐ Many | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good |
| VIPER | ⭐⭐⭐⭐⭐ Very Many | ⭐⭐⭐⭐ Deep | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| RIBs | ⭐⭐⭐⭐⭐ Very Many | ⭐⭐⭐⭐⭐ Very Deep | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| TCA | ⭐⭐⭐ Many | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good |
| Clean | ⭐⭐⭐⭐ Many | ⭐⭐⭐⭐ Deep | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐⭐ Excellent |

**Typical File Counts per Feature:**

| Pattern | Files per Feature | Example Breakdown |
|---------|-------------------|-------------------|
| MVC | 2-3 | VC, Model, (Storyboard) |
| MVP | 4-5 | View, Presenter, Protocol, Model, (Tests) |
| MVVM | 4-5 | View, ViewModel, Model, (Binding), (Tests) |
| MVI | 5-6 | View, State, Intent, Reducer, (Side Effects), (Tests) |
| VIPER | 7-9 | View, Presenter, Interactor, Router, Entity, Protocols, (Tests) |
| RIBs | 6-8 | Builder, Router, Interactor, View, (Component), (Tests) |
| TCA | 3-4 | Feature (State/Action/Reducer), View, (Tests) |
| Clean | 6-8 | Entity, Use Case, Repository, Presenter, View, (Mappers), (Tests) |

---

### Team Size Fit

Optimal team sizes and collaboration patterns.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PATTERN vs TEAM SIZE MATRIX                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Team Size    │ Solo │ 2-3  │ 4-6  │ 7-15 │ 16-30│ 30+  │               │
│  ─────────────┼──────┼──────┼──────┼──────┼──────┼──────┤               │
│  MVC          │  ✅  │  ✅  │  ⚠️  │  ❌  │  ❌  │  ❌  │               │
│  MVP          │  ✅  │  ✅  │  ✅  │  ⚠️  │  ❌  │  ❌  │               │
│  MVVM         │  ✅  │  ✅  │  ✅  │  ✅  │  ⚠️  │  ❌  │               │
│  MVI          │  ⚠️  │  ✅  │  ✅  │  ✅  │  ✅  │  ⚠️  │               │
│  VIPER        │  ❌  │  ⚠️  │  ✅  │  ✅  │  ✅  │  ✅  │               │
│  RIBs         │  ❌  │  ❌  │  ⚠️  │  ✅  │  ✅  │  ✅  │               │
│  TCA          │  ✅  │  ✅  │  ✅  │  ✅  │  ⚠️  │  ❌  │               │
│  Clean        │  ⚠️  │  ✅  │  ✅  │  ✅  │  ✅  │  ✅  │               │
│                                                                          │
│  Legend: ✅ Optimal  ⚠️ Possible  ❌ Not Recommended                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Collaboration Friction:**

| Pattern | Merge Conflicts | Code Review Complexity | Knowledge Sharing |
|---------|-----------------|------------------------|-------------------|
| MVC | ⭐⭐⭐⭐⭐ Very High | ⭐ Easy | ⭐⭐⭐⭐⭐ Very Easy |
| MVP | ⭐⭐⭐ Medium | ⭐⭐ Easy | ⭐⭐⭐⭐ Easy |
| MVVM | ⭐⭐⭐ Medium | ⭐⭐ Easy | ⭐⭐⭐⭐ Easy |
| MVI | ⭐⭐ Low | ⭐⭐⭐ Moderate | ⭐⭐⭐ Moderate |
| VIPER | ⭐ Very Low | ⭐⭐⭐⭐ Moderate | ⭐⭐ Hard |
| RIBs | ⭐ Very Low | ⭐⭐⭐⭐⭐ Hard | ⭐ Very Hard |
| TCA | ⭐⭐ Low | ⭐⭐⭐ Moderate | ⭐⭐⭐ Moderate |
| Clean | ⭐⭐ Low | ⭐⭐⭐ Moderate | ⭐⭐ Hard |

---

### Debugging Experience

How easy it is to find and fix bugs.

| Pattern | Stack Trace Clarity | State Inspection | Time Travel Debug | Logging Quality |
|---------|---------------------|------------------|-------------------|-----------------|
| MVC | ⭐⭐ Poor | ⭐ Scattered | ❌ N/A | ⭐⭐ Variable |
| MVP | ⭐⭐⭐ Good | ⭐⭐⭐ Clear | ❌ N/A | ⭐⭐⭐ Good |
| MVVM | ⭐⭐⭐ Good | ⭐⭐⭐ Clear | ⚠️ Limited | ⭐⭐⭐ Good |
| MVI | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐⭐ Excellent | ✅ Supported | ⭐⭐⭐⭐⭐ Excellent |
| VIPER | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good | ❌ N/A | ⭐⭐⭐⭐ Very Good |
| RIBs | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Very Good | ❌ N/A | ⭐⭐⭐⭐ Very Good |
| TCA | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent | ✅ Built-in | ⭐⭐⭐⭐⭐ Excellent |
| Clean | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good | ❌ N/A | ⭐⭐⭐⭐ Very Good |

**Bug Categories by Pattern:**

| Pattern | UI Bugs | Logic Bugs | State Bugs | Navigation Bugs | Data Bugs |
|---------|---------|------------|------------|-----------------|-----------|
| MVC | Hard | Hard | Very Hard | Hard | Moderate |
| MVP | Easy | Moderate | Moderate | Moderate | Easy |
| MVVM | Easy | Moderate | Moderate | Moderate | Easy |
| MVI | Easy | Easy | Very Easy | Easy | Easy |
| VIPER | Easy | Easy | Easy | Easy | Easy |
| RIBs | Easy | Moderate | Easy | Easy | Easy |
| TCA | Easy | Very Easy | Very Easy | Moderate | Very Easy |
| Clean | Easy | Easy | Easy | Moderate | Very Easy |

---

### Boilerplate Requirements

Amount of repetitive code required.

| Pattern | Setup Boilerplate | Feature Boilerplate | Total Lines per Feature |
|---------|-------------------|---------------------|-------------------------|
| MVC | ⭐ Minimal | ⭐ Minimal | ~50-100 |
| MVP | ⭐⭐ Low | ⭐⭐⭐ Medium | ~150-250 |
| MVVM | ⭐⭐ Low | ⭐⭐ Low | ~100-200 |
| MVI | ⭐⭐⭐ Medium | ⭐⭐⭐ Medium | ~200-350 |
| VIPER | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐⭐ Very High | ~400-600 |
| RIBs | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐ High | ~350-500 |
| TCA | ⭐⭐⭐ Medium | ⭐⭐ Low | ~150-250 |
| Clean | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐ High | ~300-450 |

**Code Generation Support:**

| Pattern | Xcode Templates | Android Studio | Third-Party Tools |
|---------|-----------------|----------------|-------------------|
| MVC | Built-in | Built-in | N/A |
| MVP | Community | Community | N/A |
| MVVM | Community | Official | N/A |
| MVI | Community | Community | Kotlin MVI generators |
| VIPER | Excellent | Community | Generamba, Weaver |
| RIBs | Official | Official | RIBs tooling |
| TCA | Community | N/A | TCA template packages |
| Clean | Community | Community | N/A |

---

## Platform-Specific Matrices

### iOS Patterns

| Pattern | UIKit | SwiftUI | Combine | Async/Await | watchOS | tvOS |
|---------|-------|---------|---------|-------------|---------|------|
| MVC | ✅ Native | ⚠️ Awkward | Optional | ✅ Works | ✅ | ✅ |
| MVP | ✅ Good | ⚠️ Possible | Optional | ✅ Works | ✅ | ✅ |
| MVVM | ✅ Good | ✅ Natural | ✅ Great | ✅ Good | ✅ | ✅ |
| MVI | ✅ Good | ✅ Excellent | ✅ Great | ⚠️ Possible | ✅ | ✅ |
| VIPER | ✅ Native | ⚠️ Awkward | Optional | ✅ Works | ⚠️ | ⚠️ |
| RIBs | ✅ Designed | ❌ Not Compatible | Optional | ✅ Works | ❌ | ❌ |
| TCA | ⚠️ Possible | ✅ Designed | ✅ Built-in | ✅ Native | ✅ | ✅ |
| Clean | ✅ Good | ✅ Good | Optional | ✅ Works | ✅ | ✅ |

**SwiftUI Readiness Score:**

| Pattern | Native Support | Migration Path | Community Adoption |
|---------|----------------|----------------|-------------------|
| TCA | ⭐⭐⭐⭐⭐ | N/A | High |
| MVVM | ⭐⭐⭐⭐ | Easy | Very High |
| MVI | ⭐⭐⭐⭐ | Moderate | Medium |
| Clean | ⭐⭐⭐ | Moderate | Medium |
| MVP | ⭐⭐ | Hard | Low |
| VIPER | ⭐ | Very Hard | Very Low |
| RIBs | ❌ | N/A | None |
| MVC | ⭐ | Hard | Low |

---

### Android Patterns

| Pattern | XML Views | Jetpack Compose | Flow/Coroutines | Room | Navigation |
|---------|-----------|-----------------|-----------------|------|------------|
| MVC | ⚠️ Messy | ❌ Not Fit | Optional | ✅ | ⚠️ |
| MVP | ✅ Good | ⚠️ Possible | Optional | ✅ | ⚠️ |
| MVVM | ✅ Native | ✅ Excellent | ✅ Great | ✅ | ✅ |
| MVI | ✅ Good | ✅ Excellent | ✅ Native | ✅ | ✅ |
| Clean | ✅ Good | ✅ Good | ✅ Great | ✅ | ✅ |

**Jetpack Compatibility:**

| Pattern | ViewModel | LiveData | StateFlow | Hilt | Navigation |
|---------|-----------|----------|-----------|------|------------|
| MVVM | ✅ Native | ✅ | ✅ | ✅ | ✅ |
| MVI | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Clean | ✅ | ✅ | ✅ | ✅ | ✅ |
| MVP | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ |

---

### Cross-Platform Patterns

| Pattern | Flutter | React Native | KMM | Xamarin |
|---------|---------|--------------|-----|---------|
| MVC | ❌ | ⚠️ | ⚠️ | ✅ |
| MVP | ⚠️ | ⚠️ | ✅ | ✅ |
| MVVM | ✅ | ✅ | ✅ | ✅ Native |
| MVI | ✅ Native | ✅ Redux | ✅ | ⚠️ |
| Clean | ✅ | ✅ | ✅ | ✅ |
| BLoC | ✅ Native | ❌ | ⚠️ | ❌ |
| Redux | ⚠️ | ✅ Native | ⚠️ | ⚠️ |
| Riverpod | ✅ Native | ❌ | ❌ | ❌ |

---

## Decision Trees

### iOS Architecture Selection

```
                           ┌─────────────────┐
                           │ Start: iOS App  │
                           └────────┬────────┘
                                    │
                           ┌────────▼────────┐
                           │ SwiftUI only?   │
                           └────────┬────────┘
                               Yes / \ No
                                  /   \
                    ┌────────────▼┐   ┌▼───────────────┐
                    │ Complex     │   │ UIKit or Mixed │
                    │ state mgmt? │   └───────┬────────┘
                    └──────┬──────┘           │
                      Yes / \ No         ┌────▼────────┐
                         /   \           │ Team size   │
              ┌─────────▼┐   ┌▼────┐     │ > 10 devs?  │
              │   TCA    │   │MVVM │     └──────┬──────┘
              └──────────┘   └─────┘       Yes / \ No
                                             /   \
                              ┌─────────────▼┐   ┌▼──────────┐
                              │ Enterprise?  │   │ Rapid dev │
                              └──────┬───────┘   │ needed?   │
                                Yes / \ No       └─────┬─────┘
                                   /   \           Yes / \ No
                        ┌─────────▼┐   ┌▼────┐       /   \
                        │  VIPER   │   │Clean│    ┌─▼───┐ ┌▼────┐
                        │  or RIBs │   │Arch │    │MVVM │ │Clean│
                        └──────────┘   └─────┘    └─────┘ └─────┘
```

### Android Architecture Selection

```
                           ┌──────────────────┐
                           │ Start: Android   │
                           └────────┬─────────┘
                                    │
                           ┌────────▼─────────┐
                           │ Compose only?    │
                           └────────┬─────────┘
                               Yes / \ No
                                  /   \
                    ┌────────────▼┐   ┌▼───────────────┐
                    │ Unidirect-  │   │ XML Views      │
                    │ ional flow? │   └───────┬────────┘
                    └──────┬──────┘           │
                      Yes / \ No         ┌────▼─────────┐
                         /   \           │ Standard     │
              ┌─────────▼┐   ┌▼────┐     │ Jetpack?     │
              │   MVI    │   │MVVM │     └──────┬───────┘
              └──────────┘   └─────┘       Yes / \ No
                                             /   \
                              ┌─────────────▼┐   ┌▼────────────┐
                              │    MVVM      │   │ Legacy      │
                              │  + ViewModel │   │ codebase?   │
                              └──────────────┘   └──────┬──────┘
                                                   Yes / \ No
                                                      /   \
                                           ┌─────────▼┐   ┌▼─────┐
                                           │   MVP    │   │ MVVM │
                                           └──────────┘   └──────┘
```

---

## Migration Complexity

### From MVC to Other Patterns

| Target | Effort | Duration (50K LOC) | Risk Level | Strategy |
|--------|--------|-------------------|------------|----------|
| MVP | ⭐⭐ Low | 2-3 months | Low | Extract presenters |
| MVVM | ⭐⭐ Low | 2-4 months | Low | Extract view models |
| MVI | ⭐⭐⭐ Medium | 4-6 months | Medium | Rewrite with state |
| VIPER | ⭐⭐⭐⭐ High | 6-9 months | High | Module by module |
| TCA | ⭐⭐⭐⭐ High | 6-12 months | High | Feature by feature |
| Clean | ⭐⭐⭐ Medium | 4-6 months | Medium | Layer extraction |

### Migration Path Recommendations

```
MVC → MVP → MVVM → MVI (Incremental)
MVC → MVVM → Clean (Standard)
MVC → VIPER (Enterprise)
MVC → TCA (SwiftUI rewrite)
```

---

## Real-World Adoption

### Companies by Pattern

| Pattern | Notable Users |
|---------|---------------|
| MVC | Early-stage startups |
| MVP | Banking apps, Enterprise |
| MVVM | Microsoft, Google apps |
| MVI | Airbnb, Spotify |
| VIPER | Uber, Booking.com |
| RIBs | Uber, Grab |
| TCA | Point-Free clients |
| Clean | Amazon, Netflix |

### Industry Preferences

| Industry | Preferred Patterns | Reasoning |
|----------|-------------------|-----------|
| Finance | VIPER, Clean | Compliance, testing |
| E-commerce | MVVM, MVI | Rapid iteration |
| Social | RIBs, VIPER | Scale, multiple teams |
| Gaming | Custom, MVC | Performance critical |
| Healthcare | Clean, MVVM | Compliance, maintainability |
| Media | MVVM, MVI | State complexity |

---

## Tool & Library Support

### iOS Libraries by Pattern

| Pattern | Primary Libraries | Testing Tools |
|---------|-------------------|---------------|
| MVC | UIKit | XCTest |
| MVP | - | XCTest, Quick |
| MVVM | RxSwift, Combine | RxTest, XCTest |
| MVI | RxSwift, Combine | XCTest |
| VIPER | Generamba | XCTest, Quick |
| RIBs | RIBs Framework | XCTest |
| TCA | TCA Framework | TCA Testing |
| Clean | - | XCTest |

### Android Libraries by Pattern

| Pattern | Primary Libraries | Testing Tools |
|---------|-------------------|---------------|
| MVP | - | JUnit, Mockito |
| MVVM | Jetpack, Hilt | JUnit, Turbine |
| MVI | Orbit, MVIKotlin | JUnit, Turbine |
| Clean | Hilt | JUnit, Mockito |

---

## Summary Recommendations

### Quick Selection Guide

| Your Situation | Recommended Pattern |
|----------------|---------------------|
| Solo developer, small app | MVVM |
| Startup, rapid iteration | MVVM or MVI |
| Medium team, complex app | MVI or Clean |
| Large team, enterprise | VIPER or Clean |
| Super app, 50+ developers | RIBs |
| SwiftUI greenfield | TCA or MVVM |
| Compose greenfield | MVI or MVVM |
| Legacy modernization | MVP → MVVM |

### Final Thoughts

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KEY TAKEAWAYS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. No "best" architecture exists - only best fits for your context     │
│                                                                          │
│  2. Start simple, evolve as needed                                      │
│                                                                          │
│  3. Team familiarity often trumps theoretical benefits                  │
│                                                                          │
│  4. Testability should be a primary decision factor                     │
│                                                                          │
│  5. Consider migration costs before choosing complex patterns           │
│                                                                          │
│  6. Hybrid approaches are valid and often practical                     │
│                                                                          │
│  7. Documentation and consistency matter more than pattern choice       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*Last updated: February 2025*  
*Data based on community surveys, conference talks, and production experience*
