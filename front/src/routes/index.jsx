import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notes from '../pages/Notes';
import User from '../pages/User';
import { ProtectedRoute } from '../middleware/authMiddleware';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/notes"
                element={
                    <ProtectedRoute>
                        <Notes />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user"
                element={
                    <ProtectedRoute>
                        <User />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes; 