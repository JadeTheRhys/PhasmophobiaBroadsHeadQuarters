# Phasmophobia Broads HQ Command Center

## Overview
A real-time multiplayer ghost hunting command center for Phasmophobia squads. Features include ghost activity monitoring, evidence tracking, squad coordination, and a cyberpunk sci-fi themed interface.

## Current State
- **Status**: MVP Complete
- **Last Updated**: December 2024
- **Stack**: React + Express + TypeScript

## Architecture

### Frontend (client/)
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query for API calls
- **Routing**: Wouter

### Backend (server/)
- **Framework**: Express.js
- **Storage**: In-memory storage (MemStorage)
- **API**: RESTful endpoints for chat, events, evidence, squad status

### Theme
- **Primary**: Neon Purple (#b71cff)
- **Secondary**: Soft Cyan (#5dfdff)
- **Background**: Deep Black (#0a0a0f)
- **Fonts**: Orbitron (headers), JetBrains Mono (data/logs)

## Key Features

### Ghost Activity Monitor
- EMF bar with 5 levels (color-coded from green to red)
- Hunt trigger button
- Quick action buttons (Flicker, Manifest, Slam)

### Activity Log
- Real-time event logging
- Color-coded by event type (system, event, command, hunt)
- Timestamp display

### Command System
Commands start with `!`:
- `!hunt` - Trigger global hunt event
- `!flicker` - Trigger light flicker
- `!manifest` - Trigger ghost manifestation
- `!slam` - Trigger door slam
- `!dead:NAME` - Mark player as dead
- `!revive:NAME` - Revive player
- `!location:ROOM` - Update player location
- `!evidence:TYPE` - Log evidence

### Data Terminal Tabs
1. **Chat** - Squad communications
2. **Evidence** - Evidence tracker with ghost matching
3. **Ghost Profile** - Database of 24 ghost types
4. **Cases** - Case file gallery with modals
5. **Squad** - Player status and map display
6. **Profile** - User profile editor

## API Endpoints

### Chat
- `GET /api/chat` - Fetch chat messages
- `POST /api/chat` - Send chat message

### Events
- `GET /api/events` - Fetch ghost events
- `POST /api/events` - Create ghost event

### Evidence
- `GET /api/evidence` - Fetch evidence
- `POST /api/evidence` - Add evidence
- `DELETE /api/evidence` - Clear all evidence

### Squad
- `GET /api/squad` - Fetch squad status
- `POST /api/squad/status` - Update player status

### Users
- `GET /api/users/:id` - Fetch user
- `POST /api/users` - Create/update user

## File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── Header.tsx
│   │   ├── EmfBar.tsx
│   │   ├── GhostActivityMonitor.tsx
│   │   ├── ActivityLog.tsx
│   │   ├── CommandInput.tsx
│   │   ├── TabNavigation.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── EvidenceTracker.tsx
│   │   ├── GhostProfile.tsx
│   │   ├── CaseFilesGallery.tsx
│   │   ├── SquadStatus.tsx
│   │   ├── ProfileEditor.tsx
│   │   └── MapDisplay.tsx
│   ├── lib/
│   │   ├── queryClient.ts
│   │   ├── store.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── not-found.tsx
│   ├── App.tsx
│   └── index.css
server/
├── routes.ts
├── storage.ts
└── index.ts
shared/
└── schema.ts (data models, ghost data, map data)
```

## User Preferences
- Dark cyberpunk theme with neon accents
- Orbitron font for headers
- JetBrains Mono for data/logs
- Visual effects on ghost events (flicker, shake)

## Running the Project
The application starts with `npm run dev` which runs both the Express backend and Vite frontend on port 5000.
