import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        };
    };

    const passwordValidation = validatePassword(formData.password);
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (!isPasswordValid) {
            setError('Password does not meet requirements');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const result = register(`${formData.firstName} ${formData.lastName}`, formData.email, formData.password);

        if (result.success) {
            navigate('/');
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
                    <h1>Create account</h1>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="name-fields">
                            <div className="form-group">
                                <label htmlFor="firstName">First name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First name"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last name"
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {formData.password && (
                                <div className="password-requirements">
                                    <p>Password must contain:</p>
                                    <ul>
                                        <li className={passwordValidation.length ? 'valid' : ''}>
                                            {passwordValidation.length && <Check size={12} />} At least 8 characters
                                        </li>
                                        <li className={passwordValidation.uppercase ? 'valid' : ''}>
                                            {passwordValidation.uppercase && <Check size={12} />} One uppercase letter
                                        </li>
                                        <li className={passwordValidation.lowercase ? 'valid' : ''}>
                                            {passwordValidation.lowercase && <Check size={12} />} One lowercase letter
                                        </li>
                                        <li className={passwordValidation.number ? 'valid' : ''}>
                                            {passwordValidation.number && <Check size={12} />} One number
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Re-enter password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create your Amazon Clone account'}
                        </button>
                    </form>

                    <div className="auth-terms">
                        By creating an account, you agree to Amazon Clone's{' '}
                        <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
                    </div>

                    <div className="auth-divider">
                        <span>Already have an account?</span>
                    </div>

                    <Link to="/login" className="create-account-btn">
                        Sign in
                    </Link>
                </div>
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

export default Register;
