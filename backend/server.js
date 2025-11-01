const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Handle uncaught exceptions (only exit if not in serverless)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

// Handle unhandled promise rejections (only exit if not in serverless)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

const app = express();

// Increase JSON payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to DB (async - will be cached in serverless)
connectDB().catch(err => console.error('DB connection failed:', err));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow loading images from different origins
}));

// CORS configuration - Updated for Vercel deployment
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL, // Add your Vercel frontend URL
  /vercel\.app$/ // Allow all Vercel preview URLs
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'x-auth-token']
}));
app.use(morgan('dev'));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));

// Test endpoint
app.get('/', (req, res) => res.send({ status: 'ok', time: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

const PORT = process.env.PORT || 3001;

// Export for Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing server...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}
