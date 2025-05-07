import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, logout } from './controllers/authController.js';
import { createNote, getNotes, updateNote, deleteNote } from './controllers/noteController.js';
import { getSummaryUsage, decrementSummaryUsage } from './controllers/summaryController.js';
import profileRoutes from './routes/profileRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import multer from 'multer';
import cloudinaryUpload from './middleware/cloudinaryUpload.js';

import fs from 'fs';
import axios from 'axios';

import cloudinary from './utils/cloudinary.js';
import upload from './middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import User from './models/User.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "https://zynote.vercel.app",
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
app.put('/api/notes/:id', protect, updateNote);
app.delete('/api/notes/:id', protect, deleteNote);












app.get('/api/summary/usage', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();

        const nextMonday = getNextMonday();



        // Initialize summaryUsage if it doesn't exist
        if (!user.summaryUsage) {
            user.summaryUsage = {
                count: 5,

                nextReset: nextMonday,

            };
        }

        // Check if reset is needed

        if (now >= nextMonday) {
            user.summaryUsage = {
                count: 5,
                nextReset: nextMonday,
            };
            await user.save();
        }

        res.json({
            remaining: user.summaryUsage.count,
            limit: 5,
            nextReset: nextMonday,
        });

    } catch (error) {
        console.error('Get summary usage error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

app.post('/api/summary', protect, async (req, res) => {
    try {

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // 1. Get user from protection middleware
        const user = req.user;

        console.log(user.summaryUsage)
        // 2. Check and reset usage if needed
        const now = new Date();
        if (!user.summaryUsage || now > new Date(user.summaryUsage.nextReset)) {
            user.summaryUsage = {
                count: 5, // Weekly limit
                nextReset: getNextMonday()
            };
        }

        // 3. Check remaining summaries
        if (user.summaryUsage.count <= 0) {
            return res.status(403).json({
                error: 'Weekly limit reached',
                nextReset: user.summaryUsage.nextReset
            });
        }

        // 4. Call Hugging Face API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            { inputs: text },
            { headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` } }
        );

        const summary = response.data?.summary_text || response.data[0]?.summary_text;
        if (!summary) throw new Error('Invalid response from API');

        // 5. Update usage
        user.summaryUsage.count -= 1;
        await user.save();

        // 6. Send response
        res.json({
            summary,
            remaining: user.summaryUsage.count,
            nextReset: user.summaryUsage.nextReset
        });

    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({ error: 'Failed to generate summary', details: error.message });
    }
});

function getNextMonday() {
    const date = new Date();
    date.setDate(date.getDate() + ((1 + 7 - date.getDay()) % 7));
    date.setHours(0, 0, 0, 0);

    // Extract month and day, pad with leading zeros if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}-${day}`; // Format: "MM-DD"
}

// File Upload Route
app.post('/api/upload', cloudinaryUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // req.file.path contains the Cloudinary URL
        res.json({ url: req.file.path });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'File upload failed',
            details: error.message
        });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));