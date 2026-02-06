// RequireAuth - Route protection component
// Checks loading + user state to protect routes
// Does NOT block entire app

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Loader from '../components/Loader';

const RequireAuth = ({ children, adminOnly = false }) => {
    const { currentUser, loading, isAdmin } = useAuth();
    const location = useLocation();

    // Still resolving auth state - show minimal loader
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Loader size="large" />
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin check for admin-only routes
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Authorized - render children
    return children;
};

export default RequireAuth;
