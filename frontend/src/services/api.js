import axios from 'axios';

let rawBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecotrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Backend responses wrap useful payload fields in `data`; expose those fields
    // at the top level so all screens consume the same, predictable response shape.
    if (body && typeof body === 'object' && body.data && typeof body.data === 'object') {
      response.data = { ...body, ...body.data, data: body.data };
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'API request failed';
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export const api = {
  // Authentication
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/auth/profile', profileData);
    return res.data;
  },

  // E-Waste Items
  registerItem: async (itemData) => {
    const res = await apiClient.post('/items', itemData);
    return res.data;
  },

  getMyItems: async (params = {}) => {
    const res = await apiClient.get('/items/my', { params });
    return res.data;
  },

  getStakeholderItems: async (params = {}) => {
    const res = await apiClient.get('/items', { params });
    return res.data;
  },

  getItemDetails: async (itemId) => {
    const res = await apiClient.get(`/items/${itemId}`);
    return res.data;
  },

  updateItemStatus: async (itemId, payload) => {
    const res = await apiClient.patch(`/items/${itemId}/status`, payload);
    return res.data;
  },

  recordInspection: async (itemId, payload) => {
    const res = await apiClient.post(`/items/${itemId}/inspection`, payload);
    return res.data;
  },

  // Public Tracking (Zero-Auth)
  getPublicItem: async (itemId) => {
    const res = await apiClient.get(`/public/items/${itemId}`);
    return res.data;
  },

  getPublicHistory: async (itemId) => {
    const res = await apiClient.get(`/public/items/${itemId}/history`);
    return res.data;
  },

  // Admin Operations
  getAdminStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  getAdminItems: async (params = {}) => {
    const res = await apiClient.get('/admin/items', { params });
    return res.data;
  },

  getAdminUsers: async () => {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },

  createAdminUser: async (userData) => {
    const res = await apiClient.post('/admin/users', userData);
    return res.data;
  },

  updateUserStatus: async (userId, accountStatus) => {
    const res = await apiClient.patch(`/admin/users/${userId}/status`, { accountStatus });
    return res.data;
  },
};
