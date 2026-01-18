/**
 * Cart Routes - MongoDB Version
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Cart = require('../models/Cart');

// In-memory fallback
const inMemoryCarts = new Map();

// ===========================================
// GET USER'S CART
// ===========================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.dbConnected) {
            let cart = await Cart.findOne({ user: req.user.userId });
            if (!cart) {
                cart = { items: [], totals: { subtotal: 0, itemCount: 0, shipping: 0, tax: 0, total: 0 } };
            }
            res.json({
                items: cart.items,
                ...cart.totals,
                updatedAt: cart.updatedAt
            });
        } else {
            const cart = inMemoryCarts.get(req.user.userId) || { items: [] };
            const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            res.json({
                items: cart.items,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
                total: Math.round(total * 100) / 100,
                updatedAt: cart.updatedAt
            });
        }
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// ===========================================
// ADD ITEM TO CART
// ===========================================
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { productId, title, price, image, quantity = 1 } = req.body;

        if (!productId || !title || !price) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['productId', 'title', 'price']
            });
        }

        if (req.dbConnected) {
            let cart = await Cart.findOne({ user: req.user.userId });

            if (!cart) {
                cart = new Cart({ user: req.user.userId, items: [] });
            }

            const existingItem = cart.items.find(item =>
                item.product.toString() === productId.toString()
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, title, price, image, quantity });
            }

            await cart.save();
            res.json({ message: 'Item added to cart', cart: cart.items });
        } else {
            let cart = inMemoryCarts.get(req.user.userId) || { items: [] };

            const existingItem = cart.items.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, title, price, image, quantity });
            }

            cart.updatedAt = new Date().toISOString();
            inMemoryCarts.set(req.user.userId, cart);

            res.json({ message: 'Item added to cart', cart: cart.items });
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

// ===========================================
// UPDATE ITEM QUANTITY
// ===========================================
router.put('/update/:productId', authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        if (req.dbConnected) {
            const cart = await Cart.findOne({ user: req.user.userId });
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            const item = cart.items.find(i => i.product.toString() === productId);
            if (!item) {
                return res.status(404).json({ error: 'Item not found in cart' });
            }

            item.quantity = quantity;
            await cart.save();

            res.json({ message: 'Cart updated', cart: cart.items });
        } else {
            const cart = inMemoryCarts.get(req.user.userId);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            const item = cart.items.find(i => i.productId === parseInt(productId));
            if (!item) {
                return res.status(404).json({ error: 'Item not found in cart' });
            }

            item.quantity = quantity;
            cart.updatedAt = new Date().toISOString();

            res.json({ message: 'Cart updated', cart: cart.items });
        }
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// ===========================================
// REMOVE ITEM FROM CART
// ===========================================
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;

        if (req.dbConnected) {
            const cart = await Cart.findOne({ user: req.user.userId });
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            cart.items = cart.items.filter(i => i.product.toString() !== productId);
            await cart.save();

            res.json({ message: 'Item removed from cart', cart: cart.items });
        } else {
            const cart = inMemoryCarts.get(req.user.userId);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            cart.items = cart.items.filter(i => i.productId !== parseInt(productId));
            cart.updatedAt = new Date().toISOString();

            res.json({ message: 'Item removed from cart', cart: cart.items });
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

// ===========================================
// CLEAR CART
// ===========================================
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        if (req.dbConnected) {
            await Cart.findOneAndUpdate(
                { user: req.user.userId },
                { items: [] },
                { new: true }
            );
        } else {
            inMemoryCarts.set(req.user.userId, { items: [], updatedAt: new Date().toISOString() });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

module.exports = router;
