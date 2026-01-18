/**
 * Product Model
 * 
 * MongoDB schema for product catalog
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    rating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    images: [String],
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electronics', 'Fashion', 'Home & Kitchen', 'Toys & Games', 'Sports & Outdoors', 'Video Games', 'Books', 'Beauty']
    },
    subcategory: String,
    brand: {
        type: String,
        required: [true, 'Brand is required']
    },
    features: [String],
    specifications: mongoose.Schema.Types.Mixed,
    inStock: {
        type: Boolean,
        default: true
    },
    stockCount: {
        type: Number,
        default: 100
    },
    prime: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for search and filtering
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Virtual for calculating discount percentage
productSchema.virtual('calculatedDiscount').get(function () {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

module.exports = mongoose.model('Product', productSchema);
