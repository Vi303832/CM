import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.delete('/', protect, deleteProfile);

export default router; 