/**
 * Order Routes - MongoDB Version
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// In-memory fallback
const inMemoryOrders = new Map();

// ===========================================
// CREATE ORDER
// ===========================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain items' });
        }

        if (req.dbConnected) {
            const order = await Order.create({
                user: req.user.userId,
                items: items.map(item => ({
                    product: item.productId || item.product,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                })),
                shippingAddress,
                paymentMethod,
                status: 'pending',
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
            });

            // Clear user's cart after order
            await Cart.findOneAndUpdate(
                { user: req.user.userId },
                { items: [] }
            );

            res.status(201).json({
                message: 'Order placed successfully',
                order: {
                    id: order._id,
                    status: order.status,
                    total: order.pricing.total,
                    estimatedDelivery: order.estimatedDelivery
                }
            });
        } else {
            const orderId = Date.now().toString();
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = subtotal > 35 ? 0 : 5.99;
            const tax = subtotal * 0.08;

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
                    total: Math.round((subtotal + shipping + tax) * 100) / 100
                },
                createdAt: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
            };

            const userOrders = inMemoryOrders.get(req.user.userId) || [];
            userOrders.push(order);
            inMemoryOrders.set(req.user.userId, userOrders);

            res.status(201).json({
                message: 'Order placed successfully',
                order: {
                    id: orderId,
                    status: 'pending',
                    total: order.pricing.total,
                    estimatedDelivery: order.estimatedDelivery
                }
            });
        }
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// ===========================================
// GET USER'S ORDERS
// ===========================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.dbConnected) {
            const orders = await Order.find({ user: req.user.userId })
                .sort({ createdAt: -1 })
                .select('status pricing items createdAt');

            res.json({
                orders: orders.map(order => ({
                    id: order._id,
                    status: order.status,
                    total: order.pricing.total,
                    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
                    createdAt: order.createdAt
                }))
            });
        } else {
            const userOrders = inMemoryOrders.get(req.user.userId) || [];

            res.json({
                orders: userOrders.map(order => ({
                    id: order.id,
                    status: order.status,
                    total: order.pricing.total,
                    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
                    createdAt: order.createdAt
                }))
            });
        }
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// ===========================================
// GET ORDER BY ID
// ===========================================
router.get('/:orderId', authenticateToken, async (req, res) => {
    try {
        if (req.dbConnected) {
            const order = await Order.findOne({
                _id: req.params.orderId,
                user: req.user.userId
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json({ order });
        } else {
            const userOrders = inMemoryOrders.get(req.user.userId) || [];
            const order = userOrders.find(o => o.id === req.params.orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json({ order });
        }
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// ===========================================
// CANCEL ORDER
// ===========================================
router.post('/:orderId/cancel', authenticateToken, async (req, res) => {
    try {
        if (req.dbConnected) {
            const order = await Order.findOne({
                _id: req.params.orderId,
                user: req.user.userId
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            if (order.status !== 'pending' && order.status !== 'confirmed') {
                return res.status(400).json({ error: 'Order cannot be cancelled' });
            }

            order.status = 'cancelled';
            order.cancelledAt = new Date();
            order.cancelReason = req.body.reason || 'User requested cancellation';
            await order.save();

            res.json({
                message: 'Order cancelled successfully',
                order: { id: order._id, status: order.status }
            });
        } else {
            const userOrders = inMemoryOrders.get(req.user.userId) || [];
            const order = userOrders.find(o => o.id === req.params.orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            if (order.status !== 'pending') {
                return res.status(400).json({ error: 'Only pending orders can be cancelled' });
            }

            order.status = 'cancelled';
            order.cancelledAt = new Date().toISOString();

            res.json({
                message: 'Order cancelled successfully',
                order: { id: order.id, status: order.status }
            });
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

module.exports = router;
