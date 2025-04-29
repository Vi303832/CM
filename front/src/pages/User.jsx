import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaCog, FaLock, FaEnvelope, FaUserEdit, FaCalendarAlt, FaStickyNote, FaAt } from 'react-icons/fa';
import { authAPI, userAPI, notesAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../utils/toast';



const User = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        match: false
    });
    const navigate = useNavigate();





    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userAPI.getProfile();
                setUser(userData)
                setFormData({
                    email: userData.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                const notesData = await notesAPI.getNotes();
                setNotes(notesData);
            } catch (err) {
                setError('Failed to fetch data');
                showToast.error("Failed to load profile data");
            }
        };

        fetchData();
    }, []);

    // Validate password as user types
    useEffect(() => {
        if (formData.newPassword) {
            setPasswordErrors({
                length: formData.newPassword.length < 8,
                match: formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ''
            });
        }
    }, [formData.newPassword, formData.confirmPassword]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            // Password validation
            if (formData.newPassword) {
                if (formData.newPassword.length < 8) {
                    throw new Error('Password must be at least 8 characters');
                }

                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('New passwords do not match');
                }

                if (!formData.currentPassword) {
                    throw new Error('Current password is required to set a new password');
                }
            }

            const updateData = {
                email: formData.email,
                ...(formData.newPassword && {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            };

            const updatedUser = await userAPI.updateProfile(updateData);
            setUser(updatedUser);
            setSuccess('Profile updated successfully');
            showToast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
            setError(errorMessage);
            showToast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            showToast.success("Successfully logged out!");
            localStorage.removeItem('token');


            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (err) {
            setError('Failed to logout');
            showToast.error("Failed to logout");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (

        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <ToastContainer position="top-right" autoClose={3000} />


            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <div className="w-72 bg-white shadow-lg border-r border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full shadow-sm">
                                <FaUser className="text-blue-600 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{user.name || user.username}</h2>
                                <p className="text-sm text-gray-500 truncate max-w-[180px]">@{user.username}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => setActiveSection('profile')}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${activeSection === 'profile'
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <FaUserEdit className="text-lg" />
                            <span className="font-medium">Profile</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('security')}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${activeSection === 'security'
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <FaLock className="text-lg" />
                            <span className="font-medium">Security</span>
                        </button>

                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 bg-gray-50">
                    {activeSection === 'profile' ? (
                        <div className="max-w-4xl mx-auto">
                            {/* Profile Header */}
                            <div className="bg-white rounded-lg shadow p-8 mb-8">
                                <div className="flex items-center space-x-6">
                                    <div className="bg-blue-100 p-4 rounded-full shadow-sm">
                                        <FaUser className="text-blue-600 text-4xl" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">{user.name || user.username}</h1>
                                        <p className="text-gray-500 mt-1">@{user.username}</p>
                                        <div className="flex items-center mt-2 text-gray-500">
                                            <FaCalendarAlt className="mr-2" />
                                            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Total Notes</h3>
                                            <p className="text-3xl font-bold text-blue-600 mt-2">{notes.length}</p>
                                        </div>
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <FaStickyNote className="text-blue-600 text-2xl" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                                            <p className="text-3xl font-bold text-green-600 mt-2">
                                                {notes.length > 0 ? new Date(Math.max(...notes.map(note => new Date(note.updatedAt || note.createdAt)))).toLocaleDateString() : 'None'}
                                            </p>
                                        </div>
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <FaCalendarAlt className="text-green-600 text-2xl" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                                            <p className="text-3xl font-bold text-purple-600 mt-2">Active</p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-full">
                                            <FaUser className="text-purple-600 text-2xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Notes */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notes</h2>
                                {notes.length > 0 ? (
                                    <div className="space-y-4">
                                        {notes.slice(0, 3).map(note => (
                                            <div key={note._id} className="border-b border-gray-200 pb-4 last:border-0">
                                                <h3 className="font-medium text-gray-800">{note.title}</h3>
                                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{note.content}</p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <FaCalendarAlt className="mr-2" />
                                                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {notes.length > 3 && (
                                            <button
                                                onClick={() => navigate('/notes')}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
                                            >
                                                View all notes
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">No notes yet</p>
                                        <button
                                            onClick={() => navigate('/notes/create')}
                                            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md cursor-pointer shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Create your first note
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            {error && (
                                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-sm">
                                    {success}
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Profile Settings
                                    </h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
                                        >
                                            <FaEdit />
                                            <span className="font-medium">Edit Profile</span>
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">


                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="flex items-center">
                                                <FaEnvelope className="text-gray-400 mr-2" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-colors duration-200"
                                                />
                                            </div>
                                        </div>

                                        {/* Username Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Username
                                            </label>
                                            <div className="flex items-center">
                                                <FaAt className="text-gray-400 mr-2" />
                                                <input
                                                    type="text"
                                                    value={user.username}
                                                    disabled
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
                                        </div>

                                        {/* Password Fields */}
                                        {isEditing && (
                                            <>
                                                <div className="pt-4 border-t border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Current Password
                                                        </label>
                                                        <div className="flex items-center">
                                                            <FaLock className="text-gray-400 mr-2" />
                                                            <input
                                                                type="password"
                                                                name="currentPassword"
                                                                value={formData.currentPassword}
                                                                onChange={handleInputChange}
                                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                                            />
                                                        </div>
                                                        {formData.newPassword && !formData.currentPassword && (
                                                            <p className="text-sm text-red-500 mt-1">Required to change password</p>
                                                        )}
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            New Password
                                                        </label>
                                                        <div className="flex items-center">
                                                            <FaLock className="text-gray-400 mr-2" />
                                                            <input
                                                                type="password"
                                                                name="newPassword"
                                                                value={formData.newPassword}
                                                                onChange={handleInputChange}
                                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                                            />
                                                        </div>
                                                        {passwordErrors.length && formData.newPassword && (
                                                            <p className="text-sm text-red-500 mt-1">Password must be at least 8 characters</p>
                                                        )}
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Confirm New Password
                                                        </label>
                                                        <div className="flex items-center">
                                                            <FaLock className="text-gray-400 mr-2" />
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                value={formData.confirmPassword}
                                                                onChange={handleInputChange}
                                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                                            />
                                                        </div>
                                                        {passwordErrors.match && formData.confirmPassword && (
                                                            <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Action Buttons */}
                                        {isEditing && (
                                            <div className="flex justify-end space-x-4 pt-6">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            email: user.email,
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmPassword: ''
                                                        });
                                                        setPasswordErrors({ length: false, match: false });
                                                        setError(null);
                                                    }}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading || (formData.newPassword && (passwordErrors.length || passwordErrors.match))}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                                                >
                                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default User;