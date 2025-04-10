import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FaStickyNote, FaPlus, FaTimes } from 'react-icons/fa';

const Notes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState(['']);

    const handleAddTag = () => {
        setTags([...tags, '']);
    };

    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({ title, content, tags: tags.filter(tag => tag.trim() !== '') });

        setIsModalOpen(false);
    };

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

            {/* Floating Add Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
                <FaPlus className="text-2xl " />
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Add New Note</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 text-sm font-bold">
                                        Tags
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {tags.map((tag, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={tag}
                                        onChange={(e) => handleTagChange(index, e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                        placeholder={`Tag ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    Save Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes; 