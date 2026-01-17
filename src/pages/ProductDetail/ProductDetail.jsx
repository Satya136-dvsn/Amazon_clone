import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { products } from '../../data/products';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product Not Found</h2>
                <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={18}
                fill={i < Math.floor(rating) ? '#FFA41C' : 'none'}
                color={i < Math.floor(rating) ? '#FFA41C' : '#D5D9D9'}
            />
        ));
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const formatPrice = (price) => {
        const [whole, fraction = '00'] = price.toFixed(2).split('.');
        return { whole, fraction };
    };

    const priceInfo = formatPrice(product.price);
    const savings = product.originalPrice - product.price;

    // Simulated multiple images
    const images = [product.image, product.image, product.image, product.image];

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to={`/products?category=${product.category}`}>{product.category}</Link>
                <span>/</span>
                <span>{product.subcategory}</span>
            </div>

            <div className="product-detail-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="thumbnail-list">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onMouseEnter={() => setSelectedImage(index)}
                            >
                                <img src={img} alt={`${product.title} ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={images[selectedImage]} alt={product.title} />
                        <button className="wishlist-btn">
                            <Heart size={24} />
                        </button>
                        <button className="share-btn">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.title}</h1>

                    <div className="product-meta">
                        <span className="brand">Visit the <a href="#">{product.brand} Store</a></span>
                        <div className="rating-row">
                            <div className="stars">{renderStars(product.rating)}</div>
                            <span className="rating-value">{product.rating}</span>
                            <a href="#reviews" className="reviews-link">
                                {product.reviews.toLocaleString()} ratings
                            </a>
                        </div>
                    </div>

                    <div className="price-section">
                        {product.discount > 0 && (
                            <div className="discount-badge">
                                <span className="discount-percent">-{product.discount}%</span>
                                <span className="limited-deal">Limited time deal</span>
                            </div>
                        )}
                        <div className="price-row">
                            <span className="price-symbol">$</span>
                            <span className="price-whole">{priceInfo.whole}</span>
                            <span className="price-fraction">{priceInfo.fraction}</span>
                        </div>
                        {savings > 0 && (
                            <div className="savings-row">
                                <span className="original-price">List Price: <s>${product.originalPrice.toFixed(2)}</s></span>
                                <span className="savings">You Save: ${savings.toFixed(2)} ({product.discount}%)</span>
                            </div>
                        )}
                    </div>

                    <div className="product-features">
                        <h3>About this item</h3>
                        <ul>
                            {product.features.map((feature, index) => (
                                <li key={index}>
                                    <Check size={16} className="check-icon" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Buy Box */}
                <div className="buy-box">
                    <div className="price-row">
                        <span className="price-symbol">$</span>
                        <span className="price-whole">{priceInfo.whole}</span>
                        <span className="price-fraction">{priceInfo.fraction}</span>
                    </div>

                    {product.prime && (
                        <div className="prime-info">
                            <span className="prime-badge">prime</span>
                            <span>FREE delivery <strong>Tomorrow</strong></span>
                        </div>
                    )}

                    <div className="delivery-info">
                        <Truck size={18} />
                        <div>
                            <span className="delivery-date">Delivery: January 19 - 21</span>
                            <a href="#">Details</a>
                        </div>
                    </div>

                    <div className="stock-status">
                        {product.inStock ? (
                            <span className="in-stock"><Check size={16} /> In Stock</span>
                        ) : (
                            <span className="out-of-stock">Out of Stock</span>
                        )}
                    </div>

                    <div className="quantity-selector">
                        <label>Quantity:</label>
                        <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                    >
                        {addedToCart ? (
                            <>
                                <Check size={18} /> Added to Cart
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={18} /> Add to Cart
                            </>
                        )}
                    </button>

                    <button className="btn-buy-now">
                        Buy Now
                    </button>

                    <div className="secure-info">
                        <div className="info-item">
                            <Shield size={16} />
                            <span>Secure transaction</span>
                        </div>
                        <div className="info-item">
                            <RotateCcw size={16} />
                            <span>Easy 30-day returns</span>
                        </div>
                    </div>

                    <div className="seller-info">
                        <div className="seller-row">
                            <span className="label">Ships from</span>
                            <span className="value">Amazon</span>
                        </div>
                        <div className="seller-row">
                            <span className="label">Sold by</span>
                            <span className="value">{product.brand}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="related-products">
                    <h2>Products related to this item</h2>
                    <div className="related-grid">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetail;
