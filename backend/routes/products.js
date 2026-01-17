/**
 * Product Routes
 * 
 * Public endpoints for product browsing
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

// Import product data
const products = require('../data/products');

// ===========================================
// GET ALL PRODUCTS (with filtering)
// ===========================================
router.get('/', optionalAuth, (req, res) => {
    let result = [...products];

    const {
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        sort,
        limit = 20,
        page = 1
    } = req.query;

    // Search filter
    if (search) {
        const query = search.toLowerCase();
        result = result.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    // Category filter
    if (category) {
        result = result.filter(p => p.category === category);
    }

    // Price filter
    if (minPrice) {
        result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Rating filter
    if (minRating) {
        result = result.filter(p => p.rating >= parseFloat(minRating));
    }

    // Sorting
    if (sort) {
        switch (sort) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                result.sort((a, b) => b.discount - a.discount);
                break;
        }
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
        products: paginatedResult,
        pagination: {
            total: result.length,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(result.length / parseInt(limit))
        }
    });
});

// ===========================================
// GET SINGLE PRODUCT
// ===========================================
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).json({
            error: 'Product not found'
        });
    }

    // Get related products
    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    res.json({
        product,
        related
    });
});

// ===========================================
// GET CATEGORIES
// ===========================================
router.get('/meta/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json({ categories });
});

module.exports = router;
