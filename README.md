# TaskFlow

TaskFlow is a small, responsive task manager built with React and Vite. Add tasks, keep track of what is in progress, and check off completed work. Your list is saved in your browser so it is still there after a refresh.

## Features

- Add tasks with the button or by pressing Enter.
- Mark tasks as active or completed, and delete tasks you no longer need.
- Filter the list by all, active, or completed tasks.
- See live totals for all, active, and completed tasks.
- Keep tasks between visits with browser `localStorage`.
- Get a helpful empty state and a message when a task name is missing.
- Use the layout on desktop and mobile.

## Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- A modern web browser

## Installation

Clone or download this project, open a terminal in the project folder, and install its dependencies:

```sh
npm install
```

## Start the development server

```sh
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`). To check the production build, run `npm run build`. To check code style, run `npm run lint`.

## Project structure

```text
taskflow-demo/
├── index.html          # Browser page metadata and React mount point
├── package.json        # Project scripts and dependencies
├── public/             # Static public assets
└── src/
    ├── App.jsx         # TaskFlow interface and task behavior
    ├── App.css         # Application layout and responsive styles
    ├── index.css        # Global styles and browser defaults
    └── main.jsx        # React application entry point
```

## Basic customization

- **Colors and layout:** edit `src/App.css`.
- **Base typography and browser defaults:** edit `src/index.css`.
- **Task behavior and interface text:** edit `src/App.jsx`.
- **Browser title and description:** edit `index.html`.

Tasks are stored in the browser under the `taskflow-tasks` localStorage key. Clearing site data in your browser will clear the saved task list.
