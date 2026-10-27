# How the list is kept current

A list of links is only useful while the links work and the projects behind them are maintained.
This page describes the rules each entry follows and the checks that enforce them.

## What an entry contains

Entries live in [data/entries.json](../../data/entries.json), not in the README. Each one has:

| Field      | Rule                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`     | At most 60 characters, no Markdown or HTML syntax or backslash, no invisible or text-direction characters                                       |
| `url`      | `https`, a public ASCII host name, no credentials, no parentheses or backslash, at most 300 characters                                          |
| `platform` | `concepts`, `ios`, `flutter` or `react-native`                                                                                                  |
| `category` | `guidance`, `state`, `dependency-injection`, `navigation`, `samples`, `testing` or `tooling`                                                    |
| `why`      | One sentence of 20-160 characters that says what the reader gets; no links, e-mail addresses, backslashes, hidden characters or marketing words |
| `repo`     | `owner/name` of the GitHub repository; required for a GitHub link (also `www.github.com`) and must match it                                     |
| `verified` | The day a person last opened the link and checked the `why` line                                                                                |

`npm run list:render` writes the README section from this file, sorted by platform, category and
name. Duplicate links (ignoring case, `www.` and a trailing slash) and duplicate names on one
platform are rejected.

## Checks that run automatically

| Check                    | When                                      | Fails when                                                                                                                                            |
| ------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test` (CI workflow) | every push and pull request               | the data breaks a rule above, or the README does not show the current data                                                                            |
| Staleness workflow       | weekly and on changes to the data         | a listed repository is archived, disabled, deleted, renamed, or has had no push for 540 days; or an entry's `verified` date is more than 365 days old |
| Links (Quality workflow) | weekly and on every push and pull request | any link in a Markdown file does not answer with a 2xx status, or an anchor does not exist                                                            |

The staleness check reads each repository from the GitHub REST API once, even when several
entries point into it, and writes a table of problems to the job summary. A renamed repository
is reported with its new `owner/name`, so the fix is a one-line change.

Run the same checks locally:

```sh
npm ci
npm test                                      # schema, README sync and unit tests
GITHUB_TOKEN=$(gh auth token) npm run list:staleness
```

Without a token the GitHub API allows 60 requests an hour, which is enough for the current list
but not for repeated runs.

## When a check fails

- **Stale or archived repository:** look for a maintained successor. If there is none and the
  project still teaches something no other entry does, it can stay only after a person reads it
  again and updates `verified`; otherwise remove it.
- **Renamed repository:** update `url` and `repo` to the new name.
- **Broken link:** find the new address of the page; if the page is gone, remove the entry.
- **Expired `verified` date:** open the link, confirm the `why` line still holds, and set
  `verified` to today.
