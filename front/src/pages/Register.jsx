import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/(?=.*[@$!%*?&])/.test(password)) {
            return 'Password must contain at least one special character (@$!%*?&)';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Validate password as user types
        if (name === 'password') {
            setPasswordError(validatePassword(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final password validation before submission
        const passwordValidationError = validatePassword(formData.password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            toast.error(passwordValidationError, {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            toast.success("Successfully registered!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const renderPasswordStrength = () => {
        if (!formData.password) return null;

        // Calculate password strength
        let strength = 0;
        if (formData.password.length >= 8) strength++;
        if (/(?=.*[a-z])/.test(formData.password)) strength++;
        if (/(?=.*[A-Z])/.test(formData.password)) strength++;
        if (/(?=.*\d)/.test(formData.password)) strength++;
        if (/(?=.*[@$!%*?&])/.test(formData.password)) strength++;

        let strengthClass = '';
        let strengthText = '';

        switch (strength) {
            case 0:
            case 1:
                strengthClass = 'bg-red-500';
                strengthText = 'Very Weak';
                break;
            case 2:
                strengthClass = 'bg-orange-500';
                strengthText = 'Weak';
                break;
            case 3:
                strengthClass = 'bg-yellow-500';
                strengthText = 'Moderate';
                break;
            case 4:
                strengthClass = 'bg-blue-500';
                strengthText = 'Strong';
                break;
            case 5:
                strengthClass = 'bg-green-500';
                strengthText = 'Very Strong';
                break;
            default:
                break;
        }

        return (
            <div className="mt-2">
                <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Password Strength</span>
                    <span className="text-xs font-medium text-gray-700">{strengthText}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${strengthClass}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <ToastContainer />
            <main className="pt-16 h-full flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                minLength={3}
                                maxLength={20}
                            />
                            <p className="text-xs text-gray-500 mt-1">Username must be between 3 and 20 characters</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`shadow appearance-none border ${passwordError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                required
                            />
                            {passwordError && (
                                <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                                <p>Password must:</p>
                                <ul className="list-disc pl-5 mt-1">
                                    <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>Be at least 8 characters long</li>
                                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : ''}>Contain at least one lowercase letter</li>
                                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : ''}>Contain at least one uppercase letter</li>
                                    <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-500' : ''}>Contain at least one number</li>
                                    <li className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-500' : ''}>Contain at least one special character (@$!%*?&)</li>
                                </ul>
                            </div>
                            {renderPasswordStrength()}
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full"
                            >
                                Register
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;