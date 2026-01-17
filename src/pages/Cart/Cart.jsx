import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Lock, Truck, Gift } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = subtotal > 35 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=checkout');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <ShoppingBag size={80} className="empty-icon" />
                    <h2>Your Amazon Cart is empty</h2>
                    <p>Shop today's deals</p>
                    <Link to="/products" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Cart Items */}
                <div className="cart-items-section">
                    <div className="cart-header">
                        <h1>Shopping Cart</h1>
                        <button className="deselect-btn" onClick={clearCart}>
                            Clear cart
                        </button>
                    </div>
                    <span className="price-header">Price</span>

                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <Link to={`/product/${item.id}`}>
                                        <img src={item.image} alt={item.title} />
                                    </Link>
                                </div>

                                <div className="item-details">
                                    <Link to={`/product/${item.id}`} className="item-title">
                                        {item.title}
                                    </Link>

                                    <div className="item-meta">
                                        {item.inStock ? (
                                            <span className="in-stock">In Stock</span>
                                        ) : (
                                            <span className="out-of-stock">Out of Stock</span>
                                        )}
                                        {item.prime && (
                                            <span className="prime-badge">prime</span>
                                        )}
                                    </div>

                                    <div className="item-options">
                                        <span className="gift-option">
                                            <input type="checkbox" id={`gift-${item.id}`} />
                                            <label htmlFor={`gift-${item.id}`}>This is a gift</label>
                                        </span>
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-control">
                                            <button
                                                onClick={() => item.quantity > 1
                                                    ? updateQuantity(item.id, item.quantity - 1)
                                                    : removeFromCart(item.id)
                                                }
                                                className="qty-btn"
                                            >
                                                {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="qty-btn"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="divider">|</span>
                                        <button
                                            className="action-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Delete
                                        </button>
                                        <span className="divider">|</span>
                                        <button className="action-btn">Save for later</button>
                                        <span className="divider">|</span>
                                        <button className="action-btn">See more like this</button>
                                    </div>
                                </div>

                                <div className="item-price">
                                    <span className="price-current">${(item.price * item.quantity).toFixed(2)}</span>
                                    {item.originalPrice > item.price && (
                                        <span className="price-original">
                                            <s>${(item.originalPrice * item.quantity).toFixed(2)}</s>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-subtotal">
                        Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):
                        <strong>${subtotal.toFixed(2)}</strong>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <div className="free-shipping-banner">
                        <Truck size={20} />
                        {subtotal > 35 ? (
                            <span>Your order qualifies for <strong>FREE Shipping!</strong></span>
                        ) : (
                            <span>Add <strong>${(35 - subtotal).toFixed(2)}</strong> for FREE Shipping</span>
                        )}
                    </div>

                    <div className="summary-content">
                        <div className="summary-row subtotal">
                            <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                            <strong>${subtotal.toFixed(2)}</strong>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                        >
                            <Lock size={16} />
                            Proceed to checkout
                        </button>

                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated tax:</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Order total:</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="gift-card-section">
                        <Gift size={18} />
                        <input type="text" placeholder="Enter gift card code" />
                        <button>Apply</button>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <section className="cart-recommendations">
                <h2>Customers who bought items in your cart also bought</h2>
                <p className="more-link">
                    <Link to="/products">Browse more products →</Link>
                </p>
            </section>
        </div>
    );
};

export default Cart;
