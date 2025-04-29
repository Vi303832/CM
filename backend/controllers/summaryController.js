import User from '../models/User.js';
import axios from 'axios';

// Helper function to check if it's a Monday
const isMonday = (date) => {
    return date.getDay() === 1; // 0 is Sunday, 1 is Monday
};

// Helper function to check if the reset is needed
const checkAndResetUsage = async (user) => {
    const today = new Date();
    const lastReset = new Date(user.summaryUsage.lastReset);

    // Reset if it's Monday and the last reset was before today
    if (isMonday(today) &&
        (lastReset.getDate() !== today.getDate() ||
            lastReset.getMonth() !== today.getMonth() ||
            lastReset.getFullYear() !== today.getFullYear())) {

        user.summaryUsage.count = 5;
        user.summaryUsage.lastReset = today;
        await user.save();
    }

    return user;
};

export const getSummaryUsage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if we need to reset usage on Monday
        const updatedUser = await checkAndResetUsage(user);

        res.json({
            count: updatedUser.summaryUsage.count,
            nextReset: getNextMonday()
        });
    } catch (error) {
        console.error('Get summary usage error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const decrementSummaryUsage = async (req, res) => {
    console.log("111")
    try {
        console.log("1")
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if we need to reset usage on Monday
        const updatedUser = await checkAndResetUsage(user);

        // Check if user has any usage left
        if (updatedUser.summaryUsage.count <= 0) {
            return res.status(403).json({
                message: 'You have reached your weekly summary limit',
                nextReset: getNextMonday()
            });
        }


        // Decrement usage
        updatedUser.summaryUsage.count -= 1;
        await updatedUser.save();

        // Call Hugging Face API for summarization
        const { text } = req.body;

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
};

// Helper function to get next Monday date (for display purposes)
function getNextMonday() {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

    // If today is Monday, return next Monday (7 days from now)
    if (day === 1) {
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + 7);
        return nextMonday.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Otherwise, calculate days until next Monday
    const daysUntilNextMonday = day === 0 ? 1 : 8 - day;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday.toISOString().split('T')[0]; // YYYY-MM-DD format
}