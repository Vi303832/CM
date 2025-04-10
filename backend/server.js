import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login } from './controllers/authController.js';
import { createNote, getNotes, updateNote, deleteNote } from './controllers/noteController.js';
import profileRoutes from './routes/profileRoutes.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Profile Routes
app.use('/api/profile', profileRoutes);

// Note Routes
app.get('/api/notes', protect, getNotes);
app.post('/api/notes', protect, createNote);
app.put('/api/notes/:id', protect, updateNote);
app.delete('/api/notes/:id', protect, deleteNote);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 