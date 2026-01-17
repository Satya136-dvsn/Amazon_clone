import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Gift, Truck, ArrowRight } from 'lucide-react';
import Carousel from '../../components/Carousel/Carousel';
import ProductCard from '../../components/ProductCard/ProductCard';
import { products, categories, banners } from '../../data/products';
import './Home.css';

const Home = () => {
    const todaysDeals = products.filter(p => p.discount > 15).slice(0, 4);
    const bestSellers = products.filter(p => p.rating >= 4.7).slice(0, 4);
    const electronicsProducts = products.filter(p => p.category === 'Electronics').slice(0, 4);
    const homeProducts = products.filter(p => p.category === 'Home & Kitchen').slice(0, 4);

    return (
        <div className="home">
            {/* Hero Carousel */}
            <Carousel slides={banners} />

            {/* Main Content */}
            <div className="home-content">
                {/* Categories Grid */}
                <section className="home-section categories-section">
                    <div className="categories-grid">
                        {categories.slice(0, 4).map((category) => (
                            <Link
                                to={`/products?category=${category.name}`}
                                key={category.id}
                                className="category-card"
                            >
                                <h3>{category.name}</h3>
                                <div className="category-image-container">
                                    <img src={category.image} alt={category.name} />
                                </div>
                                <span className="category-link">Shop now</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Today's Deals */}
                <section className="home-section">
                    <div className="section-header">
                        <div className="section-title-group">
                            <Zap className="section-icon" size={24} />
                            <h2>Today's Deals</h2>
                        </div>
                        <Link to="/products?sort=discount" className="section-link">
                            See all deals <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {todaysDeals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Promo Banner */}
                <section className="promo-banner">
                    <div className="promo-content">
                        <div className="promo-icon">
                            <Truck size={48} />
                        </div>
                        <div className="promo-text">
                            <h3>FREE Delivery on Prime</h3>
                            <p>Get unlimited free deliveries on millions of items</p>
                        </div>
                        <Link to="/prime" className="promo-btn">Try Prime Free</Link>
                    </div>
                </section>

                {/* Best Sellers */}
                <section className="home-section">
                    <div className="section-header">
                        <div className="section-title-group">
                            <TrendingUp className="section-icon" size={24} />
                            <h2>Best Sellers</h2>
                        </div>
                        <Link to="/products?sort=bestseller" className="section-link">
                            See more <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {bestSellers.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Two Column Section */}
                <section className="home-section two-column">
                    <div className="column-card">
                        <h2>Top picks in Electronics</h2>
                        <div className="mini-grid">
                            {electronicsProducts.slice(0, 4).map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="mini-product">
                                    <img src={product.image} alt={product.title} />
                                    <span className="mini-title">{product.subcategory}</span>
                                </Link>
                            ))}
                        </div>
                        <Link to="/products?category=Electronics" className="see-more">See more</Link>
                    </div>

                    <div className="column-card">
                        <h2>Top picks in Home & Kitchen</h2>
                        <div className="mini-grid">
                            {homeProducts.slice(0, 4).map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="mini-product">
                                    <img src={product.image} alt={product.title} />
                                    <span className="mini-title">{product.subcategory}</span>
                                </Link>
                            ))}
                        </div>
                        <Link to="/products?category=Home%20%26%20Kitchen" className="see-more">See more</Link>
                    </div>
                </section>

                {/* Gift Ideas */}
                <section className="home-section">
                    <div className="section-header">
                        <div className="section-title-group">
                            <Gift className="section-icon" size={24} />
                            <h2>Gift Ideas Under $200</h2>
                        </div>
                        <Link to="/products?maxPrice=200" className="section-link">
                            Shop all gifts <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {products.filter(p => p.price < 200).slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* All Categories */}
                <section className="home-section">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="all-categories-grid">
                        {categories.map((category) => (
                            <Link
                                to={`/products?category=${category.name}`}
                                key={category.id}
                                className="category-item"
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
