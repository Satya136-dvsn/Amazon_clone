# 🛒 Amazon Clone - Production Ready

A **production-ready** Amazon e-commerce clone with React frontend and secure Express.js backend. Features MongoDB database, JWT authentication, and deployment configurations for Vercel + Railway.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=flat-square&logo=express)

## ✨ Features

### Frontend

- 🏠 Homepage with carousel, deals, categories
- 📦 Product browsing with filters & search
- 🛒 Shopping cart with quantity controls
- 🔐 User authentication (login/register)
- 📱 Fully responsive design

### Backend Security

- 🔒 JWT with HTTP-only cookies
- 🔑 bcrypt password hashing (12 rounds)
- 🛡️ Helmet.js security headers
- ⏱️ Rate limiting (5 auth attempts/15min)
- 🌐 CORS origin validation
- ✅ Express-validator input sanitization

### Database

- 📊 MongoDB with Mongoose ODM
- 👤 User model with secure password handling
- 📦 Product model with search indexes
- 🛒 Cart & Order models

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# Clone repository
git clone https://github.com/Satya136-dvsn/Amazon_clone.git
cd Amazon_clone

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Local Development

```bash
# Terminal 1: Start backend (port 5000)
cd backend
npm run dev

# Terminal 2: Start frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment Guide

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Step 1: Deploy Backend to Railway

1. Create account at [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select the `Amazon_clone` repo, set root directory to `backend`
4. Add MongoDB plugin (or use MongoDB Atlas)
5. Set environment variables:

```env
NODE_ENV=production
JWT_SECRET=<generate-64-char-random-string>
JWT_REFRESH_SECRET=<generate-another-64-char-string>
COOKIE_SECRET=<generate-32-char-string>
MONGODB_URI=<your-mongodb-connection-string>
FRONTEND_URL=https://your-app.vercel.app
```

1. Copy your Railway backend URL (e.g., `https://amazon-clone-backend.up.railway.app`)

#### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set environment variable:

   ```
   VITE_API_URL=https://your-railway-backend-url/api
   ```

3. Deploy!

### Option 2: MongoDB Atlas Setup

1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster (free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string:

   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/amazon-clone
   ```

6. Add to backend `.env`:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amazon-clone
   ```

### Option 3: Seed Database

```bash
cd backend
node seed.js
```

---

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key | Random 64 chars |
| `JWT_REFRESH_SECRET` | Refresh token key | Random 64 chars |
| `COOKIE_SECRET` | Cookie signing | Random 32 chars |
| `FRONTEND_URL` | CORS origin | `https://app.vercel.app` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app/api` |

### Generate Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🏗️ Project Structure

```
├── src/                    # Frontend (React + Vite)
│   ├── components/         # Header, Footer, ProductCard, Carousel
│   ├── pages/              # Home, Products, ProductDetail, Cart, Login
│   ├── context/            # CartContext, AuthContext
│   └── services/           # API service layer
│
├── backend/                # Backend (Express.js)
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── models/
│   │   ├── User.js         # User schema + bcrypt
│   │   ├── Product.js      # Product schema
│   │   ├── Cart.js         # Cart schema
│   │   └── Order.js        # Order schema
│   ├── routes/
│   │   ├── auth.js         # Authentication
│   │   ├── products.js     # Products API
│   │   ├── cart.js         # Cart API
│   │   └── orders.js       # Orders API
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── validation.js   # Input sanitization
│   ├── server.js           # Express server
│   ├── seed.js             # Database seeder
│   ├── railway.toml        # Railway config
│   └── Procfile            # Heroku/Railway
│
├── vercel.json             # Vercel config
└── README.md
```

---

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| POST | `/api/auth/logout` | ❌ |
| POST | `/api/auth/refresh` | ❌ |
| GET | `/api/auth/me` | ✅ |
| POST | `/api/auth/change-password` | ✅ |

### Products

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| GET | `/api/products` | ❌ |
| GET | `/api/products/:id` | ❌ |
| GET | `/api/products/meta/categories` | ❌ |

### Cart

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| GET | `/api/cart` | ✅ |
| POST | `/api/cart/add` | ✅ |
| PUT | `/api/cart/update/:id` | ✅ |
| DELETE | `/api/cart/remove/:id` | ✅ |
| DELETE | `/api/cart/clear` | ✅ |

### Orders

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| POST | `/api/orders` | ✅ |
| GET | `/api/orders` | ✅ |
| GET | `/api/orders/:id` | ✅ |
| POST | `/api/orders/:id/cancel` | ✅ |

---

## 🧪 Production Checklist

- [ ] Generate strong random secrets for JWT and cookies
- [ ] Set up MongoDB Atlas with proper IP whitelist
- [ ] Configure CORS with production frontend URL
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set `NODE_ENV=production`
- [ ] Run database seeder (`node seed.js`)
- [ ] Test all authentication flows
- [ ] Verify rate limiting is working

---

## 📄 License

MIT License - Educational project, not affiliated with Amazon.

## 👤 Author

**Satya** - [GitHub](https://github.com/Satya136-dvsn)

---

⭐ Star this repo if you found it helpful!
