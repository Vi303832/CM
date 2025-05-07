// In your server.js file, replace the current upload route with this:

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'zynote_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    },
});

// Setup multer with Cloudinary storage
const cloudUpload = multer({ storage: storage });

// File Upload Route with direct-to-Cloudinary upload
app.post('/api/upload', cloudUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // The file is already uploaded to Cloudinary, just return the URL
        res.json({ url: req.file.path });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'File upload failed',
            details: error.message
        });
    }
});