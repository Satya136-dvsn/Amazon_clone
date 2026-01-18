/**
 * Cart Model
 * 
 * MongoDB schema for shopping cart
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    savedForLater: [cartItemSchema]
}, {
    timestamps: true
});

// Index for user lookup
cartSchema.index({ user: 1 });

// Virtual for calculating totals
cartSchema.virtual('totals').get(function () {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 35 ? 0 : 5.99;
    const tax = subtotal * 0.08;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        itemCount,
        shipping: Math.round(shipping * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round((subtotal + shipping + tax) * 100) / 100
    };
});

// Ensure virtuals are included in JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
