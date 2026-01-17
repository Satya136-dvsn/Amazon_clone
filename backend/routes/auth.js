/**
 * Authentication Routes
 * 
 * Security Features:
 * - bcrypt password hashing (12 rounds)
 * - JWT tokens with HTTP-only cookies
 * - Token refresh mechanism
 * - Secure logout with cookie clearing
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const {
    authenticateToken,
    generateTokens,
    setAuthCookies,
    clearAuthCookies
} = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// In-memory user store (replace with database in production)
const users = new Map();
// Token blacklist for logout
const tokenBlacklist = new Set();

// ===========================================
// REGISTER
// ===========================================
router.post('/register', registerValidation, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = Array.from(users.values()).find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({
                error: 'Registration failed',
                message: 'An account with this email already exists'
            });
        }

        // Hash password with bcrypt (12 rounds is recommended)
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = uuidv4();
        const user = {
            id: userId,
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            cart: [],
            orders: [],
            addresses: []
        };

        users.set(userId, user);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(userId, email);

        // Set HTTP-only cookies
        setAuthCookies(res, accessToken, refreshToken);

        // Return user data (without password)
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: userId,
                name,
                email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Registration failed',
            message: 'An error occurred during registration'
        });
    }
});

// ===========================================
// LOGIN
// ===========================================
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = Array.from(users.values()).find(u => u.email === email);

        if (!user) {
            // Use same message for security (don't reveal if email exists)
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password'
            });
        }

        // Compare password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, email);

        // Set HTTP-only cookies
        setAuthCookies(res, accessToken, refreshToken);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            message: 'An error occurred during login'
        });
    }
});

// ===========================================
// REFRESH TOKEN
// ===========================================
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.signedCookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: 'No refresh token',
                message: 'Please log in again'
            });
        }

        // Check if token is blacklisted
        if (tokenBlacklist.has(refreshToken)) {
            return res.status(401).json({
                error: 'Token revoked',
                message: 'Please log in again'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate new tokens
        const tokens = generateTokens(decoded.userId, decoded.email);

        // Set new cookies
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

        res.json({ message: 'Token refreshed successfully' });

    } catch (error) {
        clearAuthCookies(res);
        res.status(401).json({
            error: 'Invalid refresh token',
            message: 'Please log in again'
        });
    }
});

// ===========================================
// LOGOUT
// ===========================================
router.post('/logout', (req, res) => {
    // Add refresh token to blacklist
    const refreshToken = req.signedCookies?.refreshToken;
    if (refreshToken) {
        tokenBlacklist.add(refreshToken);
    }

    // Clear cookies
    clearAuthCookies(res);

    res.json({ message: 'Logged out successfully' });
});

// ===========================================
// GET CURRENT USER
// ===========================================
router.get('/me', authenticateToken, (req, res) => {
    const user = users.get(req.user.userId);

    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }
    });
});

// ===========================================
// CHANGE PASSWORD
// ===========================================
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = users.get(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({
                error: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        // Clear all tokens (force re-login)
        clearAuthCookies(res);

        res.json({ message: 'Password changed successfully. Please log in again.' });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;
