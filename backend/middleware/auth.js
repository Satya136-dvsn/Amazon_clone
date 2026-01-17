/**
 * JWT Authentication Middleware
 * 
 * Security Features:
 * - Token verification with secret key
 * - HTTP-only cookie token storage
 * - Automatic token refresh
 * - Bearer token support for API clients
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from cookie or Authorization header
 */
const authenticateToken = (req, res, next) => {
    // Try to get token from HTTP-only cookie first (more secure)
    let token = req.signedCookies?.accessToken;

    // Fallback to Authorization header for API clients
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'Please log in to access this resource'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Your session has expired, please log in again'
            });
        }
        return res.status(403).json({
            error: 'Invalid token',
            message: 'Authentication failed'
        });
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
    const token = req.signedCookies?.accessToken ||
        req.headers['authorization']?.split(' ')[1];

    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Token invalid, but continue without user
            req.user = null;
        }
    }
    next();
};

/**
 * Generate access and refresh tokens
 */
const generateTokens = (userId, email) => {
    const accessToken = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
        { userId, email, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Set secure cookie options
 */
const getCookieOptions = (maxAge) => ({
    httpOnly: true,           // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    signed: true,             // Signed with secret
    sameSite: 'strict',       // CSRF protection
    maxAge: maxAge
});

/**
 * Set auth cookies on response
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
    // Access token - short lived (15 min)
    res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000));

    // Refresh token - long lived (7 days)
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
};

/**
 * Clear auth cookies on logout
 */
const clearAuthCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

module.exports = {
    authenticateToken,
    optionalAuth,
    generateTokens,
    setAuthCookies,
    clearAuthCookies,
    getCookieOptions
};
