import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    login: async (userData) => {
        const response = await api.post('/auth/login', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('token');
        return response.data;
    }
};

// Profile API
export const userAPI = {
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.put('/profile', userData);
        return response.data;
    },
    deleteProfile: async () => {
        const response = await api.delete('/profile');
        return response.data;
    }
};

// Notes API
export const notesAPI = {
    createNote: async (noteData) => {
        const response = await api.post('/notes', noteData);
        return response.data;
    },
    getNotes: async () => {
        const response = await api.get('/notes');
        return response.data;
    },
    updateNote: async (id, noteData) => {
        const response = await api.put(`/notes/${id}`, noteData);
        return response.data;
    },
    deleteNote: async (id) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    },
    summarizeNote: async (text) => {
        try {

            const response = await api.post('/summarize', { text }); // api kullanılmalı
            return response.data.summary;
        } catch (error) {
            console.error('Summarization error:', error);
            throw error;
        }
    },

};
