# 🛒 Amazon Clone

A **production-ready** Amazon e-commerce clone built with React + Vite frontend and a **secure Express.js backend**. Features comprehensive security measures including JWT authentication, bcrypt password hashing, rate limiting, and more.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=flat-square&logo=express)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🏠 Frontend

- **Homepage** - Hero carousel, deals, categories
- **Product Browsing** - Filters, sorting, search, pagination
- **Product Details** - Image gallery, features, buy box
- **Shopping Cart** - Add/remove/update, order summary
- **Authentication** - Login, registration with validation

### 🔒 Backend Security

- **JWT Authentication** - Secure tokens with HTTP-only cookies
- **bcrypt Hashing** - 12 rounds for password security
- **Helmet.js** - HTTP security headers
- **Rate Limiting** - Brute force protection (5 auth attempts/15min)
- **CORS** - Strict origin validation
- **Input Validation** - express-validator sanitization
- **Signed Cookies** - CSRF protection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Satya136-dvsn/Amazon_clone.git
cd Amazon_clone

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Running the Application

```bash
# Terminal 1: Start backend server (port 5000)
cd backend
npm run dev

# Terminal 2: Start frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🏗️ Project Structure

```
├── src/                    # Frontend (React)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # React Context providers
│   ├── services/           # API service layer
│   └── data/               # Static data
│
├── backend/                # Backend (Express.js)
│   ├── routes/             # API endpoints
│   │   ├── auth.js         # Authentication routes
│   │   ├── products.js     # Product routes
│   │   ├── cart.js         # Cart routes
│   │   └── orders.js       # Order routes
│   ├── middleware/         # Express middleware
│   │   ├── auth.js         # JWT verification
│   │   └── validation.js   # Input validation
│   ├── data/               # Data storage
│   ├── server.js           # Express server
│   └── .env.example        # Environment template
```

## 🔐 Security Implementation

### Password Security

```javascript
// 12 rounds bcrypt hashing
const hashedPassword = await bcrypt.hash(password, 12);
```

### JWT Configuration

```javascript
// Short-lived access tokens (15 min)
// HTTP-only cookies
// Automatic token refresh
```

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth endpoints | 5 requests | 15 minutes |
| General API | 100 requests | 15 minutes |

### HTTP Headers (Helmet)

- Content-Security-Policy
- X-XSS-Protection
- X-Content-Type-Options
- Strict-Transport-Security

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router |
| **Backend** | Express.js, Node.js |
| **Auth** | JWT, bcryptjs |
| **Security** | Helmet, CORS, express-rate-limit |
| **Validation** | express-validator |
| **Icons** | Lucide React |

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Get current user |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Get single product |

### Cart (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:id` | Update quantity |
| DELETE | `/api/cart/remove/:id` | Remove item |

### Orders (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |

## 🔧 Environment Variables

Create `backend/.env` based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
COOKIE_SECRET=your-cookie-secret
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Never commit `.env` files to Git!**

## 📱 Responsive Design

Fully responsive across all devices:

- 📱 Mobile (< 576px)
- 📱 Tablet (576px - 992px)
- 💻 Desktop (> 992px)

## 🧪 For Production

Before deploying to production:

1. ✅ Use strong, random secrets for JWT and cookies
2. ✅ Enable HTTPS/SSL
3. ✅ Set `NODE_ENV=production`
4. ✅ Use a proper database (MongoDB/PostgreSQL)
5. ✅ Configure production CORS origins
6. ✅ Set up monitoring and logging
7. ✅ Enable secure cookie flags

## 📄 License

MIT License - Educational project, not affiliated with Amazon.

## 👤 Author

**Satya** - [GitHub](https://github.com/Satya136-dvsn)

---

⭐ Star this repo if you found it helpful!
