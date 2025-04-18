import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import {
    FaStickyNote,
    FaArrowRight,
    FaEdit,
    FaSearch,
    FaTag,
    FaPenNib,
    FaClock,
    FaFolderOpen,
    FaGithub,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className=" bg-gradient-to-r from-blue-600 to-blue-800">
                <section className="flex items-center py-16 max-lg:py-24 min-h-screen relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className=" flex max-lg:flex-col gap-8 items-center">
                            {/* Left Column - Text Content */}
                            <div className="text-white">
                                <div className="flex items-center mb-4">
                                    <div className="mr-2 rounded-full p-1 bg-white text-blue-600">
                                        <FaStickyNote className="text-lg" />
                                    </div>
                                    <span>Organize your thoughts</span>
                                </div>
                                <h1 className="text-5xl font-bold mb-4">Welcome to Notes</h1>
                                <p className="text-lg mb-6">
                                    Create, organize, and manage your notes easily. The perfect
                                    place to store your thoughts, ideas, and important
                                    information.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => navigate('/notes')}
                                        className="px-6 py-2 bg-white text-blue-600 rounded-md font-medium flex items-center 
    relative transition-all duration-300 
    border-2 border-transparent
    hover:scale-105 hover:border-white hover:bg-blue-600 hover:text-white cursor-pointer"
                                    >
                                        Get Started
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* App Preview - Modified to match the image */}
                            <div className="lg:col-span-7   relative">
                                <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white backdrop-blur-sm">
                                    <div className="bg-gradient-to-r from-blue-600/80 to-blue-800/80 p-1">
                                        <div className="bg-white rounded-t-lg p-2 flex items-center gap-1">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                            <div className="ml-2 text-xs text-gray-500">Notes App</div>
                                        </div>
                                        <div className="bg-white p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-lg font-semibold text-gray-800">My Notes</div>
                                                <div className="flex gap-2">
                                                    <div className="p-1.5 bg-gray-100 rounded-full">
                                                        <FaSearch className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                    <div className="p-1.5 bg-gray-100 rounded-full">
                                                        <FaFolderOpen className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-yellow-400 rounded-lg p-4 shadow-md">
                                                    <h3 className="font-medium mb-2 text-gray-800">Project Ideas</h3>
                                                    <p className="text-sm text-gray-700 line-clamp-3">
                                                        1. Mobile app for tracking habits 2. Website redesign 3. AI-powered note assistant
                                                    </p>
                                                    <div className="flex gap-1 mt-2">
                                                        <span className="text-xs px-2 py-0.5 bg-yellow-300/50 rounded-full text-yellow-800">
                                                            #ideas
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-500 rounded-lg p-4 shadow-md">
                                                    <h3 className="font-medium mb-2 text-white">Meeting Notes</h3>
                                                    <p className="text-sm text-blue-50 line-clamp-3">
                                                        Discussed project timeline and deliverables. Next steps: finalize design by Friday.
                                                    </p>
                                                    <div className="flex gap-1 mt-2">
                                                        <span className="text-xs px-2 py-0.5 bg-blue-400/50 rounded-full text-white">#work</span>
                                                    </div>
                                                </div>
                                                <div className="bg-green-500 rounded-lg p-4 shadow-md">
                                                    <h3 className="font-medium mb-2 text-white">Shopping List</h3>
                                                    <p className="text-sm text-green-50 line-clamp-3">- Milk - Eggs - Bread - Apples</p>
                                                    <div className="flex gap-1 mt-2">
                                                        <span className="text-xs px-2 py-0.5 bg-green-400/50 rounded-full text-white">
                                                            #shopping
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-purple-500 rounded-lg p-4 shadow-md">
                                                    <h3 className="font-medium mb-2 text-white">Book Recommendations</h3>
                                                    <p className="text-sm text-purple-50 line-clamp-3">
                                                        1. Atomic Habits 2. Deep Work 3. The Psychology of Money
                                                    </p>
                                                    <div className="flex gap-1 mt-2">
                                                        <span className="text-xs px-2 py-0.5 bg-purple-400/50 rounded-full text-white">#books</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                                    <FaEdit className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
                            <path
                                fill="#ffffff"
                                fillOpacity="1"
                                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                            ></path>
                        </svg>
                    </div>
                </section>
            </main>

            {/* Features Section - Updated to match the image */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">All-in-One Solution</span>
                        <h2 className="text-3xl font-bold mt-4 mb-2">Powerful features for all your needs</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our notes app combines simplicity with powerful features to help you capture,
                            organize, and retrieve information effortlessly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-lg">
                            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <FaEdit className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Easy Note Creation</h3>
                            <p className="text-gray-600">
                                Create notes quickly with our intuitive editor. Add text, lists, images, and more to capture your thoughts exactly as you want.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-lg">
                            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <FaTag className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Organize with Tags</h3>
                            <p className="text-gray-600">
                                Keep your notes organized with custom tags and categories. Create your own tagging system for easy retrieval and organization.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-lg">
                            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <FaSearch className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Powerful Search</h3>
                            <p className="text-gray-600">
                                Find any note instantly with our powerful search functionality. Search across all your content, text, and titles.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 rounded-lg">
                            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Drawing Notes</h3>
                            <p className="text-gray-600">
                                Express yourself with drawing notes. Sketch ideas, create diagrams, or just doodle to visualize your thoughts.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="p-6 rounded-lg">
                            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Custom Colors</h3>
                            <p className="text-gray-600">
                                Personalize your notes with custom background colors to visually organize your information and make important notes stand out.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="p-6 rounded-lg">
                            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                                <FaClock className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">AI Summaries</h3>
                            <p className="text-gray-600">
                                Let AI help you summarize long notes to quickly extract the most important information when you need it most.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to organize your thoughts?</h2>
                    <p className="mb-8">Start using Notes today and experience the difference. It's completely free!</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate('/notes')}
                            className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium flex items-center 
    relative transition-all duration-300 
    border-2 border-transparent
    hover:scale-105 hover:border-white hover:bg-blue-600 hover:text-white cursor-pointer"
                        >
                            Get Started Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer - Updated to match the image */}
            <footer className="bg-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="mr-2 bg-blue-600 rounded-md p-1">
                                    <FaStickyNote className="text-white text-xl" />
                                </div>
                                <span className="font-semibold text-xl">Notes</span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                A simple and powerful note-taking app to help you organize your thoughts, ideas, and important information.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-gray-600">
                                    <FaTwitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-600">
                                    <FaGithub className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-600">
                                    <FaInstagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-gray-600">
                                    <FaLinkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Home</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Notes</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Profile</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Help & Support</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
                            <p className="text-gray-600 mb-4">Subscribe to our newsletter to get updates on new features and improvements.</p>
                            <div className="flex">
                                <input type="email" placeholder="Your email" className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">© 2025 Notes App. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-500 text-sm hover:text-gray-700">Terms of Service</a>
                            <a href="#" className="text-gray-500 text-sm hover:text-gray-700">Privacy Policy</a>
                            <a href="#" className="text-gray-500 text-sm hover:text-gray-700">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;