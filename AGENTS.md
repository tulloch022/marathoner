# Marathoner Working Agreement

## Project context

Marathoner is a React and TypeScript application built with Vite. It currently
uses Firebase for authentication and data-related services.

- `src/App.tsx`: top-level application composition
- `src/components/`: reusable UI and feature components
- `src/services/`: integrations and application services
- `src/firebaseConfig.ts`: Firebase initialization
- `src/index.css`: shared application styling

## Development commands

- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- Run linting: `npm run lint`
- Run the production build and TypeScript checks: `npm run build`
- Preview the production build: `npm run preview`

There is no automated test command yet. Do not claim tests passed unless a test
runner has been added and actually run.

## Collaboration approach

The maintainer is developing this project outside of their day job and wants to
understand every line they commit.

- Scope work into a focused 60-90 minute daily slice whenever practical.
- Before editing, briefly explain the intended behavior, files involved, and
  verification plan.
- Prefer teaching and plain-language explanations over unexplained code output.
- Keep changes small, cohesive, and tied to the active GitHub issue.
- Avoid unrelated refactors, speculative abstractions, and drive-by cleanup.
- Call out assumptions and meaningful tradeoffs before they shape the solution.
- Explain new dependencies before adding them.
- Preserve existing user changes, including uncommitted work.
- Do not commit, push, create branches, or change GitHub state unless explicitly
  requested.

## Code expectations

- Follow the existing strict TypeScript and ESLint configuration.
- Prefer clear React function components and descriptive names.
- Keep data access and external integrations in service modules when practical.
- Match existing project conventions unless the task intentionally improves them.
- Never expose credentials or commit environment secrets.

## Definition of done

For implementation work:

1. Confirm the requested behavior and acceptance criteria are satisfied.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Manually exercise affected UI behavior with `npm run dev` when relevant.
5. Review the final diff for regressions and unrelated changes.
6. Summarize what changed, why it changed, and any remaining verification gaps.

If a check cannot be run or fails for a pre-existing reason, report that clearly
instead of treating the work as fully verified.
