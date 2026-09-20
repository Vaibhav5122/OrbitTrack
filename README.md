# OrbitTrack 🛰️

### Real-Time Client Project Management Dashboard with Role-Based Access & Live Activity Feed

> **Technical Hiring Assessment Submission** for **Velozity Global Solutions**  
> Developed by **Vaibhav Waghmode**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7.10-blue?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=flat&logo=postgresql)](https://neon.tech/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat&logo=socket.io)](https://socket.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Radix-black?style=flat)](https://ui.shadcn.com/)

---

## 📸 Screenshots

<p align="center">
  <img src="docs/screenshots/landing-page.png" alt="OrbitTrack Landing Page" width="100%" />
  <em>Landing Page — Hero section with live feature showcase</em>
</p>

<p align="center">
  <img src="docs/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="100%" />
  <em>Admin Dashboard — Global metrics, task status breakdown, live user presence</em>
</p>

<p align="center">
  <img src="docs/screenshots/tasks-page.png" alt="Tasks Management" width="100%" />
  <em>Task Management — Filtered task list with status, priority, and due date controls</em>
</p>

---

## 🌟 Executive Summary

**OrbitTrack** is an enterprise-grade agency client project management platform built to solve client visibility gaps and project status bottlenecks. It delivers:

- **Strict Role-Based Access Control (RBAC)** enforced at the API route middleware and database query levels (Admin, Project Manager, Developer).
- **Socket.io Real-Time Engine**: Instant task status movements, live user presence tracking, and role-scoped activity auditing.
- **Database-Backed Offline Event Catch-Up**: Automatically pulls the last 20 events from PostgreSQL on initial load or reconnect, streaming live events with zero polling.
- **Automated Background Cron Worker**: Runs every minute to flag overdue tasks without loading overhead during user requests.
- **Dual-Token Authentication with HttpOnly Cookies**: Short-lived JWT access tokens (15m) paired with rotating refresh tokens (7d) stored securely in `HttpOnly` cookies.
- **Shadcn Black & White Theme System**: High-contrast dark/light theme (default dark).
- **Render Cold-Start Optimizer**: Non-blocking `/health` background warm-up ensuring fast response times on cloud deployments.

---

## 🏗️ Architectural Overview

```
                               ┌────────────────────────┐
                               │   Next.js 16 Frontend  │
                               │  (App Router + Radix)  │
                               └───────────┬────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        │ REST (Axios Interceptors)            │ WebSocket (Socket.io)
                        ▼                                     ▼
            ┌────────────────────────┐           ┌────────────────────────┐
            │ Express.js API Server  │           │   Socket.io Gateway    │
            │ (Controllers + Zod)    │           │ (Handshake Auth + JWT) │
            └───────────┬────────────┘           └───────────┬────────────┘
                        │                                     │
                        │                                     ├─► admin_room (Presence & Global Feed)
                        │                                     ├─► project:{id} (Live Sync)
                        │                                     └─► user:{id} (Targeted Notifications)
                        ▼
            ┌────────────────────────┐
            │  Prisma ORM 7 Singleton │
            │  (@prisma/adapter-pg)  │
            └───────────┬────────────┘
                        │
                        ▼
            ┌────────────────────────┐
            │   Neon PostgreSQL      │
            │ (Serverless Pooler)    │
            └────────────────────────┘
```

### Relational Database Schema (PostgreSQL)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │  RefreshToken   │       │     Client      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)   │───┐   │ id (PK, UUID)   │       │ id (PK, UUID)   │──┐
│ name            │   └──►│ userId (FK)     │       │ name            │  │
│ email (UQ, IDX) │       │ token (UQ, IDX) │       │ email (UQ)      │  │
│ password        │       │ expiresAt       │       │ company         │  │
│ role (ENUM)     │       │ revoked         │       └─────────────────┘  │
└────────┬────────┘       └─────────────────┘                            │
         │                                                               │
         │ 1:N (Owner)                                                   │ 1:N
         ▼                                                               ▼
┌─────────────────┐ 1:N   ┌─────────────────┐       ┌─────────────────┐
│     Project     │◄──────│      Task       │       │  Notification   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, UUID)   │       │ id (PK, UUID)   │       │ id (PK, UUID)   │
│ name            │       │ title           │       │ userId (FK, IDX)│
│ description     │       │ description     │       │ title           │
│ clientId (FK)   │       │ status (ENUM)   │       │ message         │
│ ownerId (FK)    │       │ priority (ENUM) │       │ isRead (IDX)    │
└─────────────────┘       │ dueDate (IDX)   │       │ link            │
                          │ isOverdue (IDX) │       └─────────────────┘
                          │ projectId (FK)  │
                          │ assignedToId(FK)│
                          └────────┬────────┘
                                   │ 1:N
                                   ▼
                          ┌─────────────────┐
                          │   ActivityLog   │
                          ├─────────────────┤
                          │ id (PK, UUID)   │
                          │ action (STRING) │
                          │ description     │
                          │ projectId (FK)  │
                          │ taskId (FK)     │
                          │ userId (FK)     │
                          │ createdAt (IDX) │
                          └─────────────────┘
```

### Indexing Decisions Explained

- `User(email)`: B-Tree index for $O(1)$ credential lookup during authentication.
- `Task(dueDate, isOverdue)`: Composite index powering the background cron query (`WHERE dueDate < NOW() AND isOverdue = false AND status != 'DONE'`) without full table scans.
- `Task(projectId, status)`: Composite index accelerating status-based column bucketing.
- `Task(assignedToId)`: Foreign key index for instant developer-scoped task fetching.
- `ActivityLog(projectId, createdAt)` & `ActivityLog(userId, createdAt)`: Enables reverse-chronological streaming and the 20-event offline catchup query (`LIMIT 20 ORDER BY createdAt DESC`).
- `Notification(userId, isRead)`: Composite index optimizing the real-time unread badge count query (`COUNT(*) WHERE userId = ? AND isRead = false`).

---

## ⚖️ Architectural Decisions & Justifications

### 1. WebSocket Library: Socket.io vs Native WebSockets

- **Why Socket.io**:
  - **Room Multiplexing**: Native WebSocket requires writing and maintaining a custom room registry and connection cleanup system. Socket.io gives hardened room semantics (`project:{id}`, `user:{id}`, `admin_room`) out of the box.
  - **Automatic Reconnection & Buffered Packets**: Handles tab sleeps, network drops, and mobile reconnects with exponential backoff.
  - **Ping/Pong Heartbeats**: Accurately tracks active user presence without zombie ghost connections.

### 2. Scheduled Background Jobs: `node-cron` vs Bull Queue

- **Why node-cron**:
  - **Zero External Redis Dependency**: Bull requires an active Redis broker, adding deployment fragility and operational costs for small-to-medium agency deployments.
  - **Lightweight In-Process Execution**: `node-cron` runs within the Node process, batch-updating overdue tasks in a single PostgreSQL transaction with `@prisma/adapter-pg`.

### 3. Token Storage Architecture: HttpOnly Cookies vs LocalStorage

- **Why HttpOnly Cookie for Refresh Token**:
  - `localStorage` is vulnerable to Cross-Site Scripting (XSS) token exfiltration.
  - Storing the 7-day refresh token in an `HttpOnly`, `SameSite=Lax`, `Secure` cookie ensures JavaScript cannot read it.
  - The short-lived 15-minute access token is kept in memory/sessionStorage for request headers.
  - The Axios response interceptor silently rotates expired access tokens via `/api/auth/refresh` on `401 Unauthorized`.

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js v20+
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose (optional for local DB)

### 1. Clone Repository

```bash
git clone https://github.com/Vaibhav5122/OrbitTrack.git
cd OrbitTrack
```

### 2. Environment Setup

Copy the template environment files and fill in your values:

**Backend** (`backend/.env`):
```bash
cp backend/.env.local backend/.env
```

Then edit `backend/.env` with your database URL and JWT secrets:

```env
PORT=8000
DATABASE_URL="your_postgresql_connection_string"
JWT_ACCESS_SECRET="your_64_char_hex_secret"
JWT_REFRESH_SECRET="your_64_char_hex_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
CLIENT_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

> **Tip**: Generate JWT secrets with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Frontend** (`frontend/.env.local`) — already configured for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

### 3. Install & Seed

```bash
# Backend setup & seed
cd backend
pnpm install
pnpm run seed

# Frontend setup
cd ../frontend
pnpm install
```

After seeding, the terminal will display all seeded user credentials. All seeded accounts use the password `Password123!`.

### 4. Run Development Servers

In Terminal 1:
```bash
cd backend && pnpm run dev
# Running at http://localhost:8000
```

In Terminal 2:
```bash
cd frontend && pnpm run dev
# Running at http://localhost:3000
```

Visit **http://localhost:3000** in your browser.

---

## 🐳 Optional Local Docker Setup

To run an offline local PostgreSQL database instead of Neon Cloud:

```bash
docker compose up -d
# Runs PostgreSQL on port 5432
```

Update `DATABASE_URL` in your `backend/.env`:

```
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/orbittrack?schema=public"
```

Then push schema and seed:

```bash
cd backend
pnpm exec prisma db push --schema=schema/schema.prisma
pnpm run seed
```

---

## 🧪 Seed Data Summary

The seed script (`pnpm run seed`) creates:

| Entity | Count | Details |
|:---|:---:|:---|
| **Users** | 7 | 1 Admin, 2 Project Managers, 4 Developers |
| **Clients** | 2 | Sahyadri Infotech, Mumbai FinTech |
| **Projects** | 3 | 6, 5, and 5 tasks respectively |
| **Tasks** | 16 | Across all statuses including 2 pre-overdue |
| **Activity Logs** | 10 | Pre-existing feed entries |
| **Notifications** | 5 | Mix of read/unread |

---

## 📝 Assessment Submission Explanation (150–250 Words)

> **Copy-paste ready for the assessment submission portal** (`https://bit.ly/4bGXmZV`):

```text
The most challenging engineering hurdle in OrbitTrack was achieving reliable, multi-client real-time synchronization while upholding strict, zero-trust Role-Based Access Control without resorting to polling. 

To solve this, I designed a room-multiplexed Socket.io architecture where client handshakes authenticate via JWT claims. Connected sockets automatically join scoped rooms: admins join `admin_room`, while users join `user:{userId}` and authorized `project:{projectId}` channels. When a developer transitions a task, the server commits the update, creates an immutable database ActivityLog, and broadcasts atomic payloads to the relevant project room and assigned user rooms. To guarantee integrity when clients reconnect or experience network drops, the application bypasses in-memory caches and performs an indexed PostgreSQL query to fetch the last 20 events, subsequently appending live incoming socket events seamlessly.

Furthermore, I addressed the dual-token lifecycle by placing the 7-day refresh token in an HttpOnly cookie and implementing an Axios response interceptor that transparently captures 401 statuses, rotates the token pair, updates the Socket.io authentication state, and replays failed queries without disrupting the user experience.

If I were to build this differently at greater scale, I would integrate a Redis Pub/Sub adapter (socket.io-redis) to decouple socket state from a single Node.js instance, enabling horizontal scaling across multiple containerized worker pods behind a load balancer.
```

---

## ⚠️ Known Limitations

1. **Serverless PostgreSQL Cold Starts**: Free-tier cloud databases may experience slight latency on the very first query after prolonged inactivity. We mitigate this using our non-blocking frontend `/health` warmup.
2. **Single-Node Socket.io State**: In-process memory handles user connection counts. For distributed multi-server clusters, an external Redis adapter is required.

---

## 📄 License

MIT License. Developed for Velozity Global Solutions Technical Hiring Assessment.
