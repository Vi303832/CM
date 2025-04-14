import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaStickyNote, FaPlus, FaTimes, FaTrash, FaEdit, FaTag, FaSearch, FaSort, FaFilter, FaChevronLeft, FaChevronRight, FaPencilAlt } from 'react-icons/fa';
import { notesAPI } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import { useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [selectedTag, setSelectedTag] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 8;
    const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
    const [drawingData, setDrawingData] = useState('');


    // First, let's add state to track drawing status
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    // Add these functions before the return statement
    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas dimensions with higher resolution for better quality
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = `${canvas.offsetWidth}px`;
        canvas.style.height = `${canvas.offsetHeight}px`;

        const context = canvas.getContext("2d");
        context.scale(2, 2); // Scale for better resolution
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    };

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent.touches ?
            {
                offsetX: nativeEvent.touches[0].clientX - nativeEvent.target.offsetLeft,
                offsetY: nativeEvent.touches[0].clientY - nativeEvent.target.offsetTop
            } :
            nativeEvent;

        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        // Save the canvas data to state when drawing is finished
        const canvas = canvasRef.current;
        setDrawingData(canvas.toDataURL());
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = nativeEvent.touches ?
            {
                offsetX: nativeEvent.touches[0].clientX - nativeEvent.target.offsetLeft,
                offsetY: nativeEvent.touches[0].clientY - nativeEvent.target.offsetTop
            } :
            nativeEvent;

        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        setDrawingData('');
    };

    // Use useEffect to initialize the canvas when modal opens
    useEffect(() => {
        if (isDrawingModalOpen) {
            setTimeout(initializeCanvas, 100); // Small delay to ensure canvas is in the DOM
        }
    }, [isDrawingModalOpen]);

    useEffect(() => {
        if (isDrawingModalOpen && editingNote && editingNote.content && editingNote.content.startsWith('data:image')) {
            setTimeout(() => {
                initializeCanvas();
                loadImageToCanvas(editingNote.content);
            }, 100);
        }
    }, [isDrawingModalOpen, editingNote]);






    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await notesAPI.getNotes();

                const notesData = response && Array.isArray(response) ? response : [];
                setNotes(notesData);

            } catch (err) {
                toast.error('Failed to fetch notes');
                setError('Failed to fetch notes');
                setNotes([]);
            }
        };

        fetchNotes();
    }, [notes]);

    const handleAddTag = () => {
        if (tags.length < 6) {
            setTags([...tags, '']);
        } else {
            toast.warning('Maximum 6 tags allowed');
        }
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

        // Check if it's a drawing note
        if (note.content && note.content.startsWith('data:image')) {
            setDrawingData(note.content);
            // We'll open the drawing modal instead of the regular edit modal
            setIsDrawingModalOpen(true);
        } else {
            setContent(note.content);
            setIsModalOpen(true);
        }

        setTags(note.tags.map(tag => tag.replace('#', '')));
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 50) {
            setTitle(value);
        } else {
            toast.warning('Title cannot exceed 50 characters');
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
                toast.success('Note updated successfully');
            } else {
                // Create new note
                updatedNote = await notesAPI.createNote(noteData);
                setNotes(prevNotes => [...prevNotes, updatedNote]);
                toast.success('Note created successfully');
            }

            // Reset form
            setTitle('');
            setContent('');
            setTags(['']);
            setIsModalOpen(false);
            setEditingNote(null);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save note';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await notesAPI.deleteNote(id);
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
            toast.success('Note deleted successfully');
        } catch (err) {
            toast.error('Failed to delete note');
            setError('Failed to delete note');
        }
    };

    const handleDrawingSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const noteData = {
                title: editingNote ? editingNote.title : 'Drawing Note',
                content: drawingData,
                tags: editingNote ? editingNote.tags : ['#drawing'],
                isDrawing: true
            };

            let updatedNote;
            if (editingNote && editingNote.content.startsWith('data:image')) {
                // Update existing drawing note
                updatedNote = await notesAPI.updateNote(editingNote._id, noteData);
                setNotes(prevNotes => prevNotes.map(note =>
                    note._id === editingNote._id ? updatedNote : note
                ));
                toast.success('Drawing note updated successfully');
            } else {
                // Create new drawing note
                updatedNote = await notesAPI.createNote(noteData);
                setNotes(prevNotes => [...prevNotes, updatedNote]);
                toast.success('Drawing note created successfully');
            }

            // Reset form
            setIsDrawingModalOpen(false);
            setDrawingData('');
            setEditingNote(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save drawing note';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const allTags = [...new Set(notes.flatMap(note => note.tags))];

    const filteredNotes = notes.filter(note => {
        const query = searchQuery.toLowerCase();
        const titleMatch = note.title.toLowerCase().includes(query);
        const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(query));
        const tagFilter = selectedTag === 'all' || note.tags.includes(selectedTag);
        return (titleMatch || tagMatch) && tagFilter;
    });

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
    const loadImageToCanvas = (dataUrl) => {
        if (!canvasRef.current || !contextRef.current) return;

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
            setDrawingData(dataUrl);
        };
        img.src = dataUrl;
    };

    // Pagination logic
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />

            <main className="flex-grow pt-24 p-6">
                {/* Search and Filter Bar */}
                <div className="max-w-4xl mx-auto mb-12 px-4">
                    <div className="flex flex-col gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search notes by title or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <FaSearch className="text-gray-400 text-lg" />
                            </div>
                        </div>

                        {/* Filter and Sort Controls */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer"
                            >
                                <FaFilter className="text-gray-600" />
                                <span className="text-gray-700">Filters</span>
                            </button>

                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer text-gray-700"
                            >
                                <option value="newest" className="text-gray-700">Newest First</option>
                                <option value="oldest" className="text-gray-700">Oldest First</option>
                                <option value="title-asc" className="text-gray-700">Title (A-Z)</option>
                                <option value="title-desc" className="text-gray-700">Title (Z-A)</option>
                            </select>
                        </div>

                        {/* Tag Filters */}
                        {showFilters && (
                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                                <button
                                    onClick={() => setSelectedTag('all')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTag === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                                        }`}
                                >
                                    All
                                </button>
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTag === tag
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

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
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
                            {currentNotes.length === 0 ? (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-gray-600 text-lg">No notes found matching your search.</p>
                                </div>
                            ) : (
                                currentNotes.map((note) => (
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
                                                {note.content && note.content.startsWith('data:image') ? (
                                                    <img
                                                        src={note.content}
                                                        alt="Drawing"
                                                        className="w-full h-32 object-contain"
                                                    />
                                                ) : (
                                                    <p className="text-gray-600 whitespace-pre-wrap line-clamp-6 sm:line-clamp-8 overflow-hidden text-ellipsis">
                                                        {note.content}
                                                    </p>
                                                )}
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
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 gap-2  ">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-full ${currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                                        }`}
                                >
                                    <FaChevronLeft />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`w-8 h-8 rounded-full ${currentPage === number
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-full ${currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                                        }`}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Floating Action Buttons */}
                <div className="fixed bottom-8 right-8 flex flex-col gap-4">
                    <button
                        onClick={() => setIsDrawingModalOpen(true)}
                        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors cursor-pointer"
                        title="Add Drawing Note"
                    >
                        <FaPencilAlt className="text-2xl" />
                    </button>
                    <button
                        onClick={() => {
                            setEditingNote(null);
                            setTitle('');
                            setContent('');
                            setTags(['']);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        title="Add Text Note"
                    >
                        <FaPlus className="text-2xl" />
                    </button>
                </div>

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
                                    {displayNote.content && displayNote.content.startsWith('data:image') ? (
                                        <img
                                            src={displayNote.content}
                                            alt="Drawing"
                                            className="w-full rounded-lg"
                                        />
                                    ) : (
                                        <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                                            {displayNote.content}
                                        </p>
                                    )}
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
                                    {editingNote && editingNote.content && editingNote.content.startsWith('data:image')
                                        ? 'Edit Drawing Note'
                                        : 'Add Drawing Note'}
                                </h3>
                                <button
                                    onClick={() => setIsDrawingModalOpen(false)}
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
                                    {editingNote && editingNote.content && editingNote.content.startsWith('data:image') ? (
                                        <div className="mb-4">
                                            <img
                                                src={editingNote.content}
                                                alt="Drawing"
                                                className="w-full rounded border border-gray-200"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Drawing notes cannot be edited. Please create a new drawing if needed.
                                            </p>
                                        </div>
                                    ) : (
                                        <textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                                            required
                                        />
                                    )}
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-700 text-sm font-bold">
                                            Tags ({tags.length}/6)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            disabled={tags.length >= 6}
                                            className={`text-blue-600 hover:text-blue-800 cursor-pointer ${tags.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
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
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        {editingNote && editingNote.content && editingNote.content.startsWith('data:image')
                                            ? 'Update Drawing'
                                            : 'Save Drawing'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Drawing Modal */}
                {isDrawingModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Add Drawing Note</h3>
                                <button
                                    onClick={() => setIsDrawingModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                            <form onSubmit={handleDrawingSubmit}>
                                <div className="mb-4">
                                    <canvas
                                        ref={canvasRef}
                                        id="drawingCanvas"
                                        className="border-2 border-gray-300 rounded-lg w-full h-[400px]"
                                        onMouseDown={startDrawing}
                                        onMouseUp={finishDrawing}
                                        onMouseMove={draw}
                                        onMouseLeave={finishDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchEnd={finishDrawing}
                                        onTouchMove={draw}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={clearCanvas}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Save Drawing
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