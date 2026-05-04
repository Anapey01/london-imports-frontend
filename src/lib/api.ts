/**
 * London's Imports - API Client
 * Axios instance with JWT token handling
 */
import axios from 'axios';
import { siteConfig } from '@/config/site';

const API_BASE_URL = siteConfig.apiUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  timeout: 15000, // 15 seconds timeout to prevent long hangs on slow Render/Database responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Reading from Zustand's persisted storage to ensure single source of truth
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            token = parsed.state?.accessToken;
        } catch (e) {
            console.error('[API] Failed to parse auth storage', e);
        }
    }

    // List of public endpoints where we should NOT send the token
    const publicEndpoints = [
      '/auth/register/',
      '/auth/login/',
      '/auth/google/',
      '/auth/register/vendor/',
      '/auth/register/partner/',
      '/auth/password/reset/', 
      '/products/',
      '/vendors/',
      '/blog/',
      '/orders/stats/',
    ];

    // Check if URL starts with a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url && config.url.startsWith(endpoint)
    );

    const isGetRequest = config.method?.toLowerCase() === 'get';

    // We send the token if:
    // 1. We have a token AND
    // 2. It's NOT a public GET request (to avoid 401s on public pages if token is expired) OR
    // 3. It's an action (POST/PUT/DELETE) - even within a public namespace like /products/ (e.g. reviews)
    if (token && (!isPublicEndpoint || !isGetRequest)) {
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
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const authStorage = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
        let refreshToken = null;
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                refreshToken = parsed.state?.refreshToken;
            } catch (e) {
                console.error('[API] Failed to parse auth storage for refresh', e);
            }
        }
        
        // GUARD: If no refresh token, don't even try. Just reject so caller handles it.
        if (!refreshToken) {
          isRefreshing = false;
          return Promise.reject(error);
        }

        // Attempt refresh
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: refreshToken }, { withCredentials: true });

        const { access } = response.data;
        if (access) {
          // Update the store directly
          const { useAuthStore } = await import('@/stores/authStore');
          useAuthStore.setState({ accessToken: access });
          onRefreshed(access);
        }
        
        isRefreshing = false;

        // Ensure the retry uses the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;
        refreshSubscribers = [];
        
        // Refresh failed - User must login
        const err = refreshError as { response?: { status?: number } };
        const status = err.response?.status;
        
        if (err.response && (status === 400 || status === 401 || status === 403)) {
          const { useAuthStore } = await import('@/stores/authStore');
          useAuthStore.getState().logout();
          
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
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
  googleLogin: (idToken: string) => api.post('/auth/google/', { id_token: idToken }),
  verifyEmail: (code: string) => api.post('/auth/verify-email/', { code }),
  resendOTP: () => api.post('/auth/resend-otp/', {}),
  updateBirthday: (dob: string) => api.patch('/auth/me/birthday/', { date_of_birth: dob }),
};

export const productsAPI = {
  list: (params?: unknown) => api.get('/products/', { params }),
  preview: (params?: unknown) => api.get('/products/preview/', { params }),
  categories: () => api.get('/products/categories/'),
  detail: (slug: string) => api.get(`/products/${slug}/`),
  getTrendingSearches: () => api.get('/products/trending/'),
  recordSearch: (query: string) => api.post('/products/record-search/', { query }),
  addReview: (slug: string, data: { rating: number; comment: string }) => 
    api.post(`/products/${slug}/reviews/`, data),
};

export const ordersAPI = {
  cart: () => api.get('/orders/cart/'),
  addToCart: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string, variantId?: string) =>
    api.post('/orders/cart/', { product_id: productId, quantity, selected_size: selectedSize, selected_color: selectedColor, variant_id: variantId }),
  removeFromCart: (itemId: string) =>
    api.delete('/orders/cart/', { params: { item_id: itemId } }),
  updateCartItem: (itemId: string, quantity: number) =>
    api.patch('/orders/cart/', { item_id: itemId, quantity }),
  checkout: (data: unknown) => api.post('/orders/checkout/', data),
  list: () => api.get('/orders/'),
  detail: (orderNumber: string) => api.get(`/orders/${orderNumber}/`),
  track: (orderNumber: string) => api.get(`/orders/${orderNumber}/track/`),
  cancelOrder: (orderNumber: string, reason?: string) => 
    api.post(`/orders/${orderNumber}/cancel/`, { reason }),
  verifyPayment: (orderNumber: string) => 
    api.post(`/orders/${orderNumber}/verify-payment/`, {}),
  getPublicStats: () => api.get('/orders/stats/'),
};

export const paymentsAPI = {
  initiate: (orderNumber: string, payment_type: string, amount?: number) =>
    api.post('/payments/initiate/', { order_number: orderNumber, payment_type, amount }),
  verify: (data: string | object) =>
    api.post('/payments/verify/', typeof data === 'string' ? { reference: data } : data),
  orderPayments: (orderNumber: string) => api.get(`/payments/order/${orderNumber}/`),
};

export const vendorsAPI = {
  dashboard: () => api.get('/vendors/dashboard/'),
  getProfile: () => api.get('/vendors/profile/'),
  updateProfile: (data: unknown) => api.patch('/vendors/profile/', data),
  payouts: () => api.get('/vendors/payouts/'),
  products: () => api.get('/products/vendor/products/'),
  createProduct: (data: unknown) => api.post('/products/vendor/products/', data),
  getProduct: (id: string) => api.get(`/products/vendor/products/${id}/`),
  updateProduct: (id: string, data: unknown) => {
    const isFormData = data instanceof FormData;
    return api.patch(`/products/vendor/products/${id}/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
  },
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
  getProduct: (id: string) => api.get(`/admin/products/${id}/`),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}/`),
  bulkActivateProducts: (weeks: number = 3) => api.post('/admin/products/bulk-activate/', { weeks }),

  // Analytics
  analytics: (params?: unknown) => api.get('/admin/analytics/', { params }),
  exportAnalytics: (params?: { period: string }) => 
    api.get('/admin/analytics/export/', { params, responseType: 'blob' }),

  // Vendors management
  vendors: (params?: unknown) => api.get('/admin/vendors/', { params }),
  getVendor: (id: string) => api.get(`/admin/vendors/${id}/`),
  verifyVendor: (id: string) => api.post(`/admin/vendors/${id}/verify/`),
  rejectVendor: (id: string) => api.post(`/admin/vendors/${id}/reject/`),

  // Settings
  settings: () => api.get('/admin/settings/'),
  updateSettings: (data: unknown) => api.patch('/admin/settings/', data),
  sendBroadcastEmail: (data: { subject: string; message: string; target?: string; emails?: string[] }) => 
    api.post('/admin/broadcast/', data),
  getAudienceContacts: (target: string) => api.get('/admin/broadcast/contacts/', { params: { target } }),

  // Maintenance
  recalculateReservations: () => api.post('/auth/admin/recalculate-reservations/'),

  // Blog management
  blogPosts: (params?: unknown) => api.get('/admin/blog/', { params }),
  createBlogPost: (data: unknown) => api.post('/admin/blog/', data),
  getBlogPost: (id: string) => api.get(`/admin/blog/${id}/`),
  updateBlogPost: (id: string, data: unknown) => api.patch(`/admin/blog/${id}/`, data),
  deleteBlogPost: (id: string) => api.delete(`/admin/blog/${id}/`),
  publishBlogPost: (id: string) => api.post(`/admin/blog/${id}/publish/`),
};

// Public Blog API
export const blogAPI = {
  list: (params?: { category?: string; featured?: string }) => api.get('/blog/', { params }),
  detail: (slug: string) => api.get(`/blog/${slug}/`),
};

export default api;
