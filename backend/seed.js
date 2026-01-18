/**
 * Database Seeder
 * 
 * Seeds the MongoDB database with initial product data
 * Run: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { connectDB, disconnectDB } = require('./config/database');

const products = [
    {
        title: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
        description: "Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Features A17 Pro chip, 48MP camera system, and titanium design.",
        price: 1199.99,
        originalPrice: 1299.99,
        discount: 8,
        rating: 4.8,
        reviews: 15420,
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop",
        category: "Electronics",
        subcategory: "Cell Phones",
        brand: "Apple",
        features: [
            "A17 Pro chip for unprecedented performance",
            "48MP main camera with advanced computational photography",
            "Titanium design - strong yet lightweight",
            "Action button for instant access to features",
            "All-day battery life"
        ],
        inStock: true,
        stockCount: 50,
        prime: true
    },
    {
        title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        description: "Industry-leading noise cancellation with 30-hour battery life and premium comfort.",
        price: 328.00,
        originalPrice: 399.99,
        discount: 18,
        rating: 4.7,
        reviews: 8932,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
        category: "Electronics",
        subcategory: "Headphones",
        brand: "Sony",
        features: [
            "Industry-leading noise cancellation",
            "30-hour battery life",
            "Crystal clear hands-free calling",
            "Multipoint connection",
            "Ultra-comfortable design"
        ],
        inStock: true,
        stockCount: 100,
        prime: true
    },
    {
        title: "Samsung 65\" Class OLED 4K S95D Smart TV",
        description: "Experience breathtaking picture quality with Samsung's OLED technology and AI-powered features.",
        price: 1997.99,
        originalPrice: 2799.99,
        discount: 29,
        rating: 4.6,
        reviews: 3241,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
        category: "Electronics",
        subcategory: "Televisions",
        brand: "Samsung",
        features: [
            "OLED display with perfect blacks",
            "4K resolution with AI upscaling",
            "Smart TV with built-in apps",
            "Dolby Atmos sound",
            "Gaming mode with low latency"
        ],
        inStock: true,
        stockCount: 25,
        prime: true
    },
    {
        title: "Dyson V15 Detect Absolute Cordless Vacuum",
        description: "The most powerful, intelligent cordless vacuum with laser dust detection.",
        price: 649.99,
        originalPrice: 749.99,
        discount: 13,
        rating: 4.5,
        reviews: 6789,
        image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
        category: "Home & Kitchen",
        subcategory: "Vacuums",
        brand: "Dyson",
        features: [
            "Laser dust detection",
            "LCD screen shows dust count",
            "Up to 60 minutes runtime",
            "HEPA filtration",
            "Multiple attachments included"
        ],
        inStock: true,
        stockCount: 75,
        prime: true
    },
    {
        title: "Apple MacBook Pro 16\" M3 Max Chip - Space Black",
        description: "Supercharged by M3 Max. Up to 128GB unified memory for professional workflows.",
        price: 3499.00,
        originalPrice: 3999.00,
        discount: 13,
        rating: 4.9,
        reviews: 2156,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
        category: "Electronics",
        subcategory: "Laptops",
        brand: "Apple",
        features: [
            "Apple M3 Max chip",
            "Up to 128GB unified memory",
            "16-inch Liquid Retina XDR display",
            "22-hour battery life",
            "MagSafe 3, Thunderbolt 4, HDMI, SD slot"
        ],
        inStock: true,
        stockCount: 30,
        prime: true
    },
    {
        title: "Nike Air Jordan 1 Retro High OG - Chicago",
        description: "The iconic Air Jordan 1 in the classic Chicago colorway. Premium leather construction.",
        price: 180.00,
        originalPrice: 180.00,
        discount: 0,
        rating: 4.8,
        reviews: 12453,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        category: "Fashion",
        subcategory: "Shoes",
        brand: "Nike",
        features: [
            "Premium leather upper",
            "Air-Sole unit for cushioning",
            "Rubber outsole for traction",
            "Iconic Wings logo",
            "Classic Chicago colorway"
        ],
        inStock: true,
        stockCount: 200,
        prime: true
    },
    {
        title: "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker",
        description: "The #1 selling multi-use programmable pressure cooker with 9 cooking functions.",
        price: 89.95,
        originalPrice: 129.99,
        discount: 31,
        rating: 4.7,
        reviews: 45678,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
        category: "Home & Kitchen",
        subcategory: "Kitchen Appliances",
        brand: "Instant Pot",
        features: [
            "9-in-1 functionality",
            "Pressure cook, slow cook, rice cooker",
            "Yogurt maker, steamer, sauté",
            "Easy-to-use controls",
            "Dishwasher safe parts"
        ],
        inStock: true,
        stockCount: 500,
        prime: true
    },
    {
        title: "Kindle Paperwhite Signature Edition (32 GB)",
        description: "The best Kindle for reading anywhere with auto-adjusting front light and wireless charging.",
        price: 189.99,
        originalPrice: 199.99,
        discount: 5,
        rating: 4.7,
        reviews: 23456,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
        category: "Electronics",
        subcategory: "E-readers",
        brand: "Amazon",
        features: [
            "6.8\" display with adjustable warm light",
            "Wireless charging compatible",
            "32 GB storage",
            "Waterproof (IPX8)",
            "Weeks of battery life"
        ],
        inStock: true,
        stockCount: 300,
        prime: true
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Connecting to database...');
        await connectDB();

        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});

        console.log('📦 Inserting products...');
        const inserted = await Product.insertMany(products);

        console.log(`✅ Successfully seeded ${inserted.length} products!`);

        await disconnectDB();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
