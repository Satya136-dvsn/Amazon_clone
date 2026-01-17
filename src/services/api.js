/**
 * API Service - Handles all HTTP requests to the backend
 * 
 * Security Features:
 * - Credentials included for HTTP-only cookies
 * - Automatic token refresh on 401
 * - Request/Response error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    /**
     * Make an authenticated request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const config = {
            ...options,
            credentials: 'include', // Include cookies for auth
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            let response = await fetch(url, config);

            // Handle token expiration - try to refresh
            if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request
                    response = await fetch(url, config);
                } else {
                    // Redirect to login
                    window.location.href = '/login';
                    return null;
                }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Attempt to refresh the access token
     */
    async refreshToken() {
        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    // ===========================================
    // AUTH ENDPOINTS
    // ===========================================

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
    }

    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { name, email, password },
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    async changePassword(currentPassword, newPassword) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: { currentPassword, newPassword },
        });
    }

    // ===========================================
    // PRODUCT ENDPOINTS
    // ===========================================

    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products${queryString ? `?${queryString}` : ''}`);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async getCategories() {
        return this.request('/products/meta/categories');
    }

    // ===========================================
    // CART ENDPOINTS
    // ===========================================

    async getCart() {
        return this.request('/cart');
    }

    async addToCart(product) {
        return this.request('/cart/add', {
            method: 'POST',
            body: {
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
            },
        });
    }

    async updateCartItem(productId, quantity) {
        return this.request(`/cart/update/${productId}`, {
            method: 'PUT',
            body: { quantity },
        });
    }

    async removeFromCart(productId) {
        return this.request(`/cart/remove/${productId}`, {
            method: 'DELETE',
        });
    }

    async clearCart() {
        return this.request('/cart/clear', {
            method: 'DELETE',
        });
    }

    // ===========================================
    // ORDER ENDPOINTS
    // ===========================================

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: orderData,
        });
    }

    async getOrders() {
        return this.request('/orders');
    }

    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async cancelOrder(orderId) {
        return this.request(`/orders/${orderId}/cancel`, {
            method: 'POST',
        });
    }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
