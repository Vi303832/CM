import React from 'react';
import Navbar from './Navbar';
import { FaStickyNote } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="h-screen flex flex-col ">
            <Navbar />
            <main className="pt-16 h-full  ">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white h-full flex  items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 ">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <FaStickyNote className="text-6xl text-white" />
                            </div>
                            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                                Welcome to Notes
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                Create, organize, and manage your notes easily
                            </p>
                            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
