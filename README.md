# Yasir Ali Classes — Rankers Meet 2026
### Official Digital Registration, QR Ticketing, Real-Time Check-In & Attendance Platform

A high-performance full-stack web application designed and built for **Yasir Ali Classes** to streamline student felicitations for NEET, JEE Main/Advanced, CUET, Commerce, and Board toppers.

---

## Table of Contents

1. [Platform Architecture](#platform-architecture)
2. [Monorepo Structure](#monorepo-structure)
3. [Connection & Environment Variables Guide](#connection--environment-variables-guide)
   - [Backend Configuration (`server/.env`)](#backend-configuration-serverenv)
   - [Frontend Configuration (`client/.env`)](#frontend-configuration-clientenv)
4. [Default Seeded Credentials](#default-seeded-credentials)
5. [Local Development Setup](#local-development-setup)
6. [Production Deployment Guide](#production-deployment-guide)
   - [1. Database: MongoDB Atlas Setup](#1-database-mongodb-atlas-setup)
   - [2. Backend Deployment (Render / Railway / AWS / VPS)](#2-backend-deployment-render--railway--aws--vps)
   - [3. Frontend Deployment (Vercel / Netlify)](#3-frontend-deployment-vercel--netlify)
   - [4. Email Service: Resend Configuration](#4-email-service-resend-configuration)
   - [5. Custom Domain & DNS Mapping](#5-custom-domain--dns-mapping)
7. [API Route Reference](#api-route-reference)
8. [Socket.IO Real-Time Events](#socketio-real-time-events)
9. [Automated Verification Scripts](#automated-verification-scripts)
10. [Security & Concurrency Guarantees](#security--concurrency-guarantees)

---

## Platform Architecture

- **Frontend**: React 18, Vite, TailwindCSS, React Hook Form, Zod, Html5-Qrcode, Recharts, Lucide Icons, Socket.IO Client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO Server, JWT, Bcrypt, Helmet, Express Rate Limit, json2csv, xlsx (SheetJS).
- **Email Service**: Resend API (`resend` SDK) with automated fallback mock mode.
- **Ticketing & Check-In**: Cryptographic 32-byte hex QR tokens with procedural Web Audio API feedback (Success, Duplicate, Error).

---

## Monorepo Structure

```
Rankers-Meet/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/client.js       # Axios instance with auth interceptor
│   │   ├── components/         # Reusable UI cards, layout, navbar
│   │   ├── context/            # AuthContext & SocketContext
│   │   ├── pages/              # 9 Core Pages (Landing, Register, Ticket, Scanner, etc.)
│   │   └── utils/              # Sound synthesizer & sound effects
│   ├── .env.example            # Template for frontend environment variables
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express + Socket.IO Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── controllers/        # Express route handlers
│   │   ├── middleware/         # JWT auth, RBAC guards
│   │   ├── models/             # Mongoose schemas (Registration, Admin, Checkin, EventSetting)
│   │   ├── routes/             # REST endpoint routers
│   │   ├── services/           # Business logic & email dispatch
│   │   ├── utils/              # Database seeder
│   │   ├── server.js           # Express app & HTTP/Socket server entry
│   │   └── socket.js           # Socket.IO broadcasting logic
│   ├── .env.example            # Template for backend environment variables
│   ├── package.json
│   ├── final_event_simulation.js # 50-attendee pre-event concurrency test
│   ├── test_api.js             # Core API validation test
│   ├── test_qr_checkin.js      # Concurrency & QR scan test
│   └── test_reporting_export.js # CSV & XLSX export test
├── docs/                       # Project documentation & PRD modules (01 to 14)
├── .gitignore                  # Git protection (strictly ignores .env)
└── README.md                   # This deployment & connection guide
```

---

## Connection & Environment Variables Guide

### Backend Configuration (`server/.env`)

Create a file named `.env` inside the `server/` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/rankers_meet

# JWT Secret Key (Use a strong 64+ character random string for production)
JWT_SECRET=super_secret_rankers_meet_jwt_key_2026_yasir_ali_classes

# Resend API Key (Get from https://resend.com/api-keys)
# If left empty, the server automatically operates in safe mock mode without crashing
RESEND_API_KEY=re_your_api_key_here

# Verified Sender Email Address in Resend
EMAIL_FROM=Rankers Meet 2026 <no-reply@yasiraliclasses.in>

# Frontend Client URL (For CORS whitelist & email verification links)
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`client/.env`)

Create a file named `.env` inside the `client/` directory:

```env
# Backend REST API Base URL
VITE_API_URL=http://localhost:5000/api

# Backend Socket.IO WebSocket Server URL
VITE_SOCKET_URL=http://localhost:5000
```

> [!IMPORTANT]
> In production, change `http://localhost:5000` to your actual backend domain (e.g. `https://api.yasiraliclasses.in`).

---

## Default Seeded Credentials

When the backend starts, it automatically seeds two official staff accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@yasiraliclasses.in` | `Admin@12345` | Full platform access (Dashboard, Directory, QR Check-in, Exports, Event Settings) |
| **Gate Staff** | `staff@yasiraliclasses.in` | `Staff@12345` | Operational access (Dashboard, Directory, QR Check-in Scanner, Exports; Settings are restricted) |

---

## Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB community server running on port `27017`, or a MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/yasiraliclasses/Rankers-Meet.git
cd Rankers-Meet

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Files
- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

### 3. Launch Development Servers

**Terminal 1: Start Backend**
```bash
cd server
npm run dev
# Server runs at http://localhost:5000
# Database automatically connects & seeds default settings and admin accounts
```

**Terminal 2: Start Frontend**
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Access the Application
- **Public Landing Page**: [http://localhost:5173/rankers-meet](http://localhost:5173/rankers-meet)
- **Student Registration**: [http://localhost:5173/rankers-meet/register](http://localhost:5173/rankers-meet/register)
- **Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Gate Check-in Scanner**: [http://localhost:5173/admin/check-in](http://localhost:5173/admin/check-in)

---

## Production Deployment Guide

```
+-----------------------------------------------------------------------------------+
|                                 DNS / DOMAINS                                     |
|     yasiraliclasses.in/rankers-meet                     api.yasiraliclasses.in    |
+------------------------------------+----------------------------------------------+
                                     |                                              |
                                     v                                              v
                      +-----------------------------+               +-------------------------------+
                      |     Frontend (Vercel)       |               |       Backend (Render/Node)   |
                      |   React 18 + Vite SPA       | -- HTTPS ---> |   Express API + Socket.IO     |
                      +-----------------------------+ <== WebSock = +-------------------------------+
                                                                                    |
                                                                +-------------------+-------------------+
                                                                |                                       |
                                                                v                                       v
                                                +-------------------------------+       +-------------------------------+
                                                |       MongoDB Atlas           |       |          Resend API           |
                                                |     Cloud Cluster (M0/M10)    |       |   Automated Ticket Dispatch   |
                                                +-------------------------------+       +-------------------------------+
```

### 1. Database: MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (Shared M0 or Dedicated M10+).
3. Under **Database Access**, create a user (e.g. `rankers_admin`) with Read/Write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) or whitelist your hosting provider's IP range.
5. Click **Connect** -> **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://rankers_admin:<PASSWORD>@cluster0.xxxxx.mongodb.net/rankers_meet?retryWrites=true&w=majority
   ```

### 2. Backend Deployment (Render / Railway / AWS / VPS)

#### Option A: Render (Recommended)
1. Create a **New Web Service** linked to your Git repository.
2. Set **Root Directory** to `server`.
3. Configure Build and Start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add the following **Environment Variables** in Render:
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://rankers_admin:...@cluster0...`
   - `JWT_SECRET` = `<Generate a secure 64-character random string>`
   - `RESEND_API_KEY` = `re_...`
   - `EMAIL_FROM` = `Rankers Meet 2026 <no-reply@yasiraliclasses.in>`
   - `CLIENT_URL` = `https://yasiraliclasses.in`
5. Note your Render URL (e.g. `https://rankers-meet-api.onrender.com` or custom domain `https://api.yasiraliclasses.in`).

### 3. Frontend Deployment (Vercel / Netlify)

#### Option A: Vercel (Recommended)
1. Import your Git repository into Vercel.
2. Select **Root Directory** as `client`.
3. Framework Preset: **Vite**.
4. Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Configure **Environment Variables** in Vercel:
   - `VITE_API_URL` = `https://api.yasiraliclasses.in/api`
   - `VITE_SOCKET_URL` = `https://api.yasiraliclasses.in`
6. Add SPA Rewrite Rule (`vercel.json` in `client/`):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### 4. Email Service: Resend Configuration
1. Sign up at [Resend](https://resend.com) and navigate to **Domains**.
2. Add your domain: `yasiraliclasses.in`.
3. Add the required DNS records (DKIM, SPF, and MX) in your domain registrar (GoDaddy, Cloudflare, Namecheap).
4. Create an API Key with `Full Access` and save it to `server/.env` as `RESEND_API_KEY`.
5. Verify test dispatch by registering a candidate; confirmation emails with styled ticket details will be delivered instantly.

### 5. Custom Domain & DNS Mapping

| Record Type | Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **CNAME** | `api` | `rankers-meet-api.onrender.com` | Backend REST API & Socket.IO |
| **CNAME** | `@` / `www` | `cname.vercel-dns.com` | Public Frontend Application |
| **TXT** | `resend._domainkey` | *Provided by Resend* | DKIM email authentication |
| **TXT** | `@` | `v=spf1 include:resend.com ~all` | SPF email delivery validation |

---

## API Route Reference

### Public Routes
- `GET  /api/health` — Service health check
- `POST /api/registrations` — Submit new student registration
- `GET  /api/tickets/:registrationId` — Retrieve ticket details with base64 QR pass (PII protected)
- `GET  /api/settings/public` — Retrieve event date, venue, capacity, and status

### Authentication Routes
- `POST /api/auth/login` — Staff & Admin login (returns 7-day JWT)
- `POST /api/auth/logout` — Invalidate user session
- `GET  /api/auth/me` — Authenticated user profile

### Admin & Staff Routes (Requires JWT Bearer Token)
- `GET  /api/dashboard/stats` — Real-time attendance KPIs, progress bar, Recharts analytics
- `GET  /api/registrations` — Search, paginate, and filter attendees (`?search=...&status=...&exam=...`)
- `GET  /api/registrations/:id` — Retrieve full attendee record including raw QR token
- `POST /api/registrations/resend-email/:id` — Re-dispatch confirmation ticket email
- `POST /api/checkin` — Process gate entrance check-in with `{ token }` or `{ registrationId }`
- `POST /api/checkin/undo/:registrationId` — Revert checked-in status to registered
- `GET  /api/export/registrations` — Export attendees as CSV or Excel (`?format=csv|xlsx`)
- `GET  /api/export/checkin-history` — Export gate scan history logs (`?format=csv|xlsx`)
- `GET  /api/export/attendance-report` — Aggregate executive attendance statistics
- `PUT  /api/settings` — Update event configuration (*Super Admin Only — RBAC Guarded*)

---

## Socket.IO Real-Time Events

The server broadcasts live events to all connected admin dashboards on the root namespace:

| Event Name | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `checkin:success` | Server -> Client | Attendee details & timestamp | Updates KPI counters, progress bar, and recent check-in ticker |
| `registration:new` | Server -> Client | Registration ID & candidate | Triggers automatic refresh of attendee directory and KPIs |
| `checkin:undone` | Server -> Client | Registration ID | Reverts counter states upon manual reversal |
| `checkin:log` | Server -> Client | Audit log record | Logs duplicate or invalid scan alerts in real time |

---

## Automated Verification Scripts

The platform includes automated verification scripts in `server/`:

```bash
cd server

# 1. Test Core REST API & Sequential IDs
node test_api.js

# 2. Test QR Check-In, Concurrency & Mobile Fallback
node test_qr_checkin.js

# 3. Test Reporting, CSV 14-Fields & Excel (.xlsx) Exports
node test_reporting_export.js

# 4. Run Full Pre-Event 50-Candidate Multi-Scanner Simulation
node final_event_simulation.js
```

---

## Security & Concurrency Guarantees

1. **Atomic Gate Concurrency**: Entrance check-ins execute via MongoDB atomic `findOneAndUpdate({ _id, status: 'REGISTERED' }, ...)`. If two gate staff members scan the exact same ticket at the exact same millisecond, exactly one succeeds (`200 OK`) and the second is atomically rejected (`409 Conflict`).
2. **Zero PII in QR Barcodes**: QR codes contain only a random 32-byte cryptographic token. Scanning the barcode with third-party consumer apps reveals no student names, mobile numbers, or personal data.
3. **Double-Submission Prevention**: The frontend locks form submissions upon first click with animated spinners (`mode: 'onTouched'`), and the backend evaluates mobile and email combinations to reject duplicates.
4. **Role-Based Access Control (RBAC)**: Gate Staff accounts cannot alter event settings or delete records; unauthorized updates return `403 Forbidden`.
5. **DDoS & Spam Defense**: `express-rate-limit` limits repeated bursts on registration endpoints, and `helmet` sets strict HTTP security headers.
6. **Mobile Optimization**: Fully responsive across mobile phones, tablets, and desktop displays down to 320px screen width.

---

### Developed for
**Yasir Ali Classes**  
*Empowering Champions in NEET, JEE, CUET, and Commerce Since 2014*  
Website: [yasiraliclasses.in](https://yasiraliclasses.in) &bull; Email: `support@yasiraliclasses.in`
