import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
            </div>

            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-section">
                        <h4>Get to Know Us</h4>
                        <Link to="/about">About Amazon Clone</Link>
                        <Link to="/careers">Careers</Link>
                        <Link to="/press">Press Releases</Link>
                        <Link to="/investors">Amazon Science</Link>
                    </div>

                    <div className="footer-section">
                        <h4>Make Money with Us</h4>
                        <Link to="/sell">Sell products on Amazon</Link>
                        <Link to="/affiliate">Become an Affiliate</Link>
                        <Link to="/advertise">Advertise Your Products</Link>
                        <Link to="/publish">Self-Publish with Us</Link>
                    </div>

                    <div className="footer-section">
                        <h4>Amazon Payment Products</h4>
                        <Link to="/business-card">Amazon Business Card</Link>
                        <Link to="/shop-points">Shop with Points</Link>
                        <Link to="/reload">Reload Your Balance</Link>
                        <Link to="/currency">Amazon Currency Converter</Link>
                    </div>

                    <div className="footer-section">
                        <h4>Let Us Help You</h4>
                        <Link to="/account">Your Account</Link>
                        <Link to="/orders">Your Orders</Link>
                        <Link to="/shipping">Shipping Rates & Policies</Link>
                        <Link to="/returns">Returns & Replacements</Link>
                        <Link to="/help">Help</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-logo">
                    <span className="logo-text">amazon</span>
                    <span className="logo-suffix">.clone</span>
                </div>
                <div className="footer-info">
                    <p>© 2024 Amazon Clone. Educational project - not affiliated with Amazon.</p>
                    <div className="footer-links">
                        <Link to="/conditions">Conditions of Use</Link>
                        <Link to="/privacy">Privacy Notice</Link>
                        <Link to="/interest-ads">Interest-Based Ads</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
