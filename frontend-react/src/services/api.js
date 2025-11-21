import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Using token-based auth, not session cookies
    withCredentials: false,
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
    getProfile: () =>
        api.get('/profile'),
    updateProfile: (data) =>
        api.put('/profile', data),
};

// Dashboard Services
export const dashboardService = {
    getFarmerDashboard: () =>
        api.get('/dashboard'),
    getAdminDashboard: () =>
        api.get('/admin/dashboard'),
};

// Insurance Application Services
export const insuranceService = {
    getAll: () =>
        api.get('/insurance-applications'),
    getById: (id) =>
        api.get(`/insurance-applications/${id}`),
    create: (data) =>
        api.post('/insurance-applications', data),
    update: (id, data) =>
        api.put(`/insurance-applications/${id}`, data),
    delete: (id) =>
        api.delete(`/insurance-applications/${id}`),
    getStatistics: () =>
        api.get('/insurance-applications/stats/summary'),
    // Admin actions
    approve: (id, adminNotes) =>
        api.post(`/admin/insurance-applications/${id}/approve`, { admin_notes: adminNotes }),
    reject: (id, adminNotes) =>
        api.post(`/admin/insurance-applications/${id}/reject`, { admin_notes: adminNotes }),
};

// Disease Report Services
export const reportService = {
    getAll: () =>
        api.get('/disease-reports'),
    getById: (id) =>
        api.get(`/disease-reports/${id}`),
    create: (data) =>
        api.post('/disease-reports', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    update: (id, data) =>
        api.put(`/disease-reports/${id}`, data),
    delete: (id) =>
        api.delete(`/disease-reports/${id}`),
    getMapData: () =>
        api.get('/disease-reports/map/data'),
    getStatistics: () =>
        api.get('/disease-reports/stats/summary'),
    // Admin actions
    investigate: (id, adminNotes) =>
        api.post(`/admin/disease-reports/${id}/investigate`, { admin_notes: adminNotes }),
    resolve: (id, adminNotes) =>
        api.post(`/admin/disease-reports/${id}/resolve`, { admin_notes: adminNotes }),
};

// Advisory Services
export const advisoryService = {
    getAll: () =>
        api.get('/advisories'),
    getById: (id) =>
        api.get(`/advisories/${id}`),
    markAsRead: (id) =>
        api.post(`/advisories/${id}/read`),
    getUnreadCount: () =>
        api.get('/advisories/unread/count'),
    // Admin actions
    create: (data) =>
        api.post('/admin/advisories', data),
    update: (id, data) =>
        api.put(`/admin/advisories/${id}`, data),
    delete: (id) =>
        api.delete(`/admin/advisories/${id}`),
};

// Reference Data Services
export const referenceService = {
    getBarangays: () =>
        api.get('/reference/barangays'),
    getAnimalTypes: () =>
        api.get('/reference/animal-types'),
    getAnimalPurposes: () =>
        api.get('/reference/animal-purposes'),
    getDiseases: () =>
        api.get('/reference/diseases'),
    getDiseaseCategories: () =>
        api.get('/reference/disease-categories'),
    getAdvisoryCategories: () =>
        api.get('/reference/advisory-categories'),
    getAdvisorySeverities: () =>
        api.get('/reference/advisory-severities'),
};
