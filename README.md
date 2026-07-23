# Marathoner

Plan, track, and understand marathon training in one focused workspace.

Marathoner is an actively developed training companion for runners preparing
for a marathon. The product is being built in small, understandable increments,
with the current [Foundation milestone](https://github.com/tulloch022/marathoner/milestone/1)
focused on a dependable application structure, testing, and connected training
data.

## Project status

Marathoner is currently a foundation-stage prototype. The existing experience
includes:

- **Plan:** browse a sample 20-week workout calendar and inspect daily workouts.
- **Track:** add shoes, log runs, and calculate mileage for the current session.
- **Analyze:** preview the planned analytics experience with sample data.
- **Authentication:** create an account and sign in with Firebase email/password
  authentication.

Training plans, runs, shoes, and analytics are not persisted yet. Follow the
[open issues](https://github.com/tulloch022/marathoner/issues) to see what is
being built next.

## Technology

- React and TypeScript
- Vite
- Firebase Authentication
- Framer Motion
- Vitest and Testing Library
- ESLint

## Current architecture

Marathoner is currently a client-only, single-page React application. It does
not have an application server, API, router, or training-data database.

| Path | Responsibility |
| --- | --- |
| `index.html` | Provides the browser document and loads the React entry point. |
| `src/main.tsx` | Mounts the application in React strict mode and loads the global stylesheet. |
| `src/App.tsx` | Owns the active Plan, Track, or Analyze section and renders the application shell. |
| `src/components/` | Contains the feature views, authentication forms, title, subtitle, and supporting UI. |
| `src/services/authService.ts` | Initializes Firebase and contains the authentication operations. |
| `src/firebaseConfig.ts` | Identifies the Firebase web project used by the client. |
| `src/**/*.test.ts(x)` | Keeps unit and component tests beside the code they verify. |
| `src/test/` | Contains shared test setup and environment-level tests. |
| `src/index.css` | Contains the current application-wide styles. |
| `vite.config.ts` | Configures React, production assets, and the GitHub Pages base path. |

The current application flow is deliberately small:

1. `src/main.tsx` mounts `App`.
2. `App` keeps the selected section in local React state.
3. Opening Plan, Track, or Analyze mounts that feature component.
4. Closing a section unmounts its feature component and returns to the landing
   screen.
5. Login and signup forms call the Firebase authentication service directly.

There is no shared domain model or application-wide state container yet. Those
boundaries will be introduced through the Foundation milestone rather than
added speculatively to the prototype. The shared training model is tracked in
[issue #11](https://github.com/tulloch022/marathoner/issues/11).

## Current data limitations

The visible training experience is not connected to persistent user data yet:

- **Plan:** `Calendar.tsx` generates a sample 20-week schedule by repeating one
  seven-day week. It is not based on dates, goals, experience, or an account.
  Personalized plan generation is tracked in
  [issue #29](https://github.com/tulloch022/marathoner/issues/29).
- **Track:** `ShoeTracker.tsx` keeps shoes and runs in component state. Closing
  Track, refreshing the page, or opening the app on another device clears that
  data. Persistent training data is tracked in
  [issue #12](https://github.com/tulloch022/marathoner/issues/12).
- **Analyze:** `Analyze.tsx` displays fixed demonstration values. It does not
  calculate results from Plan or Track. Connecting the three features is
  tracked in [issue #13](https://github.com/tulloch022/marathoner/issues/13).
- **Authentication:** Firebase can create and sign in accounts, but the
  application shell does not currently display the signed-in user, react to
  authentication-state changes, protect content, or expose sign out.
  Application-level authentication state is tracked in
  [issue #5](https://github.com/tulloch022/marathoner/issues/5).

No workout, run, shoe, or analytics data is sent to Firestore, Realtime
Database, browser storage, or another backend. Firebase Authentication is the
only active remote integration.

## Prerequisites

Install the following before running Marathoner locally:

- [Node.js](https://nodejs.org/) 20.x or 22+
- npm, which is included with Node.js
- Git

The installed Vite version also supports Node.js 18.x, but a currently supported
Node.js release is recommended.

## Local setup

1. Clone the repository:

   ```bash
   git clone https://github.com/tulloch022/marathoner.git
   cd marathoner
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite, normally
   `http://localhost:5173/marathoner/`.

Use `npm ci` instead of `npm install` when you want a clean, reproducible install
that exactly matches `package-lock.json`.

## Firebase configuration

Firebase is currently used only for email/password authentication. The web
client configuration is defined in `src/firebaseConfig.ts`. Importing
`src/services/authService.ts` initializes the Firebase app and creates the
shared Authentication instance.

The service exports operations for signup, sign in, sign out, reading the
current user, and subscribing to authentication changes. The current UI uses
only signup and sign in. Firebase may retain an authenticated browser session,
but the rest of the application does not consume that session yet.

The committed configuration connects the app to its current Firebase project.
To use a different project:

1. Create or select a Firebase project.
2. Register a web app in that project.
3. Enable the **Email/Password** provider under Firebase Authentication.
4. Add local development and deployment hosts to the project's authorized
   domains when Firebase requires them.
5. Replace the web client configuration values in `src/firebaseConfig.ts`.

Firebase web configuration identifies a Firebase project; it is not a server
credential and must not be treated as authorization. Protect any future
database or storage service with appropriate Firebase Security Rules. Never
commit service-account files, private keys, passwords, or other secrets.

Moving environment-specific configuration out of the source file is tracked in
[issue #22](https://github.com/tulloch022/marathoner/issues/22).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run lint` | Check the repository with ESLint. |
| `npm test` | Run the automated test suite once. |
| `npm run test:watch` | Keep the test runner open and rerun affected tests after changes. |
| `npm run build` | Run TypeScript project checks and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for a final browser check. |
| `npm run predeploy` | Build the application; npm also runs this automatically before `deploy`. |
| `npm run deploy` | Publish the contents of `dist/` to the `gh-pages` branch. |

## GitHub Pages deployment

The current production site is published at
[https://tulloch022.github.io/marathoner/](https://tulloch022.github.io/marathoner/).
Deployment is manual; there is no GitHub Actions deployment workflow yet.

`vite.config.ts` sets `base` to `/marathoner/`. Vite uses that value to prefix
production asset URLs for a GitHub Pages project site. If the repository name
or hosting path changes, update `base` before deploying. The `homepage` value
in `package.json` does not control Vite's asset paths.

After a pull request is reviewed and merged, deploy from an up-to-date `main`:

```bash
git switch main
git pull --ff-only
npm ci
npm run deploy
```

Running `npm run deploy` performs the production build through `predeploy`,
then publishes `dist/` to the `gh-pages` branch. GitHub Pages must be configured
to serve the root of that branch. Publishing the branch does not change source
files on `main`.

Before publishing, verify the production build locally:

```bash
npm run build
npm run preview
```

Open the URL printed by Vite, including its `/marathoner/` suffix, and confirm
that the page and its assets load. After deployment, GitHub Pages may take a
short time to serve the new commit.

## Testing

Vitest runs the automated suite in jsdom, which provides a browser-like DOM
without opening a real browser. `src/test/setup.ts` loads the shared DOM
matchers and cleans up rendered React components after every test.

| Test type | Convention |
| --- | --- |
| Unit | Place `*.test.ts` beside a domain or utility module and test its public inputs and outputs. |
| Component | Place `*.test.tsx` beside the component and exercise visible behavior with Testing Library. |
| Service | Test service functions at their public boundary and replace the remote SDK or emulator connection. |
| Integration | Place cross-module flows under `src/test/integration/` when a feature spans components, services, and persistence. |

When writing tests:

- Prefer accessible roles and names over CSS selectors or implementation
  details.
- Use `userEvent` for typing, clicking, and selecting so tests resemble real
  interaction.
- Mock modules in `src/services/` from component tests instead of mocking
  Firebase inside each component.
- Mock animation timing only when the test is about application behavior rather
  than the animation itself.
- Keep each test focused on one observable behavior and give it a description
  that explains the expected outcome.

The current suite covers the initial App screen and section transitions,
calendar week selection and workout details, shoe creation and run logging,
authentication error states, and the sample analytics summary.

Known testing boundaries remain visible:

- App transition tests report the nested-button warning tracked in
  [issue #1](https://github.com/tulloch022/marathoner/issues/1).
- Firebase SDK integration and persistent user data will need integration tests
  as [issue #5](https://github.com/tulloch022/marathoner/issues/5) and
  [issue #12](https://github.com/tulloch022/marathoner/issues/12) are built.
- Analytics assertions currently describe sample values until
  [issue #13](https://github.com/tulloch022/marathoner/issues/13) connects them
  to training data.

## Validate a change

Before opening a pull request, run:

```bash
npm run lint
npm test
npm run build
```

Use `npm run preview` when the change affects browser behavior or production
asset paths. Add or update focused tests whenever behavior changes.

## Contributing workflow

Every repository change starts from an open issue and reaches `main` through a
pull request. Include `Closes #<issue-number>`, `Fixes #<issue-number>`, or
`Resolves #<issue-number>` in the pull request description so GitHub can verify
the relationship.
