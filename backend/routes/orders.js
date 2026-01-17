/**
 * Order Routes
 * 
 * Protected endpoints for order management
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation');

// In-memory order store
const orders = new Map();

// ===========================================
// CREATE ORDER
// ===========================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                error: 'Order must contain items'
            });
        }

        const orderId = uuidv4();
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 35 ? 0 : 5.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        const order = {
            id: orderId,
            userId: req.user.userId,
            items,
            shippingAddress,
            paymentMethod,
            status: 'pending',
            pricing: {
                subtotal: Math.round(subtotal * 100) / 100,
                shipping: Math.round(shipping * 100) / 100,
                tax: Math.round(tax * 100) / 100,
                total: Math.round(total * 100) / 100
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Get user's existing orders or create new array
        const userOrders = orders.get(req.user.userId) || [];
        userOrders.push(order);
        orders.set(req.user.userId, userOrders);

        res.status(201).json({
            message: 'Order placed successfully',
            order: {
                id: orderId,
                status: 'pending',
                total: order.pricing.total,
                estimatedDelivery: '3-5 business days'
            }
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            error: 'Failed to place order'
        });
    }
});

// ===========================================
// GET USER'S ORDERS
// ===========================================
router.get('/', authenticateToken, (req, res) => {
    const userOrders = orders.get(req.user.userId) || [];

    res.json({
        orders: userOrders.map(order => ({
            id: order.id,
            status: order.status,
            total: order.pricing.total,
            itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
            createdAt: order.createdAt
        }))
    });
});

// ===========================================
// GET ORDER BY ID
// ===========================================
router.get('/:orderId', authenticateToken, (req, res) => {
    const userOrders = orders.get(req.user.userId) || [];
    const order = userOrders.find(o => o.id === req.params.orderId);

    if (!order) {
        return res.status(404).json({
            error: 'Order not found'
        });
    }

    res.json({ order });
});

// ===========================================
// CANCEL ORDER
// ===========================================
router.post('/:orderId/cancel', authenticateToken, (req, res) => {
    const userOrders = orders.get(req.user.userId) || [];
    const order = userOrders.find(o => o.id === req.params.orderId);

    if (!order) {
        return res.status(404).json({
            error: 'Order not found'
        });
    }

    if (order.status !== 'pending') {
        return res.status(400).json({
            error: 'Only pending orders can be cancelled'
        });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    res.json({
        message: 'Order cancelled successfully',
        order: {
            id: order.id,
            status: order.status
        }
    });
});

module.exports = router;
