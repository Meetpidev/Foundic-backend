# Foundic Execution OS — Backend

Backend service for **Foundic Execution OS** — a platform that connects Founders and Companies with verified Experts to diagnose business problems and execute solutions through a structured Execution Workspace.

Built with **Node.js, Express.js, JavaScript, Prisma ORM, and Neon (Serverless PostgreSQL)**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Authentication & Roles](#authentication--roles)
- [Real-time Events (Socket.io)](#real-time-events-socketio)
- [Background Jobs](#background-jobs)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 4 |
| Language | JavaScript (CommonJS) |
| ORM | Prisma 7.9.1 (with `@prisma/adapter-pg` driver adapter) |
| Database | Neon — Serverless PostgreSQL |
| Cache / Queues | Redis (Upstash) + BullMQ |
| Realtime | Socket.io |
| Auth | JWT (access + refresh) + bcrypt + OTP + TOTP (2FA) |
| Email | Nodemailer (SMTP) |
| Validation | Zod |

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** (comes with Node)
- A **Neon** account and project → [neon.tech](https://neon.tech)
- A **Redis** instance (e.g. free tier on [Upstash](https://upstash.com))
- An **SMTP** provider for emails (e.g. Gmail App Password, Resend, SendGrid)

---

## Getting Started

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd foundic/backend

# 2. Install dependencies
npm install

# 3. Copy the example env file and fill in your values
cp .env.example .env

# 4. Generate the Prisma Client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Start the development server
npm run dev
```

The server will start on `http://localhost:5000` by default (or whatever `PORT` you set).

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```dotenv
# Server
PORT=5000
NODE_ENV=development

# Database (Neon)
DATABASE_URL="postgresql://<user>:<password>@<host>-pooler.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=30"
DIRECT_URL="postgresql://<user>:<password>@<host>.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=30"

# JWT
JWT_ACCESS_SECRET=your-strong-access-secret
JWT_REFRESH_SECRET=your-strong-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Redis (Upstash or local)
REDIS_URL="redis://default:<password>@<host>:<port>"

# SMTP (email OTP, password reset)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> **Note:** `DATABASE_URL` is the **pooled** connection (used by the running app). `DIRECT_URL` is the **unpooled** connection (used by Prisma CLI for migrations).

---

## Folder Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Data model definitions
│   └── migrations/            # Generated SQL migration history
├── generated/
│   └── prisma/                # Prisma Client output (Prisma 7 custom output path)
├── src/
│   ├── config/
│   │   ├── env.js             # Centralized environment variable access
│   │   ├── db.js              # Prisma Client singleton (with driver adapter)
│   │   └── redis.js           # Redis connection (ioredis)
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── rbac.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── otp.js
│   ├── modules/
│   │   ├── auth/               # Login, signup, OTP, 2FA, password reset
│   │   ├── founder/             # Dashboard, health check, problems
│   │   ├── company/             # Company profile & journey
│   │   ├── expert/               # Registration, approval pipeline, dashboard
│   │   ├── matching/             # AI matching engine
│   │   ├── proposal/             # Proposal & agreement engine
│   │   ├── execution/            # Workspace, tasks, sprints, meetings
│   │   ├── notifications/        # In-app notifications
│   │   └── revenue/               # Invoices, payments, earnings
│   ├── jobs/
│   │   └── queue.js              # BullMQ queues & workers (AI diagnosis, etc.)
│   ├── app.js                    # Express app setup (middleware, routes)
│   └── server.js                 # HTTP + Socket.io server entry point
├── prisma.config.js               # Prisma 7 CLI configuration
├── package.json
└── .env
```

---

## Database

The schema is defined in `prisma/schema.prisma` and covers 15 product modules, including:

- **Identity**: `User`, `FounderProfile`, `CompanyProfile`, `ExpertProfile`
- **Problem & Matching**: `Problem`, `ProblemDiagnosis`, `ExpertMatch`
- **Proposal & Execution**: `Proposal`, `Project`, `ExecutionPlan`, `Milestone`, `Task`, `Sprint`, `DailyUpdate`, `Meeting`
- **Communication & Knowledge**: `Document`, `Message`, `Notification`, `Playbook`, `Course`, `Certificate`
- **Revenue & Trust**: `Invoice`, `Payment`, `ExpertEarning`, `Rating`, `AdminLog`

### Common Prisma commands

| Command | Purpose |
|---|---|
| `npx prisma generate` | Regenerate the Prisma Client after any schema change |
| `npx prisma migrate dev --name <name>` | Create + apply a new migration (development) |
| `npx prisma migrate deploy` | Apply existing migrations only (production/CI) |
| `npx prisma studio` | Open a visual database browser |

---

## Available Scripts

```bash
npm run dev              # Start server with nodemon (auto-reload)
npm start                # Start server in production mode
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Deploy migrations (production)
npm run prisma:studio    # Open Prisma Studio
```

---

## API Reference

All endpoints are prefixed with `/api/v1`. Protected routes require a `Bearer <accessToken>` header.

### Auth — `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/signup` | Register a new Founder / Company / Expert | Public |
| POST | `/verify-otp` | Verify signup OTP | Public |
| POST | `/login` | Log in with email + password | Public |
| POST | `/2fa/verify` | Verify TOTP code (if 2FA enabled) | Public |
| POST | `/2fa/enable` | Enable 2FA for the current user | Authenticated |
| POST | `/forgot-password` | Request a password reset link | Public |
| POST | `/reset-password` | Reset password using token | Public |

### Founder — `/api/v1/founder` *(role: FOUNDER)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Health score, active problems/projects |
| POST | `/health-check` | Submit business health check answers |
| POST | `/problems` | Create a new problem (triggers AI diagnosis) |
| GET | `/problems/:id` | Get problem details + diagnosis + matches |

### Company — `/api/v1/company` *(role: COMPANY)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get company profile |
| PUT | `/profile` | Update company profile |
| GET | `/projects` | List company's projects |

### Expert — `/api/v1/experts`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register/update expert profile | EXPERT |
| GET | `/opportunities` | View suggested project matches | EXPERT |
| PATCH | `/:id/status` | Move expert through approval pipeline | FOUNDIC_TEAM / ADMIN |

### Matching — `/api/v1/matching` *(role: FOUNDIC_TEAM / ADMIN)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/:problemId/run` | Run the matching engine for a problem |

### Proposal — `/api/v1/proposals`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create a proposal | FOUNDIC_TEAM / EXPERT |
| POST | `/:id/approve` | Approve proposal → creates Project | FOUNDER |

### Execution — `/api/v1/projects` *(authenticated)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:id/workspace` | Get execution plan, milestones, tasks |
| GET | `/:id/progress` | Progress dashboard summary |
| GET | `/:id/tasks` | List all tasks |
| POST | `/:id/tasks` | Create a task |
| PATCH | `/tasks/:taskId` | Update task status/completion |
| POST | `/:id/sprints` | Create a sprint |
| POST | `/:id/daily-updates` | Submit a daily update |
| POST | `/:id/meetings` | Schedule a meeting |

### Notifications — `/api/v1/notifications` *(authenticated)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List notifications for the current user |
| PATCH | `/:id/read` | Mark a notification as read |

### Revenue — `/api/v1/revenue`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/webhook` | Payment gateway webhook | Public (signature verified) |
| POST | `/:projectId/invoices` | Create an invoice | FOUNDIC_TEAM / ADMIN |
| GET | `/:projectId/invoices` | List invoices for a project | Authenticated |

---

## Authentication & Roles

The platform supports 5 user roles:

- **FOUNDER** — creates problems, approves proposals/milestones
- **COMPANY** — company profile, views projects
- **EXPERT** — registers, gets matched, executes projects
- **FOUNDIC_TEAM** — reviews problems, runs matching, approves proposals
- **ADMIN** — full platform access

Access control is enforced via:
1. `authMiddleware` — verifies the JWT and attaches `req.user`
2. `rbac(...roles)` — restricts a route to specific roles

Example:
```js
router.post("/problems", authMiddleware, rbac("FOUNDER"), controller.createProblem);
```

---

## Real-time Events (Socket.io)

Connect with a JWT in the handshake:
```js
const socket = io(SERVER_URL, { auth: { token: accessToken } });
```

| Event (client → server) | Payload | Description |
|---|---|---|
| `project:join` | `projectId` | Join a project's chat room |
| `project:message` | `{ projectId, content, attachments }` | Send a chat message |

| Event (server → client) | Payload | Description |
|---|---|---|
| `project:message` | message object | New chat message broadcast |
| `notification` | notification object | Real-time notification push |

---

## Background Jobs

Powered by **BullMQ** (Redis-backed):

| Queue | Purpose |
|---|---|
| `ai-diagnosis` | Runs AI diagnosis on newly submitted problems (async, non-blocking) |

Jobs are enqueued from services (e.g. `founder.service.js`) and processed by workers in `src/jobs/queue.js`.

---

## PostMan Api collection

Copy This in your browser:
```bash
https://catalyst-coders.postman.co/workspace/vehical~c9ef7af5-99a4-40cc-9168-6814a6da4de0/collection/43154168-f8e293e0-254b-4b8e-85eb-a0b52cd71a3f?action=share&creator=43154168
```


## Troubleshooting

**`P1001: Can't reach database server`**
- Confirm `DATABASE_URL` (pooled) and `DIRECT_URL` (direct, no `-pooler`) are both set correctly and are *different* hostnames.
- Add `&connect_timeout=30` to both URLs — Neon's free-tier compute sleeps after inactivity and needs a moment to wake up.
- Open the [Neon Console](https://console.neon.tech) once to confirm the project/compute is active, then retry.

**DNS resolving to wrong/unexpected IPs**
- Some ISPs hijack DNS. Switch your network adapter's DNS to `1.1.1.1` / `8.8.8.8` and run `ipconfig /flushdns` (Windows).

**Prisma schema validation errors mentioning `prisma.config.ts`**
- You're on Prisma 7+, which moved connection URLs out of `schema.prisma` into `prisma.config.js`. See `prisma.config.js` in the project root for the required format.

---

## License

Proprietary — Foundic Execution OS. All rights reserved.
