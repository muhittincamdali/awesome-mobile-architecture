# Contributing

Thanks for helping keep this list useful. Suggestions, corrections and removals are all welcome;
a removal of an outdated entry is as valuable as a new one.

## Suggest or change an entry

1. Open the link and read it. An entry is only added by someone who has read it or used it.
2. Add or edit the entry in [data/entries.json](data/entries.json):

    ```json
    {
        "name": "Riverpod",
        "url": "https://github.com/rrousselGit/riverpod",
        "repo": "rrousselGit/riverpod",
        "platform": "flutter",
        "category": "state",
        "why": "Compile-safe providers for async state, caching and dependency injection, testable without a widget tree.",
        "verified": "2026-10-28"
    }
    ```

    The rules for each field are in [How the list is kept current](docs/guides/keeping-the-list-current.md).
    The short version: `why` is one sentence of 20-160 characters that says what the reader gets,
    `verified` is today's date, and a GitHub link needs the matching `repo`.

3. Render the README and run the checks (Node 24):

    ```sh
    npm ci
    npm run list:render
    npm test
    ```

4. Open a pull request with the data file and README.md. CI runs the same checks, the link
   checker and the staleness check for the repositories you added.

If you cannot run Node, open an issue with the "Suggest an entry" or "Report an outdated entry"
form instead.

## Change an example

Each example under [Examples/](Examples/README.md) implements the same rules, and each test
suite checks all of them. A change to one rule belongs in all three examples and their tests:

```sh
cd Examples/ios/ReadingList && swift test
cd Examples/flutter/reading_list && flutter analyze && flutter test
cd Examples/react-native/reading-list && npm ci && npm run typecheck && npm test
```

If the iOS screen changes, regenerate the screenshots with `scripts/capture-ios-example.sh` on a
Mac with Xcode 27.

## Change the tooling

The checker is TypeScript in `src/`, run directly by Node 24 and tested with Vitest in `test/`.
`npm run typecheck`, `npm run lint` and `npm test` must pass. Input from `data/entries.json`
arrives through pull requests, so keep every size bounded and every field validated.

## Translations

README.md is written in English first. The other languages follow in a separate pass; please do
not edit translated READMEs in the same pull request as an English change.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md).
