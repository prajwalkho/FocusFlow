# FocusFlow Productivity

FocusFlow is a full-stack productivity web app designed to help users organize tasks, track focus time, and stay accountable with Pomodoro-style work sessions. It combines secure user authentication, task management, analytics, and a modern responsive UI.

## Project Overview

FocusFlow delivers a polished productivity experience by letting users:
- register and log in with secure authentication
- create, filter, and manage tasks by priority, category, deadline, and completion status
- use an integrated Pomodoro timer to power focus sessions and log productivity automatically
- review weekly productivity metrics for focus time and completed tasks

This project is ideal for showcasing full-stack skills in React, TypeScript, Tailwind CSS, Express, and SQLite.

## Key Features

- User authentication with JWT and persistent session state
- Task creation, editing, completion toggling, deletion, search, and category filtering
- Pomodoro timer with work/break states and automatic productivity logging
- Dashboard visualizations for recent focus sessions and completed task trends
- Mobile-friendly responsive interface with accessible design patterns

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Express, Node.js, TypeScript
- Database: SQLite via better-sqlite3
- Auth: bcryptjs for password hashing, jsonwebtoken for JWTs
- Charts: Recharts for analytics visualizations
- UI icons and animation: lucide-react, motion, clsx

## How It Works

- `AuthPage` handles login and registration
- `AuthContext` stores auth state and protects the app
- `Dashboard` pulls productivity stats and displays analytics cards and charts
- `TasksPage` supports task search, filters, and CRUD operations through API calls
- `PomodoroPage` includes a timer and logs focus minutes via `/api/productivity/log-focus`
- `server.ts` manages API routes, token validation, and data persistence in SQLite

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set a secret for authentication in your environment:
   `JWT_SECRET=your_secret_key`
3. Run the app:
   `npm run dev`

> Note: The backend uses `JWT_SECRET` for token signing. Ensure the environment variable is available when starting the server.

## LinkedIn Presentation Guide

### 1. Write a strong project description

- Start with the problem: e.g. "A productivity dashboard that helps users focus with task tracking and Pomodoro sessions."
- Explain the solution: mention secure auth, task management, focus timer, and analytics.
- Keep it concise and user-focused: 2-3 sentences that explain what the app does and why it matters.

### 2. Highlight technical skills and impact

- Mention the stack clearly: React, TypeScript, Tailwind CSS, Express, SQLite, JWT.
- Highlight what you built: authentication flows, REST API, interactive charts, Pomodoro logging.
- Add impact statements: "Improved focus tracking by combining time logging with productivity analytics."

### 3. Sections to include

- Summary: one strong sentence about the app purpose
- Features: bullet points for task management, timer, analytics, auth
- Tech Stack: list core technologies and tools
- Challenges: describe one or two technical challenges you solved (e.g. auth flow, real-time timer state, analytics data handling)
- Outcomes: what the app now enables, or what you learned

### 4. Best practices for formatting and engagement

- Use short paragraphs and bullets for readability
- Bold the most important achievements and technologies
- Include a screenshot, video clip, or link if available
- Add a call-to-action like "Open-source demo available" or "Built with React and Express"

### 5. Tips to stand out to recruiters and developers

- Emphasize your ownership: "Designed and built the full stack architecture..."
- Focus on measurable outcomes: "Implemented analytics dashboard for weekly progress tracking."
- Mention collaboration or learning: "Used TypeScript end-to-end and optimized secure user sessions."
- Keep the tone professional, concrete, and results-oriented.

## Example LinkedIn Summary

"Built FocusFlow, a full-stack productivity app using React, TypeScript, Tailwind CSS, Express, and SQLite. Users can manage tasks, run Pomodoro sessions, and review weekly productivity analytics with secure JWT authentication. This project demonstrates end-to-end app design, REST API implementation, and responsive UI development."
