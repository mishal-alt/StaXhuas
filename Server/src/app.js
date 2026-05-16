import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import * as googleController from './controllers/google.controller.js';
import { protect } from './middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../uploads');

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false, // Stop blocking images across ports
}));

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', env.clientUrl],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting (Basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Google Auth Routes (Mounted directly on app to guarantee they work)
app.get('/api/google/auth', protect, googleController.initiateGoogleAuth);
app.get('/api/auth/google', protect, googleController.initiateGoogleAuth); // Alias
app.get('/api/google/callback', googleController.googleAuthCallback);

// Main Routes
app.use('/api', routes);

// Base route for health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Staxhaus IMA API is running' });
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler with detailed logging
app.use((err, req, res, next) => {
  if (req.path.includes('profile-pic')) {
    console.error(' [UPLOAD ERROR] Detailed breakdown:', {
      message: err.message,
      stack: err.stack,
      file: req.file
    });
  }
  errorHandler(err, req, res, next);
});

export default app;
