# Security

## What is in scope

- **Links.** A listed link that now serves malware, phishing or content other than what its
  entry describes.
- **The list tooling** (`src/`). The staleness check sends the `GITHUB_TOKEN` it is given to the
  GitHub API in the `Authorization` header only. Any way to make the tooling print, store or send
  the token elsewhere, or to make it read unbounded input from `data/entries.json` or from an API
  answer, is a security issue.
- **The examples** (`Examples/`). Code that would teach an unsafe pattern if copied into an app,
  for example showing an error's raw text (which can hold URLs or tokens) on screen.

## How to report

Use GitHub's private vulnerability reporting on this repository (Security tab, "Report a
vulnerability"), or email muhittincamdali@gmail.com. Please do not open a public issue for a
problem in the tooling. A malicious link can be reported in a public issue with the "Report an
outdated entry" form, since removing it quickly matters more than discretion.

Reports get a first answer within a week. Only the `main` branch is maintained.
