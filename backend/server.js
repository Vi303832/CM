import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, logout } from './controllers/authController.js';
import { createNote, getNotes, updateNote, deleteNote } from './controllers/noteController.js';
import profileRoutes from './routes/profileRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';


import cloudinary from './utils/cloudinary.js';
import upload from './middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();

// Middleware

// In server.js
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

// Profile Routes
app.use('/api/profile', profileRoutes);

// Note Routes
app.get('/api/notes', protect, getNotes);
app.post('/api/notes', protect, createNote);

app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('Dosya alındı:', req.file);

        if (!req.file) {
            console.log('Dosya yüklenmedi');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Cloudinary yükleniyor...');
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log('Cloudinary yükleme başarılı:', result);

        try {
            fs.unlinkSync(req.file.path);
        } catch (e) {
            console.warn("Dosya silinemedi:", e.message);
        }


        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Yükleme hatası:', error);

        // Hata durumunda geçici dosyayı sil
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: 'File upload failed',
            details: error.message
        });
    }
});




{/*AI*/ }
const apiKey = process.env.HUGGING_FACE_API_KEY;

app.post('/api/summarize', express.json(), async (req, res) => {
    try {
        const { text } = req.body;
        console.log("bura")
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            { inputs: text },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const summary = Array.isArray(response.data)
            ? response.data[0]?.summary_text
            : response.data?.summary_text;

        if (!summary) {
            throw new Error('Invalid response from Hugging Face');
        }

        res.json({ summary });

    } catch (error) {
        console.error('Summarization error:', error);

        // Handle Hugging Face specific errors
        if (error.response?.data?.error) {
            return res.status(502).json({
                error: 'Summarization service error',
                details: error.response.data.error
            });
        }

        res.status(500).json({
            error: 'Failed to generate summary',
            details: error.message
        });
    }
});

app.put('/api/notes/:id', protect, updateNote);

app.delete('/api/notes/:id', protect, deleteNote);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 