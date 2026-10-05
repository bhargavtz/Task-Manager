# Task Manager

A polished, local-first task manager built with **React + Vite**. Add tasks, mark them complete, delete them, and keep them saved in the current browser.

> This project is intentionally client-side. It does not provide accounts, cloud sync, team collaboration, or a backend yet.

## Why this project

Task Manager is a focused portfolio project demonstrating:

- React component-based UI architecture
- Accessible form and task interactions
- Safe rendering of user-entered task titles
- Validated task records and localStorage persistence
- Unit/component testing with Vitest and React Testing Library
- Browser test setup with Playwright
- Responsive, dependency-light visual design

## Features

- Add a task with a trimmed title
- Complete and reopen tasks
- Delete individual tasks
- Display total and completed task counts
- Persist valid tasks in browser storage under a versioned key
- Detect malformed stored records instead of rendering unsafe data
- Show a visible save-status warning when browser storage is unavailable
- Responsive layout for desktop and mobile screens
- Keyboard-friendly controls and accessible labels
- Reduced-motion support

## Tech stack

- React 19
- Vite 7
- JavaScript (ES modules)
- CSS with local design tokens
- Vitest + React Testing Library
- Playwright for browser-level testing

## Requirements

- Node.js 20+ recommended
- npm 10+ recommended
- A modern browser (Chrome, Edge, Firefox, or Safari)

## Run locally

```bash
git clone https://github.com/bhargavtz/Task-Manager.git
cd Task-Manager
npm ci
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

## Test and build

Run the unit/component suite:

```bash
npm test -- --run
```

Run the production build:

```bash
npm run build
```

Run the Playwright browser suite:

```bash
npx playwright install chromium
npm run test:e2e
```

The browser suite requires the matching Playwright browser binary. If browser installation is blocked in your environment, unit tests and the production build can still be run independently.

## Data and privacy

Tasks are stored locally in the browser on the current device. Clearing browser data can remove them. There is currently no server upload, account system, analytics integration, or cross-device synchronization.

The storage key is versioned as `task-manager:v1`. Invalid or malformed stored data is ignored instead of being rendered.

## Project structure

```text
Task-Manager/
├── index.html
├── src/
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── features/
│       └── tasks/
│           ├── taskModel.js
│           ├── taskModel.test.js
│           ├── taskStorage.js
│           └── taskStorage.test.js
├── tests/
│   ├── setup.js
│   └── e2e/
│       └── tasks.spec.js
├── package.json
├── package-lock.json
├── vite.config.js
├── vitest.config.js
├── playwright.config.js
├── .gitignore
├── LICENSE
└── README.md
```

## Development principles

- Keep the product local-first until a backend requirement is validated.
- Write a failing test before implementing new behavior.
- Keep task validation and storage logic separate from UI rendering.
- Render user input as text; never inject it as raw HTML.
- Run tests and the production build before committing.
- Do not commit secrets or generated dependency/build folders.

## Roadmap

Potential next milestones:

1. Edit task titles and descriptions
2. Priority and due-date controls
3. All / Active / Completed filters
4. Search and deterministic sorting
5. JSON import/export with preview and schema validation
6. CI test workflow
7. Optional backend and authentication only after the local-first product is validated

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
