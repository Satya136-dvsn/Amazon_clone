/**
 * Cart Routes
 * 
 * Protected endpoints for cart management
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// In-memory cart store (keyed by userId)
const carts = new Map();

// ===========================================
// GET USER'S CART
// ===========================================
router.get('/', authenticateToken, (req, res) => {
    const cart = carts.get(req.user.userId) || { items: [], updatedAt: null };

    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
        items: cart.items,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        total: Math.round(total * 100) / 100,
        updatedAt: cart.updatedAt
    });
});

// ===========================================
// ADD ITEM TO CART
// ===========================================
router.post('/add', authenticateToken, (req, res) => {
    const { productId, title, price, image, quantity = 1 } = req.body;

    if (!productId || !title || !price) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['productId', 'title', 'price']
        });
    }

    let cart = carts.get(req.user.userId) || { items: [] };

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId,
            title,
            price,
            image,
            quantity
        });
    }

    cart.updatedAt = new Date().toISOString();
    carts.set(req.user.userId, cart);

    res.json({
        message: 'Item added to cart',
        cart: cart.items
    });
});

// ===========================================
// UPDATE ITEM QUANTITY
// ===========================================
router.put('/update/:productId', authenticateToken, (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({
            error: 'Quantity must be at least 1'
        });
    }

    const cart = carts.get(req.user.userId);

    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(i => i.productId === parseInt(productId));

    if (!item) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    cart.updatedAt = new Date().toISOString();

    res.json({
        message: 'Cart updated',
        cart: cart.items
    });
});

// ===========================================
// REMOVE ITEM FROM CART
// ===========================================
router.delete('/remove/:productId', authenticateToken, (req, res) => {
    const { productId } = req.params;
    const cart = carts.get(req.user.userId);

    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(i => i.productId !== parseInt(productId));
    cart.updatedAt = new Date().toISOString();

    res.json({
        message: 'Item removed from cart',
        cart: cart.items
    });
});

// ===========================================
// CLEAR CART
// ===========================================
router.delete('/clear', authenticateToken, (req, res) => {
    carts.set(req.user.userId, { items: [], updatedAt: new Date().toISOString() });

    res.json({
        message: 'Cart cleared'
    });
});

module.exports = router;
