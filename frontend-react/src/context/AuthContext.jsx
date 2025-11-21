import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        const storedRole = localStorage.getItem('auth_role');

        if (storedToken && storedUser && storedRole) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setRole(storedRole);

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);

            console.log('🔐 Logging in:', email);
            const response = await api.post('/login', { email, password });

            const { user, role, token } = response.data;
            console.log('✅ Login successful! User data:', user);
            console.log('   Name:', user.full_name || user.name);
            console.log('   Role:', role);

            setUser(user);
            setToken(token);
            setRole(role);

            // Store in localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('auth_role', role);

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { success: true, user, role };
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const register = async (data) => {
        try {
            setError(null);

            console.log('📝 Registering user:', data.name);
            const response = await api.post('/register', {
                full_name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password,
                phone_number: data.phone
            });

            const { user, role, token } = response.data;
            console.log('✅ Registration successful! User data:', user);
            console.log('   Name:', user.full_name);
            console.log('   Email:', user.email);
            console.log('   Role:', role);

            setUser(user);
            setToken(token);
            setRole(role);

            // Store in localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('auth_role', role);

            console.log('💾 User data saved to localStorage');

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { success: true, user, role };
        } catch (err) {
            const errorMsg = err.message || 'Registration failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const logout = async () => {
        try {
            // Call backend logout endpoint with configured api instance (includes Bearer token)
            await api.post('/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Always clear local state regardless of API call success
            setUser(null);
            setToken(null);
            setRole(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_role');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                loading,
                error,
                isAuthenticated,
                login,
                register,
                logout,
                setError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
