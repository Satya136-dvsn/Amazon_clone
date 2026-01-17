import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, variant = 'default' }) => {
    const { addToCart } = useCart();

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? '#FFA41C' : 'none'}
                color={i < Math.floor(rating) ? '#FFA41C' : '#D5D9D9'}
            />
        ));
    };

    const formatPrice = (price) => {
        const [whole, fraction = '00'] = price.toFixed(2).split('.');
        return { whole, fraction };
    };

    const priceInfo = formatPrice(product.price);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    if (variant === 'compact') {
        return (
            <Link to={`/product/${product.id}`} className="product-card compact">
                <div className="product-image-container">
                    <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-price">
                        <span className="price-symbol">$</span>
                        <span className="price-whole">{priceInfo.whole}</span>
                        <span className="price-fraction">{priceInfo.fraction}</span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-badges">
                {product.discount > 0 && (
                    <span className="badge badge-deal">{product.discount}% off</span>
                )}
                {product.prime && (
                    <span className="badge badge-prime">Prime</span>
                )}
            </div>

            <button className="wishlist-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <Heart size={18} />
            </button>

            <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
            </div>

            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>

                <div className="product-rating">
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span className="rating-count">({product.reviews.toLocaleString()})</span>
                </div>

                <div className="product-pricing">
                    <div className="product-price">
                        <span className="price-symbol">$</span>
                        <span className="price-whole">{priceInfo.whole}</span>
                        <span className="price-fraction">{priceInfo.fraction}</span>
                    </div>
                    {product.originalPrice > product.price && (
                        <div className="original-price">
                            <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {product.prime && (
                    <div className="prime-delivery">
                        <span className="prime-badge">prime</span>
                        <span className="delivery-text">FREE Delivery</span>
                    </div>
                )}

                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <ShoppingCart size={16} />
                    Add to Cart
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
