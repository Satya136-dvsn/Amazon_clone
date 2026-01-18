/**
 * Product Routes - MongoDB Version
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const Product = require('../models/Product');

// Fallback product data
const fallbackProducts = require('../data/products');

// ===========================================
// GET ALL PRODUCTS
// ===========================================
router.get('/', optionalAuth, async (req, res) => {
    try {
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

        if (req.dbConnected) {
            // Build MongoDB query
            const query = {};

            if (search) {
                query.$text = { $search: search };
            }
            if (category) {
                query.category = category;
            }
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = parseFloat(minPrice);
                if (maxPrice) query.price.$lte = parseFloat(maxPrice);
            }
            if (minRating) {
                query.rating = { $gte: parseFloat(minRating) };
            }

            // Build sort options
            let sortOption = {};
            switch (sort) {
                case 'price-asc': sortOption = { price: 1 }; break;
                case 'price-desc': sortOption = { price: -1 }; break;
                case 'rating': sortOption = { rating: -1 }; break;
                case 'discount': sortOption = { discount: -1 }; break;
                default: sortOption = { createdAt: -1 };
            }

            const skip = (parseInt(page) - 1) * parseInt(limit);

            const [products, total] = await Promise.all([
                Product.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
                Product.countDocuments(query)
            ]);

            res.json({
                products,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
        } else {
            // Fallback to static data
            let result = [...fallbackProducts];

            if (search) {
                const q = search.toLowerCase();
                result = result.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q)
                );
            }
            if (category) result = result.filter(p => p.category === category);
            if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
            if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
            if (minRating) result = result.filter(p => p.rating >= parseFloat(minRating));

            if (sort) {
                switch (sort) {
                    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
                    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
                    case 'rating': result.sort((a, b) => b.rating - a.rating); break;
                    case 'discount': result.sort((a, b) => b.discount - a.discount); break;
                }
            }

            const startIndex = (parseInt(page) - 1) * parseInt(limit);
            const paginatedResult = result.slice(startIndex, startIndex + parseInt(limit));

            res.json({
                products: paginatedResult,
                pagination: {
                    total: result.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(result.length / parseInt(limit))
                }
            });
        }
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// ===========================================
// GET SINGLE PRODUCT
// ===========================================
router.get('/:id', async (req, res) => {
    try {
        if (req.dbConnected) {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const related = await Product.find({
                category: product.category,
                _id: { $ne: product._id }
            }).limit(4);

            res.json({ product, related });
        } else {
            const product = fallbackProducts.find(p => p.id === parseInt(req.params.id));
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const related = fallbackProducts
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4);

            res.json({ product, related });
        }
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// ===========================================
// GET CATEGORIES
// ===========================================
router.get('/meta/categories', async (req, res) => {
    try {
        if (req.dbConnected) {
            const categories = await Product.distinct('category');
            res.json({ categories });
        } else {
            const categories = [...new Set(fallbackProducts.map(p => p.category))];
            res.json({ categories });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;
