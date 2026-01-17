/**
 * Amazon Clone - Secure Express.js Backend
 * 
 * Security Features:
 * - Helmet for HTTP security headers
 * - CORS with strict origin validation
 * - Rate limiting to prevent brute force
 * - JWT tokens with HTTP-only cookies
 * - bcrypt password hashing
 * - Input validation and sanitization
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        error: 'Too many login attempts, please try again after 15 minutes.',
        retryAfter: '15 minutes'
    }
});

// Body parsing
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parsing with signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
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

    // Don't leak error details in production
    const isDev = process.env.NODE_ENV === 'development';

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(isDev && { stack: err.stack })
    });
});

// ===========================================
// SERVER START
// ===========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
🚀 Amazon Clone Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Running on: http://localhost:${PORT}
🔒 Environment: ${process.env.NODE_ENV}
🛡️  Security: Helmet, CORS, Rate Limiting enabled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

module.exports = app;
