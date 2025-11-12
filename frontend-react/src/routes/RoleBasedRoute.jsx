import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-secondary-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default RoleBasedRoute;
