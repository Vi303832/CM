import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update name if provided
        if (name) {
            user.name = name;
        }

        // Update password if provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            
            // Set the new password (validation will happen during save)
            user.password = newPassword;
        }

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser);
    } catch (error) {
        // Better error handling for validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user profile
export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};