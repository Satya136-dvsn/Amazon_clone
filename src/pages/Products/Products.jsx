import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, Star, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { products, categories } from '../../data/products';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(true);

    // Get filter values from URL
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const sortBy = searchParams.get('sort') || 'relevance';
    const primeOnly = searchParams.get('prime') === 'true';
    const minRating = parseInt(searchParams.get('minRating') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '10000');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (categoryFilter && categoryFilter !== 'deals') {
            result = result.filter(p => p.category === categoryFilter);
        }

        // Deals filter
        if (categoryFilter === 'deals') {
            result = result.filter(p => p.discount > 0);
        }

        // Prime filter
        if (primeOnly) {
            result = result.filter(p => p.prime);
        }

        // Rating filter
        if (minRating > 0) {
            result = result.filter(p => p.rating >= minRating);
        }

        // Price filter
        result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // Sort
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                result.sort((a, b) => b.discount - a.discount);
                break;
            case 'bestseller':
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                break;
        }

        return result;
    }, [searchQuery, categoryFilter, sortBy, primeOnly, minRating, maxPrice, minPrice]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };

    const clearAllFilters = () => {
        setSearchParams({});
    };

    const hasActiveFilters = categoryFilter || primeOnly || minRating > 0 || searchQuery;

    return (
        <div className="products-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>{categoryFilter || 'All Products'}</span>
            </div>

            <div className="products-container">
                {/* Sidebar Filters */}
                <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                    <div className="filters-header">
                        <h3>Filters</h3>
                        {hasActiveFilters && (
                            <button className="clear-filters" onClick={clearAllFilters}>
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="filter-group">
                        <h4>Department</h4>
                        <ul className="filter-list">
                            <li>
                                <button
                                    className={!categoryFilter ? 'active' : ''}
                                    onClick={() => updateFilter('category', '')}
                                >
                                    All Categories
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        className={categoryFilter === cat.name ? 'active' : ''}
                                        onClick={() => updateFilter('category', cat.name)}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rating Filter */}
                    <div className="filter-group">
                        <h4>Customer Reviews</h4>
                        <ul className="filter-list">
                            {[4, 3, 2, 1].map((rating) => (
                                <li key={rating}>
                                    <button
                                        className={minRating === rating ? 'active' : ''}
                                        onClick={() => updateFilter('minRating', rating.toString())}
                                    >
                                        <div className="stars-filter">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < rating ? '#FFA41C' : 'none'}
                                                    color={i < rating ? '#FFA41C' : '#D5D9D9'}
                                                />
                                            ))}
                                        </div>
                                        <span>& Up</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Filter */}
                    <div className="filter-group">
                        <h4>Price</h4>
                        <ul className="filter-list price-list">
                            <li>
                                <button onClick={() => { updateFilter('minPrice', '0'); updateFilter('maxPrice', '50'); }}>
                                    Under $50
                                </button>
                            </li>
                            <li>
                                <button onClick={() => { updateFilter('minPrice', '50'); updateFilter('maxPrice', '100'); }}>
                                    $50 to $100
                                </button>
                            </li>
                            <li>
                                <button onClick={() => { updateFilter('minPrice', '100'); updateFilter('maxPrice', '500'); }}>
                                    $100 to $500
                                </button>
                            </li>
                            <li>
                                <button onClick={() => { updateFilter('minPrice', '500'); updateFilter('maxPrice', '1000'); }}>
                                    $500 to $1000
                                </button>
                            </li>
                            <li>
                                <button onClick={() => { updateFilter('minPrice', '1000'); updateFilter('maxPrice', '10000'); }}>
                                    $1000 & Above
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Prime Filter */}
                    <div className="filter-group">
                        <h4>Shipping</h4>
                        <label className="checkbox-filter">
                            <input
                                type="checkbox"
                                checked={primeOnly}
                                onChange={(e) => updateFilter('prime', e.target.checked ? 'true' : '')}
                            />
                            <span className="prime-text">Prime Eligible</span>
                        </label>
                    </div>
                </aside>

                {/* Products Main */}
                <main className="products-main">
                    {/* Top Bar */}
                    <div className="products-topbar">
                        <div className="results-info">
                            <button
                                className="filter-toggle"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} />
                                Filters
                            </button>
                            <span className="results-count">
                                {filteredProducts.length} results
                                {searchQuery && ` for "${searchQuery}"`}
                            </span>
                        </div>

                        <div className="topbar-actions">
                            <div className="sort-dropdown">
                                <label>Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating">Avg. Customer Review</option>
                                    <option value="bestseller">Best Sellers</option>
                                    <option value="discount">Discount</option>
                                </select>
                            </div>

                            <div className="view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Tags */}
                    {hasActiveFilters && (
                        <div className="active-filters">
                            {categoryFilter && (
                                <span className="filter-tag">
                                    {categoryFilter}
                                    <button onClick={() => updateFilter('category', '')}>
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {primeOnly && (
                                <span className="filter-tag">
                                    Prime
                                    <button onClick={() => updateFilter('prime', '')}>
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {minRating > 0 && (
                                <span className="filter-tag">
                                    {minRating}+ Stars
                                    <button onClick={() => updateFilter('minRating', '')}>
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="filter-tag">
                                    "{searchQuery}"
                                    <button onClick={() => updateFilter('search', '')}>
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className={`products-grid ${viewMode}`}>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search terms</p>
                            <button onClick={clearAllFilters} className="btn btn-primary">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
