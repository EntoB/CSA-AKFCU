import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 10); // 1 second sleep
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // Not logged in
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not allowed
        console.log(`User role ${user.role} not allowed`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;