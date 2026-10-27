# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

The list was rebuilt from scratch. Every entry was opened and checked on 2026-10-28, and the
README is now generated from validated data.

### Added

- `data/entries.json` with 57 entries for iOS, Flutter, React Native and platform-independent
  concepts, each with a one-line reason and the date it was checked.
- `npm test` validates the data (fields, https links with ASCII hosts, one-line reasons without
  marketing words, links or hidden characters, no Markdown escapes or HTML character references
  such as `&#x202E;` or `&ZeroWidthSpace;`, duplicates, bounded sizes) and
  fails when README.md does not show the current list;
  `npm run list:render` writes the list section.
- `npm run list:staleness` and a weekly Staleness workflow that fail when a listed GitHub
  repository is archived, disabled, deleted, renamed or has had no push for 540 days, or when an
  entry was last checked more than 365 days ago.
- A reading list example in SwiftUI, Flutter and React Native that implements the same rules,
  with 12 Swift Testing, 16 Flutter and 15 Vitest tests, and an iOS app built in CI.
- Screenshots of the iOS, Flutter and React Native examples, each taken on an iPhone simulator by
  a script in `scripts/`.
- Guides: choosing an architecture, the iOS 27 UIScene life cycle requirement, and how the list
  is kept current.
- Shared repository kit: banner, badges, social preview, CI, link and wording checks.

### Changed

- Issue and pull request templates now ask for the information an entry needs.

### Removed

- `scripts/arch_analyzer.py`, which printed fixed text instead of analysing a project, and the
  README section that described it as an analyzer.
- README claims without sources, including a section built around a slogan, the description of
  widely used networking and reactive libraries as legacy dependencies, and star counts typed by
  hand.
- The case studies, pattern deep dives, comparison matrix and podcast list under `docs/`, which
  contained figures and code without sources.
- Entries that pointed to the wrong project, and the separate Android section (Android-only
  material is out of scope).

## [1.0.0] - 2026-02-03

### Added

- First version of the list with architecture pattern descriptions and links for iOS, Android,
  Flutter and React Native.

[Unreleased]: https://github.com/muhittincamdali/awesome-mobile-architecture/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/muhittincamdali/awesome-mobile-architecture/releases/tag/v1.0.0
