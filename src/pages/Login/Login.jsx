import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        const result = login(email, password);

        if (result.success) {
            navigate(redirect ? `/${redirect}` : '/');
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Link to="/" className="auth-logo">
                    <span className="logo-text">amazon</span>
                    <span className="logo-suffix">.clone</span>
                </Link>

                <div className="auth-box">
                    <h1>Sign in</h1>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                            </div>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="auth-terms">
                        By continuing, you agree to Amazon Clone's{' '}
                        <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
                    </div>

                    <div className="auth-help">
                        <details>
                            <summary>Need help?</summary>
                            <div className="help-links">
                                <Link to="/forgot-password">Forgot Password</Link>
                                <Link to="/help">Other issues with Sign-In</Link>
                            </div>
                        </details>
                    </div>
                </div>

                <div className="auth-divider">
                    <span>New to Amazon Clone?</span>
                </div>

                <Link to="/register" className="create-account-btn">
                    Create your Amazon Clone account
                </Link>
            </div>

            <footer className="auth-footer">
                <div className="footer-links">
                    <a href="#">Conditions of Use</a>
                    <a href="#">Privacy Notice</a>
                    <a href="#">Help</a>
                </div>
                <p>© 2024 Amazon Clone. Educational project.</p>
            </footer>
        </div>
    );
};

export default Login;
