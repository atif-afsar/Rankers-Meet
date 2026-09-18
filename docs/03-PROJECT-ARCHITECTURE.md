# Project Architecture

Create a full-stack application.

Recommended structure:

rankers-meet/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── schemas/
│   │   └── App.jsx
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│
└── docs/

---

# API Structure

Base:

/api

Auth:

POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

Registrations:

POST /api/registrations
GET /api/registrations
GET /api/registrations/:id

Tickets:

GET /api/tickets/:registrationId

Check-in:

POST /api/checkin
GET /api/checkin/:registrationId

Dashboard:

GET /api/dashboard/stats

Export:

GET /api/export/registrations

Settings:

GET /api/settings
PUT /api/settings

---

# Architecture Principle

Frontend never accesses MongoDB directly.

Frontend
↓
REST API
↓
Controller
↓
Service
↓
Model
↓
MongoDB

---

# Environment Variables

Frontend:

VITE_API_URL

Backend:

PORT
MONGODB_URI
JWT_SECRET
RESEND_API_KEY
EMAIL_FROM
CLIENT_URL

Never commit .env files.

Create:

.env.example