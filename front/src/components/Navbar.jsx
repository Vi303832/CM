import React from 'react';
import { Link } from 'react-router-dom';
import { FaStickyNote } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-lg fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <FaStickyNote className="text-blue-600 text-2xl" />
                            <span className="text-xl font-bold text-gray-800">Notes</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/notes" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Notes
                        </Link>
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Login
                        </Link>
                        <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 