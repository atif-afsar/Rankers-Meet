# Backend Setup

Create the Node.js + Express backend.

## Dependencies

Install:

express
mongoose
cors
dotenv
helmet
express-rate-limit
bcryptjs
jsonwebtoken
zod
qrcode
resend

Development:

nodemon

---

# Server

Create:

server/src/server.js

Configure:

- Express
- JSON parser
- CORS
- Helmet
- Rate limiting
- MongoDB connection
- Routes
- Error handler

---

# CORS

Allow only configured frontend origin.

Use:

CLIENT_URL

Do not use unrestricted * in production.

---

# Error Handling

Create centralized error middleware.

Return consistent JSON:

{
  success: false,
  message: "Error message"
}

Successful:

{
  success: true,
  data: {}
}

---

# Security

Implement:

- Helmet
- Rate limiting
- Input validation
- MongoDB validation
- Secure JWT
- Password hashing
- CORS

Never expose stack traces in production.

---

# Health API

Create:

GET /api/health

Response:

{
  success: true,
  message: "Rankers Meet API is running"
}