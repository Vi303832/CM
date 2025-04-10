import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const isAuthenticated = checkAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return children;
};