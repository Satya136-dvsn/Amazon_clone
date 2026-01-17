import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu, User, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const { getCartCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const categories = [
        "All", "Electronics", "Fashion", "Home & Kitchen", "Books",
        "Toys & Games", "Sports", "Beauty", "Video Games"
    ];

    return (
        <header className="header">
            {/* Main Navigation Bar */}
            <nav className="nav-main">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        <span className="logo-text">amazon</span>
                        <span className="logo-suffix">.clone</span>
                    </Link>

                    <div className="location">
                        <MapPin size={18} />
                        <div className="location-text">
                            <span className="location-top">Deliver to</span>
                            <span className="location-bottom">India</span>
                        </div>
                    </div>
                </div>

                <form className="search-container" onSubmit={handleSearch}>
                    <select className="search-category">
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Amazon.clone"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        <Search size={22} />
                    </button>
                </form>

                <div className="nav-right">
                    <div
                        className="nav-item account"
                        onMouseEnter={() => setShowAccountMenu(true)}
                        onMouseLeave={() => setShowAccountMenu(false)}
                    >
                        <div className="nav-item-content">
                            <span className="nav-line1">
                                {isAuthenticated ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
                            </span>
                            <span className="nav-line2">
                                Account & Lists <ChevronDown size={12} />
                            </span>
                        </div>

                        {showAccountMenu && (
                            <div className="account-dropdown">
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/account" className="dropdown-item">Your Account</Link>
                                        <Link to="/orders" className="dropdown-item">Your Orders</Link>
                                        <Link to="/wishlist" className="dropdown-item">Your Wishlist</Link>
                                        <hr className="dropdown-divider" />
                                        <button onClick={logout} className="dropdown-item logout-btn">
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="dropdown-signin-btn">Sign in</Link>
                                        <p className="dropdown-register">
                                            New customer? <Link to="/register">Start here</Link>
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <Link to="/orders" className="nav-item">
                        <span className="nav-line1">Returns</span>
                        <span className="nav-line2">& Orders</span>
                    </Link>

                    <Link to="/cart" className="nav-item cart">
                        <div className="cart-icon">
                            <ShoppingCart size={28} />
                            <span className="cart-count">{getCartCount()}</span>
                        </div>
                        <span className="cart-text">Cart</span>
                    </Link>
                </div>
            </nav>

            {/* Secondary Navigation Bar */}
            <nav className="nav-secondary">
                <div className="nav-secondary-left">
                    <button className="all-menu">
                        <Menu size={20} />
                        <span>All</span>
                    </button>
                    <Link to="/products?category=deals" className="nav-link">Today's Deals</Link>
                    <Link to="/products" className="nav-link">Shop All</Link>
                    <Link to="/products?category=Electronics" className="nav-link">Electronics</Link>
                    <Link to="/products?category=Fashion" className="nav-link">Fashion</Link>
                    <Link to="/products?category=Home & Kitchen" className="nav-link">Home</Link>
                    <Link to="/products?prime=true" className="nav-link">Prime</Link>
                    <Link to="/products?category=Books" className="nav-link">Books</Link>
                </div>
                <div className="nav-secondary-right">
                    <span className="promo-text">🎉 New Year Sale - Up to 60% Off!</span>
                </div>
            </nav>
        </header>
    );
};

export default Header;
