import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

            // Mock authentication - for testing without backend
            const mockUsers = {
                'farmer@example.com': {
                    id: 1,
                    name: 'John Farmer',
                    email: 'farmer@example.com',
                    role: 'farmer'
                },
                'admin@example.com': {
                    id: 2,
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin'
                }
            };

            // Check mock credentials
            if (!mockUsers[email]) {
                throw new Error('Invalid email or password');
            }

            if (password !== 'password') {
                throw new Error('Invalid email or password');
            }

            const mockUser = mockUsers[email];
            const mockToken = `mock_token_${Date.now()}`;

            setUser(mockUser);
            setToken(mockToken);
            setRole(mockUser.role);

            // Store in localStorage
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('auth_user', JSON.stringify(mockUser));
            localStorage.setItem('auth_role', mockUser.role);

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

            return { success: true, user: mockUser, role: mockUser.role };
        } catch (err) {
            const errorMsg = err.message || 'Login failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const register = async (data) => {
        try {
            setError(null);

            // Mock registration - for testing without backend
            // Create a new farmer user
            const mockUser = {
                id: Math.floor(Math.random() * 10000),
                name: data.name,
                email: data.email,
                role: 'farmer' // New users are always farmers
            };

            const mockToken = `mock_token_${Date.now()}`;

            setUser(mockUser);
            setToken(mockToken);
            setRole('farmer');

            // Store in localStorage
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('auth_user', JSON.stringify(mockUser));
            localStorage.setItem('auth_role', 'farmer');

            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

            return { success: true, user: mockUser, role: 'farmer' };
        } catch (err) {
            const errorMsg = err.message || 'Registration failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_role');
        delete axios.defaults.headers.common['Authorization'];
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
