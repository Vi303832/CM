import axios from 'axios';

const API_URL = '/api';

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 404) {
            console.error('API endpoint not found:', error.config.url);
        }
        return Promise.reject(error);
    }
);

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
    // Get current summary usage information
    getSummaryUsage: async () => {
        try {
            const response = await api.get('/summary/usage');
            return response.data;
        } catch (error) {
            console.error('Error fetching summary usage:', error);
            throw error;
        }
    },
    // Summarize note and decrement usage in one call
    summarizeNote: async (text) => {
        try {
            const response = await api.post('/summary', { text });
            return {
                summary: response.data.summary,
                remaining: response.data.remaining,
                nextReset: response.data.nextReset
            };
        } catch (error) {
            console.error('Summarization error:', error);
            throw error;
        }
    }
};