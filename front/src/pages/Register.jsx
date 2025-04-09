import React from 'react';
import Navbar from '../components/Navbar';

const Register = () => {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <main className="pt-16 h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Register Page
                    </h2>
                </div>
            </main>
        </div>
    );
};

export default Register; 