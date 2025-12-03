# Phasmophobia Broads HQ Command Center

A real-time multiplayer ghost hunting command center for Phasmophobia squads. Features ghost activity monitoring, evidence tracking, squad coordination, and a cyberpunk sci-fi themed interface.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Real-time**: Firebase (Firestore + Auth)
- **Database**: PostgreSQL with Drizzle ORM (optional - works with in-memory storage)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Firebase project (for real-time features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JadeTheRhys/PhasmophobiaBroadsHeadQuarters.git
   cd PhasmophobiaBroadsHeadQuarters
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - **Firebase credentials are REQUIRED** - get them from [Firebase Console](https://console.firebase.google.com/)
   - `DATABASE_URL` is optional (app uses in-memory storage by default)

4. **Run in development mode**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema (requires DATABASE_URL) |

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and stores
│   │   └── pages/        # Page components
│   └── index.html
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── package.json
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_FIREBASE_API_KEY` | **Yes** | - | Firebase API key |
| `VITE_FIREBASE_PROJECT_ID` | **Yes** | - | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | **Yes** | - | Firebase app ID |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `DATABASE_URL` | No | - | PostgreSQL connection string |

## Features

- **Ghost Activity Monitor**: EMF bar with 5 levels, hunt triggers, quick actions
- **Evidence Tracker**: Log and track evidence to identify ghost types
- **Ghost Database**: Information on all 24 ghost types
- **Squad Status**: Real-time player status and location tracking
- **Chat System**: Team communication with command support
- **Case Files**: Gallery of investigation records

### Commands

Type in the chat panel:
- `!hunt` - Trigger hunt event
- `!flicker` - Trigger light flicker
- `!manifest` - Trigger ghost manifestation
- `!slam` - Trigger door slam
- `!dead:NAME` - Mark player as dead
- `!revive:NAME` - Revive player
- `!location:ROOM` - Update player location
- `!evidence:TYPE` - Log evidence

## Troubleshooting

### Common Issues

**Blank page / Firebase error**
- Ensure you have set the Firebase environment variables in `.env`
- Get credentials from [Firebase Console](https://console.firebase.google.com/) > Project Settings > General > Your apps

**Port already in use**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**TypeScript errors**
```bash
npm run check
```

**Database connection issues**
- Verify `DATABASE_URL` in `.env`
- The app works without a database using in-memory storage

**Build fails**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Deployment

Recommended platforms:
- **Railway**: `railway up`
- **Render**: Connect GitHub repo, set build command to `npm run build`, start command to `npm start`
- **Fly.io**: Use included Dockerfile (create one if needed)

Set `NODE_ENV=production` and configure `PORT` as required by your platform.

## License

MIT
