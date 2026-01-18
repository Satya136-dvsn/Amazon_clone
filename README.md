# 🛒 Amazon Clone - Full-Stack E-Commerce Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A production-ready Amazon-inspired e-commerce application showcasing modern full-stack development practices**

[🚀 Live Demo](https://satya136-dvsn.github.io/Amazon_clone) · [� Frontend Code](#frontend-architecture) · [🔧 Backend Code](#backend-architecture)

</div>

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td width="50%">

### Homepage

- Hero carousel with auto-play
- Category navigation
- Product grid with hover effects

</td>
<td width="50%">

### Product Details

- Image gallery
- Feature highlights
- Add to cart with quantity

</td>
</tr>
</table>
</div>

---

## ✨ Key Features

### 🛍️ Shopping Experience

- **Product Catalog** - Browse products with filtering by category, price, and rating
- **Search Functionality** - Find products quickly with real-time search
- **Shopping Cart** - Add, remove, and update quantities with persistent state
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 🔐 Security Implementation

- **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- **Password Security** - bcrypt hashing with 12 salt rounds
- **Rate Limiting** - Protection against brute force attacks (5 attempts/15 min)
- **Input Validation** - Server-side sanitization with express-validator
- **Security Headers** - Helmet.js for XSS, CSRF, and clickjacking protection

### 🏗️ Architecture Highlights

- **RESTful API Design** - Clean, predictable endpoint structure
- **Context API** - Global state management for cart and authentication
- **Mongoose ODM** - Schema-based MongoDB data modeling
- **Error Handling** - Centralized error handling with meaningful responses

---

## �️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| React Router | Client-side routing |
| Context API | State management |
| Vite | Build tool |
| CSS3 | Styling |
| Lucide React | Icons |

</td>
<td valign="top" width="50%">

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password hashing |

</td>
</tr>
</table>

### Security & DevOps

`Helmet.js` `CORS` `express-rate-limit` `cookie-parser` `GitHub Pages` `Git`

---

## 📁 Project Structure

```
amazon-clone/
├── src/                          # Frontend (React)
│   ├── components/               # Reusable UI components
│   │   ├── Header/              # Navigation with search & cart
│   │   ├── Footer/              # Site footer
│   │   ├── ProductCard/         # Product display card
│   │   └── Carousel/            # Hero banner slider
│   ├── pages/                   # Route pages
│   │   ├── Home/                # Landing page
│   │   ├── Products/            # Product listing with filters
│   │   ├── ProductDetail/       # Single product view
│   │   ├── Cart/                # Shopping cart
│   │   └── Login & Register/    # Authentication pages
│   ├── context/                 # Global state
│   │   ├── CartContext.jsx      # Cart state management
│   │   └── AuthContext.jsx      # User authentication state
│   └── services/                # API integration
│       └── api.js               # HTTP client with interceptors
│
├── backend/                      # Backend (Express.js)
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # User with password methods
│   │   ├── Product.js           # Product with search index
│   │   ├── Cart.js              # User cart
│   │   └── Order.js             # Order with status tracking
│   ├── routes/                  # API endpoints
│   │   ├── auth.js              # Authentication routes
│   │   ├── products.js          # Product CRUD
│   │   ├── cart.js              # Cart operations
│   │   └── orders.js            # Order management
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # JWT verification
│   │   └── validation.js        # Input sanitization
│   └── server.js                # Application entry point
```

---

## � API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new user account |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/logout` | Clear session |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Get current user (protected) |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (with filters) |
| `GET` | `/api/products/:id` | Get single product |
| `GET` | `/api/products/meta/categories` | Get categories |

### Cart Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cart` | Get user's cart |
| `POST` | `/api/cart/add` | Add item to cart |
| `PUT` | `/api/cart/update/:id` | Update quantity |
| `DELETE` | `/api/cart/remove/:id` | Remove item |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

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

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

### Running Locally

```bash
# Terminal 1: Start backend (port 5000)
cd backend
npm run dev

# Terminal 2: Start frontend (port 5173)
npm run dev
```

Visit `http://localhost:5173`

---

## 🎯 What I Learned

- **React Patterns** - Component composition, custom hooks, context management
- **API Security** - JWT flow, secure cookie handling, rate limiting strategies
- **Database Design** - Schema modeling, indexing, data relationships
- **DevOps Basics** - CI/CD concepts, environment management, deployment

---

## 📈 Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Order tracking with real-time updates
- [ ] Product reviews and ratings
- [ ] Admin dashboard for inventory
- [ ] Email notifications

---

## 👨‍� Author

**Satya** - Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Satya136--dvsn-181717?style=flat-square&logo=github)](https://github.com/Satya136-dvsn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)]([https://linkedin.com/in/your-profile](https://www.linkedin.com/in/venkatasatyanarayana-duba-679372255))

---

<div align="center">

### ⭐ Star this repo if you found it helpful

*Built with ❤️ using the MERN Stack*

</div>
