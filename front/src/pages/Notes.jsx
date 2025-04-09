import React from 'react';
import Navbar from '../components/Navbar';
import { FaStickyNote } from 'react-icons/fa';

const Notes = () => {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <main className="pt-16 h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <FaStickyNote className="text-6xl text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        No Notes Yet
                    </h2>
                    <p className="text-gray-600">
                        You haven't created any notes yet. Start by clicking the "New Note" button.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Notes; 