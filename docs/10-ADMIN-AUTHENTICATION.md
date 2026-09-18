# Admin Authentication

Build secure admin authentication.

Routes:

/admin/login
/admin

---

# Login

Fields:

Email
Password

Backend:

POST /api/auth/login

---

# Password

Passwords must be hashed using bcrypt.

Never store plaintext passwords.

---

# JWT

After login:

Generate JWT.

Use secure expiration.

Frontend stores authentication securely according to the application's deployment strategy.

---

# Protected Routes

Protect:

/api/dashboard/*
/api/registrations/*
/api/checkin/*
/api/export/*
/api/settings/*

---

# Roles

ADMIN:

Full access.

STAFF:

- Dashboard
- Registration lookup
- QR check-in

STAFF should not modify critical event settings unless explicitly authorized.

---

# Logout

Implement logout.

Clear authentication state.

Redirect to:

/admin/login

---

# Security

Rate limit login.

Return generic invalid credential messages.

Do not reveal whether email exists.