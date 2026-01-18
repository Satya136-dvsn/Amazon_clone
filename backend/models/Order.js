/**
 * Order Model
 * 
 * MongoDB schema for orders with status tracking
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
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
        min: [1, 'Quantity must be at least 1']
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: 'India' },
        phone: String
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'cod'],
        default: 'card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    pricing: {
        subtotal: { type: Number, required: true },
        shipping: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    notes: String
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Calculate totals before saving
orderSchema.pre('save', function (next) {
    if (this.items && this.items.length > 0) {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 35 ? 0 : 5.99;
        const tax = subtotal * 0.08;

        this.pricing = {
            subtotal: Math.round(subtotal * 100) / 100,
            shipping: Math.round(shipping * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            discount: this.pricing?.discount || 0,
            total: Math.round((subtotal + shipping + tax - (this.pricing?.discount || 0)) * 100) / 100
        };
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
