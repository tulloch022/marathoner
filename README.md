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
- ESLint

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

Firebase is currently used for email/password authentication. The web client
configuration is defined in `src/firebaseConfig.ts`, and Firebase is initialized
in `src/services/authService.ts`.

The committed configuration connects the app to its current Firebase project.
To use a different project:

1. Create or select a Firebase project.
2. Register a web app in that project.
3. Enable the **Email/Password** provider under Firebase Authentication.
4. Replace the web client configuration values in `src/firebaseConfig.ts`.

Firebase web configuration identifies a Firebase project; it is not a server
credential. Never commit service-account files, private keys, passwords, or
other secrets.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run lint` | Check the repository with ESLint. |
| `npm run build` | Run TypeScript project checks and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for a final browser check. |
| `npm run predeploy` | Build the application; npm also runs this automatically before `deploy`. |
| `npm run deploy` | Publish the contents of `dist/` to the `gh-pages` branch. |

## Validate a change

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

Use `npm run preview` when the change affects browser behavior or production
asset paths. Automated tests have not been added yet; establishing that test
foundation is tracked in
[issue #14](https://github.com/tulloch022/marathoner/issues/14).

## Contributing workflow

Every repository change starts from an open issue and reaches `main` through a
pull request. Include `Closes #<issue-number>`, `Fixes #<issue-number>`, or
`Resolves #<issue-number>` in the pull request description so GitHub can verify
the relationship.
