# OrbitTrack Backend 🛰️

Express.js REST API & Socket.io real-time server for the OrbitTrack project management platform.

---

## Tech Stack

| Technology | Version | Purpose |
|:---|:---:|:---|
| **Node.js** | v20+ | Runtime |
| **Express.js** | 5.x | HTTP framework |
| **Prisma** | 7.10 | ORM with `@prisma/adapter-pg` |
| **PostgreSQL** | Neon (Cloud) | Primary database |
| **Socket.io** | 4.8 | WebSocket real-time layer |
| **Zod** | 4.x | Input validation |
| **node-cron** | 4.x | Scheduled background jobs |
| **jsonwebtoken** | 9.x | JWT auth (access + refresh) |
| **bcryptjs** | 3.x | Password hashing |
| **TypeScript** | 7.x | Type safety |

---

## Project Structure

```
backend/
├── schema/
│   └── schema.prisma          # Database schema (models, enums, indexes)
├── src/
│   ├── app/
│   │   ├── app.ts             # Express app setup (CORS, routes, error handler)
│   │   ├── configs/           # Configuration files
│   │   ├── controllers/       # Route handler logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── client.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── activity.controller.ts
│   │   ├── jobs/
│   │   │   └── overdueTask.job.ts    # node-cron scheduler
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts     # JWT verification
│   │   │   ├── role.middleware.ts     # Role-based access control
│   │   │   └── validate.middleware.ts # Zod request validation
│   │   ├── routes/            # Express route definitions
│   │   ├── utils/             # Token, password, notification helpers
│   │   └── validations/       # Zod schemas for all endpoints
│   ├── common/
│   │   └── utils/
│   │       ├── ApiError.ts           # Structured error class
│   │       ├── ApiResponse.ts        # Consistent response formatter
│   │       ├── GlobalErrorHandler.ts # Express error middleware
│   │       └── envSanitization.ts    # Zod env var validation
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── socket.ts          # Socket.io server, rooms, broadcasts
│   ├── scripts/
│   │   └── seed.ts            # Database seed script
│   ├── types/                 # TypeScript type extensions
│   └── index.ts               # Server entry point
├── .env.local                 # Environment variable template
├── package.json
└── tsconfig.json
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---:|:---|
| `POST` | `/register` | ❌ | Register new user |
| `POST` | `/login` | ❌ | Login with email/password |
| `POST` | `/refresh` | 🍪 | Rotate access token via refresh cookie |
| `POST` | `/logout` | 🍪 | Revoke refresh token |
| `GET` | `/me` | 🔑 | Get current user profile |
| `GET` | `/team` | 🔑 | Get all team members |

### Clients (`/api/clients`)

| Method | Endpoint | Auth | Roles | Description |
|:---|:---|:---:|:---:|:---|
| `POST` | `/` | 🔑 | Admin, PM | Create client |
| `GET` | `/` | 🔑 | Admin, PM | List all clients |
| `GET` | `/:id` | 🔑 | Admin, PM | Get client by ID |
| `PUT` | `/:id` | 🔑 | Admin, PM | Update client |
| `DELETE` | `/:id` | 🔑 | Admin, PM | Delete client |

### Projects (`/api/projects`)

| Method | Endpoint | Auth | Roles | Description |
|:---|:---|:---:|:---:|:---|
| `POST` | `/` | 🔑 | Admin, PM | Create project |
| `GET` | `/` | 🔑 | All | List projects (scoped by role) |
| `GET` | `/:id` | 🔑 | All | Get project (access checked) |
| `PUT` | `/:id` | 🔑 | Admin, PM | Update project |
| `DELETE` | `/:id` | 🔑 | Admin, PM | Delete project |

### Tasks (`/api/tasks`)

| Method | Endpoint | Auth | Roles | Description |
|:---|:---|:---:|:---:|:---|
| `POST` | `/project/:projectId` | 🔑 | Admin, PM | Create task in project |
| `GET` | `/` | 🔑 | All | List tasks (filtered, role-scoped) |
| `GET` | `/:id` | 🔑 | All | Get task by ID (access checked) |
| `PATCH` | `/:id/status` | 🔑 | All | Update task status only |
| `PATCH` | `/:id` | 🔑 | Admin, PM | Update task properties |
| `DELETE` | `/:id` | 🔑 | Admin, PM | Delete task |

### Activity Feed (`/api/activities`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---:|:---|
| `GET` | `/` | 🔑 | Get activity feed (role-scoped, last 20) |
| `GET` | `/project/:projectId` | 🔑 | Get project-specific activity |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Auth | Roles | Description |
|:---|:---|:---:|:---:|:---|
| `GET` | `/admin` | 🔑 | Admin | Admin metrics + live user count |
| `GET` | `/pm` | 🔑 | Admin, PM | PM project summary |
| `GET` | `/developer` | 🔑 | Developer | Developer task list |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---:|:---|
| `GET` | `/` | 🔑 | Get notifications (with optional `unreadOnly` filter) |
| `GET` | `/unread-count` | 🔑 | Get unread notification count |
| `PATCH` | `/:id/read` | 🔑 | Mark single notification as read |
| `PATCH` | `/read-all` | 🔑 | Mark all notifications as read |

> 🔑 = Bearer token required | 🍪 = HttpOnly cookie required | ❌ = Public

---

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|:---|:---|:---|
| `project:join` | `{ projectId }` | Join a project's live room |
| `project:leave` | `{ projectId }` | Leave a project's room |
| `presence:get` | — | Request current online user count (admin only) |

### Server → Client

| Event | Payload | Description |
|:---|:---|:---|
| `activity:new` | `ActivityBroadcastPayload` | New activity log entry |
| `task:status_updated` | `TaskStatusUpdatedPayload` | Task status changed |
| `notification:new` | `{ notification, unreadCount }` | New in-app notification |
| `presence:count` | `{ activeUsersCount }` | Live online user count |
| `project:joined` | `{ projectId }` | Confirmation of room join |
| `project:left` | `{ projectId }` | Confirmation of room leave |

---

## Middleware Pipeline

Every protected request flows through:

```
Request → CORS → JSON Parser → Cookie Parser
  → authenticateJwt (verify access token, attach req.user)
    → authorizeRoles (check role against allowed roles)
      → validateBody (Zod schema validation)
        → Controller (business logic)
          → ApiResponse (structured JSON)
```

All errors are caught by `GlobalErrorHandler` → returns structured `{ success: false, message }` — never raw stack traces.

---

## Background Jobs

### Overdue Task Scheduler

- **Library**: `node-cron`
- **Schedule**: Every minute (`* * * * *`)
- **Logic**: Finds all tasks where `dueDate < NOW() AND isOverdue = false AND status != DONE`, sets `isOverdue = true`, creates an activity log entry, and broadcasts via WebSocket.

---

## Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `PORT` | No | Server port (default: `8000`) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | **Yes** | Secret for signing access tokens (min 16 chars) |
| `JWT_REFRESH_SECRET` | **Yes** | Secret for signing refresh tokens (min 16 chars) |
| `ACCESS_TOKEN_EXPIRES_IN` | No | Access token TTL (default: `15m`) |
| `REFRESH_TOKEN_EXPIRES_IN` | No | Refresh token TTL (default: `7d`) |
| `CLIENT_ORIGIN` | No | Frontend URL for CORS (default: `http://localhost:3000`) |
| `NODE_ENV` | No | Environment mode (default: `development`) |

---

## Running Independently

```bash
cd backend
pnpm install

# Copy env template and fill in values
cp .env.local .env

# Push schema to database
pnpm exec prisma db push --schema=schema/schema.prisma

# Generate Prisma client
pnpm run prisma:generate

# Seed database
pnpm run seed

# Start dev server
pnpm run dev
```
