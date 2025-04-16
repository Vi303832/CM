import Note from '../models/Note.js';

import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// Create Note
export const createNote = async (req, res) => {
    try {
        const { title, content, tags, color, imgUrl } = req.body;
        const note = await Note.create({
            title,
            content,
            tags: tags.filter(tag => tag.trim() !== ''),
            user: req.user._id,
            color,
            imgUrl,
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Note
export const updateNote = async (req, res) => {
    try {
        const { title, content, tags, color, imgUrl } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Handle image deletion
        if (note.imgUrl && imgUrl === null) {
            // Extract public_id from the old image URL
            const publicId = note.imgUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Update note fields
        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags ? tags.filter(tag => tag.trim() !== '') : note.tags;
        note.color = color || note.color;
        if (imgUrl !== undefined) {
            note.imgUrl = imgUrl;
        }

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: error.message });
    }
};



// Delete Note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 