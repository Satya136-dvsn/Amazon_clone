/**
 * Authentication Routes - MongoDB Version
 * 
 * Uses Mongoose models for persistent storage
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const {
    authenticateToken,
    generateTokens,
    setAuthCookies,
    clearAuthCookies
} = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// In-memory fallback (when MongoDB is not available)
const inMemoryUsers = new Map();
const tokenBlacklist = new Set();

// ===========================================
// REGISTER
// ===========================================
router.post('/register', registerValidation, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if using database or in-memory
        if (req.dbConnected) {
            // Check if user exists in database
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    error: 'Registration failed',
                    message: 'An account with this email already exists'
                });
            }

            // Create user in database
            const user = await User.create({ name, email, password });

            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(user._id.toString(), email);
            setAuthCookies(res, accessToken, refreshToken);

            res.status(201).json({
                message: 'Registration successful',
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
            // Fallback to in-memory storage
            const existingUser = Array.from(inMemoryUsers.values()).find(u => u.email === email);
            if (existingUser) {
                return res.status(409).json({
                    error: 'Registration failed',
                    message: 'An account with this email already exists'
                });
            }

            const bcrypt = require('bcryptjs');
            const userId = Date.now().toString();
            const hashedPassword = await bcrypt.hash(password, 12);

            inMemoryUsers.set(userId, {
                id: userId,
                name,
                email,
                password: hashedPassword
            });

            const { accessToken, refreshToken } = generateTokens(userId, email);
            setAuthCookies(res, accessToken, refreshToken);

            res.status(201).json({
                message: 'Registration successful',
                user: { id: userId, name, email }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Registration failed',
            message: error.message || 'An error occurred during registration'
        });
    }
});

// ===========================================
// LOGIN
// ===========================================
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (req.dbConnected) {
            // Find user in database (include password for comparison)
            const user = await User.findOne({ email }).select('+password');

            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    message: 'Invalid email or password'
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save({ validateBeforeSave: false });

            const { accessToken, refreshToken } = generateTokens(user._id.toString(), email);
            setAuthCookies(res, accessToken, refreshToken);

            res.json({
                message: 'Login successful',
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
            // Fallback to in-memory
            const bcrypt = require('bcryptjs');
            const user = Array.from(inMemoryUsers.values()).find(u => u.email === email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({
                    error: 'Authentication failed',
                    message: 'Invalid email or password'
                });
            }

            const { accessToken, refreshToken } = generateTokens(user.id, email);
            setAuthCookies(res, accessToken, refreshToken);

            res.json({
                message: 'Login successful',
                user: { id: user.id, name: user.name, email: user.email }
            });
        }
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

        if (!refreshToken || tokenBlacklist.has(refreshToken)) {
            return res.status(401).json({
                error: 'No refresh token',
                message: 'Please log in again'
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const tokens = generateTokens(decoded.userId, decoded.email);
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
    const refreshToken = req.signedCookies?.refreshToken;
    if (refreshToken) {
        tokenBlacklist.add(refreshToken);
    }
    clearAuthCookies(res);
    res.json({ message: 'Logged out successfully' });
});

// ===========================================
// GET CURRENT USER
// ===========================================
router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (req.dbConnected) {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        } else {
            const user = inMemoryUsers.get(req.user.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({
                user: { id: user.id, name: user.name, email: user.email }
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// ===========================================
// CHANGE PASSWORD
// ===========================================
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (req.dbConnected) {
            const user = await User.findById(req.user.userId).select('+password');

            if (!user || !(await user.comparePassword(currentPassword))) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            user.password = newPassword;
            await user.save();

            clearAuthCookies(res);
            res.json({ message: 'Password changed successfully. Please log in again.' });
        } else {
            const bcrypt = require('bcryptjs');
            const user = inMemoryUsers.get(req.user.userId);

            if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            user.password = await bcrypt.hash(newPassword, 12);
            clearAuthCookies(res);
            res.json({ message: 'Password changed successfully. Please log in again.' });
        }
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;
