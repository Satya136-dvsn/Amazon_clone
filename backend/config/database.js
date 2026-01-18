/**
 * MongoDB Database Configuration
 * 
 * Handles connection to MongoDB with retry logic
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon-clone';

        const options = {
            // MongoDB driver options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        const conn = await mongoose.connect(mongoURI, options);

        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        return conn;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);

        // In development, fall back to in-memory mode
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️  Running without database - using in-memory storage');
            return null;
        }

        // In production, exit if no database
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};

module.exports = { connectDB, disconnectDB };
