import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStickyNote, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { checkAuth } from '../middleware/authMiddleware';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const x = checkAuth();
        setIsAuthenticated(x);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <FaStickyNote className="text-blue-600 text-2xl" />
                            <span className="text-xl font-bold text-gray-800">Zynote</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/notes" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Notes
                        </Link>
                        {isAuthenticated ? (
                            <Link to="/user" className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-full transition-colors duration-200 ease-in-out">
                                <FaUser className="text-lg" />
                                <span className="text-sm font-medium">Profile</span>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/notes"
                            className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Notes
                        </Link>
                        {isAuthenticated ? (
                            <Link
                                to="/user"
                                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaUser className="text-lg" />
                                <span>Profile</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium mt-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;