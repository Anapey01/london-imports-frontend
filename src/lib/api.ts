/**
 * London's Imports - API Client
 * Axios instance with JWT token handling
 */
import axios from 'axios';

const API_BASE_URL = 'https://london-imports-api.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');

    // List of public endpoints where we should NOT send the token
    // This prevents 401 errors if the stored token is invalid/expired
    const publicEndpoints = [
      '/auth/register/',
      '/auth/login/',
      '/auth/register/vendor/',
      '/auth/register/partner/',
      '/auth/password/reset/', // Covers request and confirm
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url && config.url.includes(endpoint)
    );

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CRITICAL FIX: If data is FormData, let browser set Content-Type (multipart)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt refresh (cookies handled automatically)
        await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {}, { withCredentials: true });

        // Retry original request
        return api(originalRequest);
      } catch (refreshError: unknown) {
        // Refresh failed - User must login ONLY if it's an auth error (401/403)
        const err = refreshError as { response?: { status?: number } };
        // We do NOT logout on network errors (status 0/undefined/500) to prevent instability
        if (typeof window !== 'undefined' && err.response && (err.response.status === 401 || err.response.status === 403)) {
          // Clear any local auth state
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');

          // Force logout ONLY if not already on login page to avoid loops
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: unknown) => api.post('/auth/register/', data),
  registerVendor: (data: unknown) => api.post('/auth/register/vendor/', data),
  registerPartner: (data: unknown) => api.post('/auth/register/partner/', data),
  login: (data: { username: string; password: string }) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/', {}), // No refresh token needed in body
  me: () => api.get('/auth/me/'),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: unknown) => api.patch('/auth/profile/', data),
  changePassword: (data: unknown) => api.post('/auth/change-password/', data),
  registerAdmin: (data: unknown) => api.post('/auth/register/admin/', data),
  requestPasswordReset: (data: unknown) => api.post('/auth/password/reset/', data),
  confirmPasswordReset: (data: unknown) => api.post('/auth/password/reset/confirm/', data),
};

export const productsAPI = {
  list: (params?: unknown) => api.get('/products/', { params }),
  preview: (params?: unknown) => api.get('/products/preview/', { params }),
  categories: () => api.get('/products/categories/'),
  detail: (slug: string) => api.get(`/products/${slug}/`),
};

export const ordersAPI = {
  cart: () => api.get('/orders/cart/'),
  addToCart: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) =>
    api.post('/orders/cart/', { product_id: productId, quantity, selected_size: selectedSize, selected_color: selectedColor }),
  removeFromCart: (itemId: string) =>
    api.delete('/orders/cart/', { params: { item_id: itemId } }),
  checkout: (data: unknown) => api.post('/orders/checkout/', data),
  list: () => api.get('/orders/'),
  detail: (orderNumber: string) => api.get(`/orders/${orderNumber}/`),
  track: (orderNumber: string) => api.get(`/orders/${orderNumber}/track/`),
  cancel: (orderNumber: string, reason: string) =>
    api.post(`/orders/${orderNumber}/cancel/`, { reason }),
};

export const paymentsAPI = {
  initiate: (orderNumber: string, paymentType: string) =>
    api.post('/payments/initiate/', { order_number: orderNumber, payment_type: paymentType }),
  verify: (reference: string) => api.post('/payments/verify/', { reference }),
  orderPayments: (orderNumber: string) => api.get(`/payments/order/${orderNumber}/`),
};

export const vendorsAPI = {
  dashboard: () => api.get('/vendors/dashboard/'),
  getProfile: () => api.get('/vendors/profile/'),
  updateProfile: (data: unknown) => api.patch('/vendors/profile/', data),
  payouts: () => api.get('/vendors/payouts/'),
  products: () => api.get('/products/vendor/products/'),
  createProduct: (data: unknown) => api.post('/products/vendor/products/', data),
  updateProduct: (id: string, data: unknown) => api.patch(`/products/vendor/products/${id}/`, data),
  deleteProduct: (id: string) => api.delete(`/products/vendor/products/${id}/`),
  orders: () => api.get('/orders/vendor/orders/'),
  orderDetail: (orderNumber: string) => api.get(`/orders/vendor/orders/${orderNumber}/`),
  getBySlug: (slug: string) => api.get(`/vendors/${slug}/`),
};

// Admin dashboard API
export const adminAPI = {
  // Dashboard stats
  stats: () => api.get('/admin/stats/'),

  // Users management
  users: (params?: unknown) => api.get('/admin/users/', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}/`),
  updateUser: (id: string, data: unknown) => api.patch(`/admin/users/${id}/`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}/`),

  // Orders management  
  orders: (params?: unknown) => api.get('/admin/orders/', { params }),
  getOrder: (id: string) => api.get(`/admin/orders/${id}/`),
  updateOrder: (id: string, data: unknown) => api.patch(`/admin/orders/${id}/`, data),
  deleteOrder: (id: string) => api.delete(`/admin/orders/${id}/`),

  // Products management
  products: (params?: unknown) => api.get('/admin/products/', { params }),
  createProduct: (data: unknown) => api.post('/admin/products/', data),
  updateProduct: (id: string, data: unknown) => api.patch(`/admin/products/${id}/`, data),
  approveProduct: (id: string) => api.post(`/admin/products/${id}/approve/`),
  featureProduct: (id: string, featured: boolean) => api.post(`/admin/products/${id}/feature/`, { featured }),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}/`),

  // Analytics
  analytics: (params?: unknown) => api.get('/admin/analytics/', { params }),

  // Vendors management
  vendors: (params?: unknown) => api.get('/admin/vendors/', { params }),
  getVendor: (id: string) => api.get(`/admin/vendors/${id}/`),
  verifyVendor: (id: string) => api.post(`/admin/vendors/${id}/verify/`),
  rejectVendor: (id: string) => api.post(`/admin/vendors/${id}/reject/`),

  // Settings
  settings: () => api.get('/admin/settings/'),
  updateSettings: (data: unknown) => api.patch('/admin/settings/', data),

  // Maintenance
  recalculateReservations: () => api.post('/auth/admin/recalculate-reservations/'),
};

export default api;
