# OrbitTrack Frontend 🛰️

Next.js 16 dashboard application for the OrbitTrack project management platform.

---

## Tech Stack

| Technology | Version | Purpose |
|:---|:---:|:---|
| **Next.js** | 16.3 | React framework (App Router) |
| **React** | 19.2 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Shadcn UI** | Radix-based | Component library |
| **TanStack Query** | 5.x | Server state management & caching |
| **Socket.io Client** | 4.8 | Real-time WebSocket connection |
| **Axios** | 1.x | HTTP client with interceptors |
| **React Hook Form** | 7.x | Form state management |
| **Zod** | 4.x | Client-side validation schemas |
| **Sonner** | 2.x | Toast notifications |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout (providers, fonts, meta)
│   │   ├── globals.css            # Global styles + CSS variables
│   │   ├── login/                 # Login page
│   │   ├── signup/                # Signup page
│   │   ├── register/              # Register page
│   │   └── dashboard/
│   │       ├── layout.tsx         # Dashboard shell (sidebar, header)
│   │       ├── page.tsx           # Dashboard home (role-based redirect)
│   │       ├── admin/             # Admin dashboard view
│   │       ├── pm/                # PM dashboard view
│   │       ├── developer/         # Developer dashboard view
│   │       ├── projects/          # Projects list & detail
│   │       ├── tasks/             # Tasks list with filters
│   │       └── activity/          # Activity feed page
│   ├── components/
│   │   ├── layout/                # Sidebar, header, navigation
│   │   ├── providers/             # QueryClient, Auth, Socket providers
│   │   ├── ui/                    # Shadcn UI primitives
│   │   ├── activity-feed.tsx      # Real-time activity feed component
│   │   ├── login-form.tsx         # Login form with validation
│   │   └── signup-form.tsx        # Registration form with validation
│   └── lib/
│       ├── api/
│       │   ├── axios.ts           # Axios instance + token interceptor
│       │   ├── auth.ts            # Auth API calls
│       │   ├── dashboard.ts       # Dashboard API calls
│       │   ├── projects.ts        # Projects API calls
│       │   ├── tasks.ts           # Tasks API calls
│       │   └── activity.ts        # Activity feed API calls
│       ├── hooks/                 # Custom React hooks
│       ├── validations/           # Zod form validation schemas
│       ├── socket.ts              # Socket.io client singleton
│       └── utils.ts               # Utility functions
├── .env.local                     # Environment variables
├── components.json                # Shadcn UI configuration
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS + Tailwind
├── package.json
└── tsconfig.json
```

---

## Key Features

### Authentication Flow

- **Login/Register** forms with Zod validation + React Hook Form
- **Access token** stored in memory (`sessionStorage` as fallback) — never in `localStorage`
- **Refresh token** handled via `HttpOnly` cookie (invisible to JS)
- **Axios response interceptor** transparently catches `401`, calls `/auth/refresh`, rotates tokens, and replays the failed request

### Real-Time Integration

- **Socket.io client** connects with JWT auth on handshake
- **Room-based subscriptions**: components join `project:{id}` rooms for live task updates
- **Event listeners**:
  - `activity:new` → live activity feed updates
  - `task:status_updated` → instant task card status sync
  - `notification:new` → real-time notification badge + dropdown
  - `presence:count` → live online user counter (admin dashboard)

### State Management

- **TanStack Query** for all REST API data (caching, stale-while-revalidate, query invalidation)
- **Socket.io events** update query cache directly for real-time sync
- **No Redux/Zustand** — TanStack Query + Socket.io covers all state needs

### Role-Based UI

| Role | Dashboard | Access |
|:---|:---|:---|
| **Admin** | Global metrics, live user count, all projects | Full platform access |
| **PM** | Owned projects, priority breakdown, weekly due dates | Own projects & tasks only |
| **Developer** | Assigned tasks sorted by priority/due date | Own assigned tasks only |

---

## Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API base URL (e.g., `http://localhost:8000/api`) |
| `NEXT_PUBLIC_SOCKET_URL` | **Yes** | Backend Socket.io URL (e.g., `http://localhost:8000`) |

---

## Running Independently

```bash
cd frontend
pnpm install

# Dev server
pnpm run dev
# → http://localhost:3000

# Production build
pnpm run build
pnpm run start
```

> **Note**: The frontend requires the backend server to be running for API calls and WebSocket connections.
