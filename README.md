# 🛒 Amazon Clone

A fully functional Amazon e-commerce clone built with React + Vite. Features a stunning UI with Amazon's signature design, complete shopping cart functionality, and user authentication.

![Amazon Clone Demo](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🏠 Homepage

- Auto-playing hero carousel with promotional banners
- Today's Deals section with discounted products
- Best Sellers showcase
- Category grid navigation
- Responsive Amazon-style header with search

### 📦 Product Browsing

- **Filter Sidebar** - Filter by category, customer rating, price range
- **Sort Options** - Sort by price, rating, discount, bestsellers
- **Grid/List View** - Toggle between display modes
- **Search** - Full-text search across products

### 🛍️ Product Details

- Image gallery with thumbnail navigation
- Complete product information (features, specs)
- Buy Box with price, stock status, delivery info
- Related products recommendations
- Add to Cart with visual feedback

### 🛒 Shopping Cart

- Add, remove, and update item quantities
- Order summary with subtotal, shipping, and tax
- Free shipping threshold indicator
- Persistent cart (localStorage)

### 🔐 Authentication

- User registration with password validation
- Login with email/password
- Session persistence (localStorage)
- Protected routes for checkout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Satya136-dvsn/Amazon_clone.git

# Navigate to project directory
cd Amazon_clone

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Header/          # Navigation bar with search
│   ├── Footer/          # Site footer with links
│   ├── ProductCard/     # Product display card
│   └── Carousel/        # Hero banner slider
├── pages/
│   ├── Home/            # Landing page with deals
│   ├── Products/        # Product listing with filters
│   ├── ProductDetail/   # Single product view
│   ├── Cart/            # Shopping cart
│   ├── Login/           # Sign in page
│   └── Register/        # Create account
├── context/
│   ├── CartContext.jsx  # Cart state management
│   └── AuthContext.jsx  # User authentication
├── data/
│   └── products.js      # Sample product catalog
└── index.css            # Global styles & design system
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Lucide React | Icon library |
| CSS3 | Styling (no frameworks) |
| localStorage | Data persistence |

## 🎨 Design System

The app uses Amazon's signature color palette:

- **Primary Orange**: `#FF9900` - CTAs, highlights
- **Navy Blue**: `#232F3E` - Header, footer
- **Dark Blue**: `#131921` - Accents
- **Star Yellow**: `#FFA41C` - Ratings

## 🔒 Security Considerations

### Current Implementation

- ✅ Input validation on forms
- ✅ Password strength requirements
- ✅ XSS protection via React's built-in escaping
- ✅ No sensitive data in URLs

### For Production Deployment
>
> ⚠️ **Important**: This is an educational project. For production use:

1. **Never store passwords in localStorage** - Use secure HTTP-only cookies
2. **Implement a backend API** - Add Express.js/Node.js server
3. **Use proper authentication** - JWT tokens, bcrypt hashing
4. **Add HTTPS** - SSL/TLS encryption
5. **Environment variables** - Never commit API keys
6. **Input sanitization** - Server-side validation
7. **Rate limiting** - Prevent brute force attacks
8. **CORS configuration** - Proper origin restrictions

## 📱 Responsive Design

Fully responsive across all devices:

- 📱 Mobile (< 576px)
- 📱 Tablet (576px - 992px)
- 💻 Desktop (> 992px)

## 🧪 Sample Data

The app includes 16 sample products across categories:

- Electronics (iPhone, MacBook, Sony headphones)
- Fashion (Nike shoes, North Face jacket)
- Home & Kitchen (Dyson vacuum, Instant Pot)
- And more...

## 📄 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes. Not affiliated with Amazon.

## 👤 Author

**Satya** - [GitHub](https://github.com/Satya136-dvsn)

---

⭐ Star this repo if you found it helpful!
