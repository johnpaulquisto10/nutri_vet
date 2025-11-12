import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth Services
export const authService = {
    login: (email, password) =>
        api.post('/login', { email, password }),
    register: (data) =>
        api.post('/register', data),
    logout: () =>
        api.post('/logout'),
    getCurrentUser: () =>
        api.get('/user'),
};

// User/Animal Services
export const animalService = {
    getAll: () =>
        api.get('/animals'),
    getById: (id) =>
        api.get(`/animals/${id}`),
    create: (data) =>
        api.post('/animals', data),
    update: (id, data) =>
        api.put(`/animals/${id}`, data),
    delete: (id) =>
        api.delete(`/animals/${id}`),
};

// Report Services
export const reportService = {
    getAll: () =>
        api.get('/reports'),
    getById: (id) =>
        api.get(`/reports/${id}`),
    create: (data) =>
        api.post('/reports', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id, data) =>
        api.put(`/reports/${id}`, data),
    delete: (id) =>
        api.delete(`/reports/${id}`),
    markResolved: (id) =>
        api.patch(`/reports/${id}/resolve`, {}),
};

// Advisory Services
export const advisoryService = {
    getAll: () =>
        api.get('/advisories'),
    getById: (id) =>
        api.get(`/advisories/${id}`),
    create: (data) =>
        api.post('/advisories', data),
    update: (id, data) =>
        api.put(`/advisories/${id}`, data),
    delete: (id) =>
        api.delete(`/advisories/${id}`),
};

// User Management Services (Admin)
export const userService = {
    getAll: () =>
        api.get('/users'),
    getById: (id) =>
        api.get(`/users/${id}`),
    update: (id, data) =>
        api.put(`/users/${id}`, data),
    delete: (id) =>
        api.delete(`/users/${id}`),
    getStats: () =>
        api.get('/users/stats'),
};

// Analytics Services (Admin)
export const analyticsService = {
    getDashboardStats: () =>
        api.get('/analytics/dashboard'),
    getReportsTrend: (days = 30) =>
        api.get(`/analytics/reports-trend?days=${days}`),
    getAnimalStats: () =>
        api.get('/analytics/animals'),
    exportReports: (format = 'pdf') =>
        api.get(`/analytics/export?format=${format}`),
};
