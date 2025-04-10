import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaStickyNote, FaPlus, FaTimes, FaTrash, FaEdit, FaTag } from 'react-icons/fa';
import { notesAPI } from '../api';

const Notes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState(['']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await notesAPI.getNotes();
                console.log('API Response:', response);
                const notesData = response && Array.isArray(response) ? response : [];
                setNotes(notesData);
                console.log('Notes length after setting:', notesData.length);
            } catch (err) {
                console.error('Fetch notes error:', err);
                setError('Failed to fetch notes');
                setNotes([]);
            }
        };

        fetchNotes();
    }, []);

    const handleAddTag = () => {
        setTags([...tags, '']);
    };

    const handleTagChange = (index, value) => {
        const newTags = [...tags];
        const cleanValue = value.startsWith('#') ? value.slice(1) : value;
        newTags[index] = cleanValue;
        setTags(newTags);
    };

    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags.length ? newTags : ['']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await notesAPI.createNote({
                title,
                content,
                tags: tags
                    .filter(tag => tag.trim() !== '')
                    .map(tag => `#${tag.trim()}`)
            });

            // Reset form and fetch updated notes
            setTitle('');
            setContent('');
            setTags(['']);
            setIsModalOpen(false);
            const response = await notesAPI.getNotes();
            if (response && response.data) {
                setNotes(Array.isArray(response.data) ? response.data : []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create note');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await notesAPI.deleteNote(id);
            const response = await notesAPI.getNotes();
            if (response && response.data) {
                setNotes(Array.isArray(response.data) ? response.data : []);
            }
        } catch (err) {
            setError('Failed to delete note');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="pt-16 flex-1 p-6">
                {notes.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
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
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note._id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteNote(note._id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                                <FaEdit />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
                                    {note.tags && Array.isArray(note.tags) && note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {note.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    <FaTag className="mr-1" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Floating Add Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
                <FaPlus className="text-2xl" />
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
                        {error && (
                            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}
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
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
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
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {tags.map((tag, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <span className="text-gray-500 mr-2">#</span>
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => handleTagChange(index, e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder={`Tag ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(index)}
                                            className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Saving...' : 'Save Note'}
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