// 1. Gerekli paketleri yükleyin
// npm install multer-storage-cloudinary

// 2. middleware/cloudinaryUpload.js oluşturun
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary yapılandırması
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'zynote', // Cloudinary'deki klasör adı
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // İzin verilen formatlar
        transformation: [{ width: 1200, crop: 'limit' }] // İsteğe bağlı görüntü optimizasyonu
    }
});

const cloudinaryUpload = multer({ storage: storage });

export default cloudinaryUpload;