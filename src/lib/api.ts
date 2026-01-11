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
      '/auth/password/reset/', // Covers request and confirm
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url && config.url.includes(endpoint)
    );

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
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
      } catch (refreshError) {
        // Refresh failed - User must login
        if (typeof window !== 'undefined') {
          // Optional: Call logout endpoint to clear cookies server-side
          // window.location.href = '/login'; 
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register/', data),
  registerVendor: (data: any) => api.post('/auth/register/vendor/', data),
  login: (data: { username: string; password: string }) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/', {}), // No refresh token needed in body
  me: () => api.get('/auth/me/'),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
  changePassword: (data: any) => api.post('/auth/change-password/', data),
  registerAdmin: (data: any) => api.post('/auth/register/admin/', data),
  requestPasswordReset: (data: any) => api.post('/auth/password/reset/', data),
  confirmPasswordReset: (data: any) => api.post('/auth/password/reset/confirm/', data),
};

export const productsAPI = {
  list: (params?: any) => api.get('/products/', { params }),
  preview: (params?: any) => api.get('/products/preview/', { params }),
  categories: () => api.get('/products/categories/'),
  detail: (slug: string) => api.get(`/products/${slug}/`),
};

export const ordersAPI = {
  cart: () => api.get('/orders/cart/'),
  addToCart: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) =>
    api.post('/orders/cart/', { product_id: productId, quantity, selected_size: selectedSize, selected_color: selectedColor }),
  removeFromCart: (itemId: string) =>
    api.delete('/orders/cart/', { params: { item_id: itemId } }),
  checkout: (data: any) => api.post('/orders/checkout/', data),
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
  updateProfile: (data: any) => api.patch('/vendors/profile/', data),
  payouts: () => api.get('/vendors/payouts/'),
  products: () => api.get('/products/vendor/products/'),
  createProduct: (data: any) => api.post('/products/vendor/products/', data),
  updateProduct: (id: string, data: any) => api.patch(`/products/vendor/products/${id}/`, data),
  orders: () => api.get('/orders/vendor/orders/'),
};

// Admin dashboard API
export const adminAPI = {
  // Dashboard stats
  stats: () => api.get('/admin/stats/'),

  // Users management
  users: (params?: any) => api.get('/admin/users/', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}/`),
  updateUser: (id: string, data: any) => api.patch(`/admin/users/${id}/`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}/`),

  // Orders management  
  orders: (params?: any) => api.get('/admin/orders/', { params }),
  getOrder: (id: string) => api.get(`/admin/orders/${id}/`),
  updateOrder: (id: string, data: any) => api.patch(`/admin/orders/${id}/`, data),

  // Products management
  products: (params?: any) => api.get('/admin/products/', { params }),
  createProduct: (data: any) => api.post('/admin/products/', data),
  updateProduct: (id: string, data: any) => api.patch(`/admin/products/${id}/`, data),
  approveProduct: (id: string) => api.post(`/admin/products/${id}/approve/`),
  featureProduct: (id: string, featured: boolean) => api.post(`/admin/products/${id}/feature/`, { featured }),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}/`),

  // Analytics
  analytics: (params?: any) => api.get('/admin/analytics/', { params }),

  // Vendors management
  vendors: (params?: any) => api.get('/admin/vendors/', { params }),
  getVendor: (id: string) => api.get(`/admin/vendors/${id}/`),
  verifyVendor: (id: string) => api.post(`/admin/vendors/${id}/verify/`),
  rejectVendor: (id: string) => api.post(`/admin/vendors/${id}/reject/`),

  // Settings
  settings: () => api.get('/admin/settings/'),
  updateSettings: (data: any) => api.patch('/admin/settings/', data),
};

export default api;
