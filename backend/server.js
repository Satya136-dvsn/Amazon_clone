/**
 * Amazon Clone - Production-Ready Express.js Backend
 * 
 * Security Features:
 * - Helmet for HTTP security headers
 * - CORS with strict origin validation
 * - Rate limiting to prevent brute force
 * - JWT tokens with HTTP-only cookies
 * - bcrypt password hashing
 * - MongoDB with Mongoose ODM
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

// ===========================================
// DATABASE CONNECTION
// ===========================================
let dbConnected = false;

const initializeDB = async () => {
    const conn = await connectDB();
    dbConnected = conn !== null;
    return dbConnected;
};

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet - Sets various HTTP headers for security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS - Strict origin validation
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://amazon-clone.vercel.app', // Add your Vercel domain
    'https://your-production-domain.com'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too many login attempts, please try again after 15 minutes.'
    }
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parsing with signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Make db status available to routes
app.use((req, res, next) => {
    req.dbConnected = dbConnected;
    next();
});

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: dbConnected ? 'connected' : 'disconnected'
    });
});

// Auth routes with stricter rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Protected routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} does not exist`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    const isDev = process.env.NODE_ENV === 'development';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: 'Validation Error', details: errors });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicate entry', message: 'This record already exists' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(isDev && { stack: err.stack })
    });
});

// ===========================================
// SERVER START
// ===========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Connect to database
    await initializeDB();

    app.listen(PORT, () => {
        console.log(`
🚀 Amazon Clone Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Running on: http://localhost:${PORT}
🔒 Environment: ${process.env.NODE_ENV}
📦 Database: ${dbConnected ? 'MongoDB Connected' : 'In-Memory Mode'}
🛡️  Security: Helmet, CORS, Rate Limiting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    });
};

startServer();

module.exports = app;
