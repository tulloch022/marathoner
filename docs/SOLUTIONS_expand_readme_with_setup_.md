# ✨ Project Documentation Hub: Setup, Architecture, and Development Workflow

Welcome to the comprehensive documentation guide for our project. As an advanced open-source contributor, my goal is to ensure that every developer—from new contributors to seasoned architects—can quickly understand, set up, validate, and deploy this application efficiently and reliably.

---

## 🚀 Getting Started: The Quick Guide

This section guides a new developer through the initial setup required to run the application locally on their machine.

### Prerequisites

Before running any commands, ensure you have the following installed globally:

1.  **Node.js:** Version 18 or higher (LTS recommended).
    *   *(Verification: `node -v`)*
2.  **npm (or yarn):** The Node Package Manager.
3.  **Firebase CLI:** Required for local emulation and deployment validation.
    *   *(Installation: `npm install -g firebase-tools`)*

### 📥 Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone <repository-url> .
    ```
2.  Install all required dependencies defined in `package.json`:
    ```bash
    npm install
    # OR
    yarn install
    ```
3.  Initialize Firebase configuration (if not already done):
    *   Log in via the CLI: `firebase login`
    *   Select or create your target project ID.

---

## 🗺️ Architecture Overview

The application follows a decoupled architecture, separating core logic, state management, and presentation layers.

### High-Level Component Breakdown

| Component | Function | Technology/Framework | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend Client** | User Interface and Presentation Layer. Handles user interactions and API calls. | React / Next.js | Displaying data, routing, capturing input events. |
| **Backend Logic (Core Services)** | The business logic layer that processes raw data into structured insights. Includes `Plan`, `Track`, and `Analyze` modules. | TypeScript / Dedicated Service Files | Implementing complex algorithms, validation, and state transitions. |
| **Data Persistence Layer** | Manages the storage and retrieval of application state and user records. | Firebase Firestore (Primary), Authentication (Firebase Auth) | Ensuring ACID properties for stored data; handling real-time updates. |

### Core Logic Deep Dive

*   **Plan Module:** Responsible for setting initial goals, defining parameters, and generating predicted pathways based on preliminary input data.
*   **Track Module:** Handles real-time data ingestion. It accepts streaming inputs (e.g., telemetry, periodic user status checks) and updates the current state against established plans.
*   **Analyze Module:** The computational heart. This module ingests both historical data (from Firestore) and current tracked data to calculate performance metrics, detect anomalies, and generate actionable insights for the user.

### Authentication Architecture

The application uses **Firebase Authentication**. User identity management is strictly handled by Firebase Auth, providing secure sign-up/login flows without requiring custom credential storage on the client side. All subsequent backend calls are authorized using the authenticated user's ID token.

---

## ⚙️ Environment Configuration & Secrets Management

All external configuration must be managed via environment variables (`.env` file) to prevent accidental exposure of secrets in source control.

### Firebase Configuration Requirements

You must set up your project credentials locally:

1.  **Service Account Key:** Download the JSON service account key for the specific Firestore database you intend to use.
2.  **Environment Variables:** Create a `.env` file in the root directory and populate it with your required keys:

    ```env
    # Firebase Configuration (REQUIRED)
    FIREBASE_PROJECT_ID="your-project-id"
    FIRESTORE_COLLECTION="user_data"
    # Optionally, if running full local emulator stack:
    GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json" 
    ```

> **🚨 Security Notice:** Never commit `.env` files or keys to the repository. Add your `.gitignore` entry for them immediately after creation.

### Data Persistence Limitations (Constraints)

*   **State Management:** The system relies heavily on Firestore's real-time capabilities. Be mindful of excessive read/write operations, as this directly impacts operational costs and potential rate limits.
*   **Read Operations:** Complex queries involving joins or grouping should be refactored into aggregated functions at the application layer (or a dedicated Cloud Function) rather than relying solely on client-side Firestore rules.

---

## 🛠️ Development Workflow Commands

The following commands manage the entire lifecycle, from linting to deployment preview. These scripts are defined in `package.json`.

| Command | Action | Purpose & Details |
| :--- | :--- | :--- |
| `npm run dev` | **Development Server Start** | Starts the full development stack. Compiles TypeScript and launches the client application on `http://localhost:3000`. Ideal for active feature development. Hot module reloading (HMR) is enabled. |
| `npm run lint` | **Static Analysis & Linting** | Runs ESLint, Prettier, and Type Checking against all source files (`/src`). Critical for maintaining code quality and adherence to defined TypeScript standards. |
| `npm run build` | **Production Build Artifacts** | Compiles the entire codebase into optimized static assets (e.g., JavaScript bundles, CSS). This output is deployed artifact-ready and cannot be debugged easily. |
| `npm run preview` | **Local Preview Mode** | Serves the *exact* files generated by `npm run build`. This accurately simulates the production environment locally, catching base-path and asset loading issues before deployment. |
| `npm run test` | **Validation Suite Execution** | Runs Jest/Vitest tests (Unit & Integration). Critical for ensuring feature stability. See "Testing Expectations" below. |
| `npm run deploy` | **Production Deployment** | Executes the deployment flow: 1) Builds the app, 2) Uploads assets to Firebase Hosting/GitHub Pages, and optionally runs post-deployment hooks (e.g., updating API endpoints). |

---

## 📑 Technical Deep Dive & Documentation Standards

### GitHub Pages Base-Path Behavior

When deploying to GitHub Pages, developers must be acutely aware of the repository's base path configuration:

1.  **Root Deployment:** If the repo is hosted at `github.com/user/repo`, the base path is `/`.
2.  **Forked/Subdirectory Deployment:** If the repository is deployed under a specific organization or fork (e.g., `github.com/org/repo`), ensure all assets, images, and internal links use **relative paths (`./assets`)** rather than hardcoded absolute paths (`/assets`).
3.  The build process generally handles this via configuration variables (e.g., `NEXT_PUBLIC_BASE_PATH`), which must be checked before deployment.

### Testing Expectations

As the codebase matures, testing rigor increases:

*   **Unit Tests:** Focus on individual functions and components (`PlanAlgorithmTest.ts`). These tests use mocked dependencies to ensure isolated logic integrity.
*   **Integration Tests:** Simulate end-to-end workflows (e.g., "User signs up $\rightarrow$ Plans goal $\rightarrow$ Tracks data $\rightarrow$ Analyze yields result"). These require connecting multiple services (e.g., frontend $\leftrightarrow$ Firebase mock).

> **💡 Note for Contributors:** New features must include corresponding unit tests *before* the code can be merged to `develop`. Failure to provide adequate coverage will block PR merge.

---
***End of Documentation***