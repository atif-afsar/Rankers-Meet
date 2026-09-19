import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { initSocket } from './socket.js';
import { runSeed } from './utils/seed.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import checkinRoutes from './routes/checkinRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rankers_meet';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security: Helmet HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 2. Security: Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // limit login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);

// 3. Security: Dynamic CORS configuration (supports localhost, custom domains, and Vercel)
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, Postman, mobile apps, or same-origin)
      if (!origin) return callback(null, true);

      // Explicit match in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel deployments (*.vercel.app)
      if (/^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV === 'production') {
        console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
        return callback(new Error(`CORS request from origin ${origin} blocked by security policy`), false);
      }

      // In development, allow all origins for smooth testing
      return callback(null, true);
    },
    credentials: true,
  })
);

// 4. Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Health API (05-BACKEND-SETUP.md line 94-105)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rankers Meet API is running',
  });
});

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/settings', settingsRoutes);

// 7. Centralized Error Handler (suppresses stack traces in production)
app.use(errorHandler);

// 8. Create HTTP Server & Initialize Socket.io
const httpServer = http.createServer(app);
initSocket(httpServer, CLIENT_URL);

// 9. Connect to Database & Start Server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[Database] Connected to MongoDB at ${MONGODB_URI}`);

    // Auto-seed default admin & event settings if needed
    await runSeed();

    httpServer.listen(PORT, () => {
      console.log(`[Server] Rankers Meet 2026 API listening on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Database Error] Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
