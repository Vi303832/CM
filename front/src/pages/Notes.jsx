import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaStickyNote, FaPlus, FaTimes, FaTrash, FaEdit, FaTag } from 'react-icons/fa';
import { notesAPI } from '../api';

const Notes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState(['']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [displayNote, setDisplayNote] = useState(null);

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
    }, [notes]);

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

    const handleCardClick = (note) => {
        setDisplayNote(note);
        setIsDisplayModalOpen(true);
    };

    const handleEditClick = (note, e) => {
        e.stopPropagation();
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags.map(tag => tag.replace('#', '')));
        setIsModalOpen(true);
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 50) {
            setTitle(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const noteData = {
                title,
                content,
                tags: tags
                    .filter(tag => tag.trim() !== '')
                    .map(tag => `#${tag.trim()}`)
            };

            let updatedNote;
            if (editingNote) {
                // Update existing note
                updatedNote = await notesAPI.updateNote(editingNote._id, noteData);
                setNotes(prevNotes => prevNotes.map(note =>
                    note._id === editingNote._id ? updatedNote : note
                ));
            } else {
                // Create new note
                updatedNote = await notesAPI.createNote(noteData);
                setNotes(prevNotes => [...prevNotes, updatedNote]);
            }

            // Reset form
            setTitle('');
            setContent('');
            setTags(['']);
            setIsModalOpen(false);
            setEditingNote(null);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save note');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await notesAPI.deleteNote(id);
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
        } catch (err) {
            setError('Failed to delete note');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow pt-16 p-6">
                {!notes || notes.length === 0 ? (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
                        {notes.map((note) => (
                            <div
                                key={note._id}
                                onClick={() => handleCardClick(note)}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-[300px] flex flex-col cursor-pointer"
                            >
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 truncate max-w-[250px] sm:max-w-[200px]">{note.title}</h3>
                                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleDeleteNote(note._id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button
                                                onClick={(e) => handleEditClick(note, e)}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <FaEdit />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="text-gray-600 whitespace-pre-wrap line-clamp-6 sm:line-clamp-8 overflow-hidden text-ellipsis">{note.content}</p>
                                    </div>
                                    {note.tags && Array.isArray(note.tags) && note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4 overflow-hidden">
                                            {note.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-[100px] sm:max-w-[120px]"
                                                >
                                                    <FaTag className="mr-1 flex-shrink-0" />
                                                    <span className="truncate">{tag}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Add Button */}
                <button
                    onClick={() => {
                        setEditingNote(null);
                        setTitle('');
                        setContent('');
                        setTags(['']);
                        setIsModalOpen(true);
                    }}
                    className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <FaPlus className="text-2xl" />
                </button>

                {/* Display Modal */}
                {isDisplayModalOpen && displayNote && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-800 break-words">{displayNote.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(displayNote.createdAt).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsDisplayModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer ml-4"
                                >
                                    <FaTimes className="text-2xl" />
                                </button>
                            </div>
                            <div className="mb-8">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">{displayNote.content}</p>
                                </div>
                            </div>
                            {displayNote.tags && Array.isArray(displayNote.tags) && displayNote.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {displayNote.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                        >
                                            <FaTag className="mr-2" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {editingNote ? 'Edit Note' : 'Add New Note'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingNote(null);
                                    }}
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
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="title">
                                            Title
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {title.length}/50
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={handleTitleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                        maxLength={50}
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
                                        {isLoading ? 'Saving...' : (editingNote ? 'Update Note' : 'Save Note')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Notes;