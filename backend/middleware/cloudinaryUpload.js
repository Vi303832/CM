import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage yapılandırması
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'zynote', // Cloudinary'de dosyaların kaydedileceği klasör
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // İzin verilen dosya formatları
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Maksimum boyut sınırlaması
    }
});

// Multer yapılandırması
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB dosya boyutu sınırı
    }
});

export default upload; 