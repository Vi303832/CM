import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaCalendar, FaStickyNote, FaPlus, FaTimes, FaTrash, FaEdit, FaTag, FaSearch, FaSort, FaFilter, FaChevronLeft, FaChevronRight, FaPencilAlt, FaImage, FaThumbtack, FaMagic } from 'react-icons/fa';
import { notesAPI } from '../api';
import { useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { showToast } from '../utils/toast';

const Notes = () => {


    {/*Ai (DANGEROUS, TOXİC, MALİCİOUS)*/ }




    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const [summaryUsage, setSummaryUsage] = useState({
        count: 0,
        nextReset: ''
    });

    {/*Ai (DANGEROUS, TOXİC, MALİCİOUS)*/ }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState(['']);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredNoteId, setHoveredNoteId] = useState(null);
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
    const [selectedColor, setSelectedColor] = useState('black');
    const [selectedBoxColor, setSelectedBoxColor] = useState('white');
    const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
    const [drawingData, setDrawingData] = useState('');

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');


    const [imageUrl, setImageUrl] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [showSummaryInfo, setShowSummaryInfo] = useState(false);


    // First, let's add state to track drawing status
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const colors = [
        { name: 'Black', value: 'black' },
        { name: 'Blue', value: '#2563eb' },
        { name: 'Red', value: '#dc2626' },
        { name: 'Green', value: '#16a34a' },
        { name: 'Yellow', value: '#eab308' },

    ];

    const boxcolors = [
        { name: 'White', value: 'white' },
        { name: 'Blue', value: '#2563EB' },
        { name: 'Red', value: '#DC2626' },
        { name: 'Green', value: '#059669' },
        { name: 'Yellow', value: '#F59E0B' },
        { name: 'Black', value: 'black' },
    ];



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
        context.strokeStyle = selectedColor;
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
        if (!canvas) return; // canvas yoksa işlem yapma

        const context = canvas.getContext("2d");
        if (!context) return; // context yoksa işlem yapma

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
        if (!isDrawingModalOpen) {
            setEditingNote(null);
            setTitle('');
            setTags(['']);
            setDrawingData('');
            setSelectedColor('black'); // Varsayılan renge dön
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
        if (contextRef.current) {
            contextRef.current.strokeStyle = selectedColor;
        }
    }, [selectedColor]);




    const getNoteColorClass = (color) => {
        switch (color) {
            case 'white': return 'bg-white';
            case '#2563EB': return 'bg-[#2563EB]';
            case '#DC2626': return 'bg-[#DC2626]';
            case '#059669': return 'bg-[#059669]';
            case '#F59E0B': return 'bg-[#F59E0B]';
            case 'black': return 'bg-black/90';
            default: return 'bg-white';
        }
    };



    useEffect(() => {
        const fetchNotes = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await notesAPI.getNotes();

                if (response && Array.isArray(response)) {
                    setNotes(response);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                let errorMessage = 'Failed to fetch notes';

                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            errorMessage = 'Please log in to view your notes';
                            break;
                        case 403:
                            errorMessage = 'Your session has expired. Please log in again';
                            break;
                        case 404:
                            errorMessage = 'No notes found';
                            break;
                        default:
                            errorMessage = 'Unable to load notes. Please try again later';
                    }
                } else if (err.request) {
                    errorMessage = 'Network error. Please check your connection';
                }

                setError(errorMessage);
                showToast.error(errorMessage);
                setNotes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, []); // Removed 'notes' from dependencies to prevent infinite loop

    const handleAddTag = () => {
        if (tags.length < 6) {
            setTags([...tags, '']);
        } else {
            showToast.warning('Maximum 6 tags allowed');
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
        setShowSummaryInfo(true);
    };

    const handleEditClick = (note, e) => {
        e.stopPropagation();
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags.map(tag => tag.replace('#', '')));
        setSelectedBoxColor(note.color || 'white');

        // Add image handling
        if (note.imgUrl) {
            setPreviewUrl(note.imgUrl);
        } else {
            setPreviewUrl('');
            setFile(null);
        }

        if (note.content && note.content.startsWith('data:image')) {
            setDrawingData(note.content);
            setIsDrawingModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 50) {
            setTitle(value);
        } else {
            showToast.warning('Title cannot exceed 50 characters');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        setTitle('');
        setContent('');
        setTags(['']);
        setPreviewUrl('');
        setFile(null);
        setSelectedBoxColor('white');
    };


    const resetNoteForm = () => {
        setEditingNote(null);
        setTitle('');
        setContent('');
        setTags(['']);
        setPreviewUrl('');
        setFile(null);
        setSelectedBoxColor('white');
        setDrawingData('');
        setSelectedColor('black');
        clearCanvas();
    };


    const handleOpenTextNoteModal = () => {

        setIsModalOpen(true);
        resetNoteForm()
    };

    const handleOpenDrawingModal = () => {

        setIsDrawingModalOpen(true);
        resetNoteForm()
    };






    {/*Aİ Aİ Aİ Aİ */ }

    const summaryRef = useRef(null);

    useEffect(() => {
        if (showSummary && summaryRef.current) {
            summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [showSummary]);

    useEffect(() => {
        const fetchSummaryUsage = async () => {
            try {
                const usage = await notesAPI.getSummaryUsage();
                setSummaryUsage({
                    count: usage.remaining,
                    nextReset: usage.nextReset
                });
            } catch (error) {
                if (isDisplayModalOpen) {
                    showToast.error('Failed to fetch summary usage');
                }
            }
        };

        if (isDisplayModalOpen) {
            fetchSummaryUsage();
        }
    }, [isDisplayModalOpen]);

    const handleSummarize = async () => {
        try {
            if (!displayNote.content) {
                showToast.error('No content to summarize');
                return;
            }

            if (summaryUsage.count <= 0) {
                showToast.error(`You've reached your weekly summary limit. Limit resets on ${summaryUsage.nextReset}`);
                return;
            }

            setIsSummarizing(true);
            setShowSummary(false);

            const result = await notesAPI.summarizeNote(displayNote.content);

            setSummary(result.summary);
            setSummaryUsage({
                count: result.remaining,
                nextReset: result.nextReset
            });

            setShowSummary(true);
            showToast.success(`Summary generated! You have ${result.remaining} summaries left this week.`);
        } catch (error) {
            if (error.response?.status === 403) {
                showToast.error(`${error.response.data.message}. Limit resets on ${error.response.data.nextReset}`);
                return;
            }

            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Failed to generate summary';

            showToast.error(`Summarization error: ${errorMessage}`);
        } finally {
            setIsSummarizing(false);
        }
    };






    {/*Aİ Aİ Aİ Aİ */ }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let imgUrl = editingNote?.imgUrl; // Keep existing image URL by default

            // Handle image changes
            if (file) {
                // Upload new image
                imgUrl = await uploadImage();
            } else if (previewUrl === '') {
                // If preview is empty but there was an image before, remove it
                imgUrl = null;
            }

            const noteData = {
                title,
                content,
                tags: tags.filter(tag => tag.trim() !== '').map(tag => `#${tag.trim()}`),
                color: selectedBoxColor,
                imgUrl: imgUrl,
            };

            let updatedNote;
            if (editingNote) {
                updatedNote = await notesAPI.updateNote(editingNote._id, noteData);
                setNotes(prevNotes => prevNotes.map(note =>
                    note._id === editingNote._id ? updatedNote : note
                ));
                showToast.success('Note updated successfully');
            } else {
                updatedNote = await notesAPI.createNote(noteData);
                setNotes(prevNotes => [...prevNotes, updatedNote]);
                showToast.success('Note created successfully');
            }

            // Reset form
            setTitle('');
            setContent('');
            setTags(['']);
            setFile(null);
            setPreviewUrl('');
            setIsModalOpen(false);
            setEditingNote(null);
            setSelectedBoxColor("white");

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save note';
            showToast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    const handleDeleteNote = async (id) => {
        try {
            await notesAPI.deleteNote(id);
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
            showToast.success('Note deleted successfully');
        } catch (err) {
            showToast.error('Failed to delete note');
            setError('Failed to delete note');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreviewUrl('');
        if (editingNote?.imgUrl) {
            // If removing an existing image
            showToast.info('Image will be removed when you save the note');
        }
    };

    const uploadImage = async () => {
        if (!file) return null;

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('image', file); // Changed back to 'image' to match backend expectation

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload Progress:', percentCompleted);
                }
            });

            if (response.data && response.data.url) {
                return response.data.url;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            const errorMessage = error.response?.data?.message || 'Image upload failed';
            showToast.error(errorMessage);
            return null;
        } finally {
            setUploadLoading(false);
        }
    };


    const handleTogglePin = async (id, pinnedStatus) => {
        try {
            const updatedNote = await notesAPI.updateNote(id, { pinned: pinnedStatus });
            setNotes(prevNotes => prevNotes.map(note =>
                note._id === id ? updatedNote : note
            ));
            showToast.success(`Note ${pinnedStatus ? 'pinned' : 'unpinned'}`);
        } catch (err) {
            showToast.error('Failed to update pin status');
        }
    };

    const handleDrawingSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const noteData = {
                title: title || 'Untitled Drawing', // Başlık eklendi
                content: drawingData,
                tags: tags
                    .filter(tag => tag.trim() !== '')
                    .map(tag => `#${tag.trim()}`),
                isDrawing: true,
                color: "white",
            };

            if (editingNote) {
                const updatedNote = await notesAPI.updateNote(editingNote._id, noteData);
                setNotes(prevNotes => prevNotes.map(note =>
                    note._id === editingNote._id ? updatedNote : note
                ));
                showToast.success('Drawing note updated successfully');
            } else {
                const newNote = await notesAPI.createNote(noteData);
                setNotes(prevNotes => [...prevNotes, newNote]);
                showToast.success('Drawing note created successfully');
            }

            // Reset form
            setIsDrawingModalOpen(false);
            setDrawingData('');
            setTitle('');
            setTags(['']);
            setEditingNote(null);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save drawing note';
            showToast.error(errorMessage);
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
        // Pinned notes always come first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        // Then apply the selected sorting
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

                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Loading Notes...
                            </h2>
                        </div>
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <FaStickyNote className="text-6xl text-red-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Failed to Load Notes
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : !notes || notes.length === 0 ? (
                    <div className="h-72 flex items-center  justify-center">
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
                        {/*NotesPreviewCards*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
                            {currentNotes.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <FaSearch className="text-4xl text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        No Notes Found
                                    </h3>
                                    <p className="text-gray-600 text-center max-w-md">
                                        No notes match your search criteria. Try different filters or search terms.
                                    </p>
                                </div>
                            ) : (
                                currentNotes.map((note) => (
                                    <div
                                        key={note._id}
                                        onMouseEnter={() => setHoveredNoteId(note._id)}
                                        onMouseLeave={() => setHoveredNoteId(null)}
                                        onClick={() => handleCardClick(note)}
                                        className={`${getNoteColorClass(note.color)} group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer h-[340px] ${note.pinned ? 'ring-2 ring-yellow-400' : ''}`}
                                    >
                                        {/* Absolute positioned action buttons - visible on hover */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTogglePin(note._id, !note.pinned);
                                                }}
                                                className={`${note.pinned ? 'text-yellow-600 bg-yellow-100' : 'text-gray-600 bg-white/90'} hover:text-yellow-700 p-1.5 rounded-full cursor-pointer shadow-sm`}
                                                title={note.pinned ? "Unpin note" : "Pin note"}
                                            >
                                                <FaThumbtack className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(note, e);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 bg-white/90 p-1.5 rounded-full cursor-pointer shadow-sm"
                                                title="Edit note"
                                            >
                                                <FaEdit className="w-3.5 h-3.5" />
                                            </button>          <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteNote(note._id);
                                                }}
                                                className="text-red-600 hover:text-red-800 bg-white/90 p-1.5 rounded-full cursor-pointer shadow-sm"
                                                title="Delete note"
                                            >
                                                <FaTrash className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Image header if exists - doubled in size */}
                                        {note.imgUrl && (
                                            <div className="h-64 overflow-hidden">
                                                <img
                                                    src={note.imgUrl}
                                                    alt="Note"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Card content - main area with padding for footer */}
                                        <div className={`flex flex-col h-full ${note.imgUrl ? 'p-4 pb-14' : 'p-5 pb-14'} ${note.color === "white" ? "text-gray-800" : note.color === "black" ? "text-white" : "text-gray-900"}`}>
                                            {/* Title and pin indicator */}
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold truncate max-w-[180px] group-hover:max-w-full transition-all duration-300">
                                                    {note.title}
                                                </h3>
                                                {note.pinned && (
                                                    <div className="bg-yellow-300 rounded-full p-1 ml-2">
                                                        <FaThumbtack className="w-3 h-3 text-yellow-700" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content area */}
                                            <div className="flex-grow overflow-hidden mb-3">
                                                {/* Drawing content */}
                                                {note.content && note.content.startsWith('data:image') ? (
                                                    <div className={`${note.color === "white" ? "bg-gray-50" : "bg-white/10"} rounded-md overflow-hidden`}>
                                                        <img
                                                            src={note.content}
                                                            alt="Drawing"
                                                            className="w-full h-28 object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className={`whitespace-pre-wrap ${note.imgUrl ? "line-clamp-4" : "line-clamp-[9]"} text-sm ${note.color === "white" ? "text-gray-600" : note.color === "#eab308" ? "text-gray-800" : ""}`}>
                                                        {note.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer with date and tags - absolute positioning for hover effect */}
                                        <div className={`px-4 py-3 rounded-b-lg absolute bottom-0 left-0 right-0 z-20 transform ${hoveredNoteId === note._id ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out  ${note.color === "white" ? "bg-gray-200 border-t border-gray-300" :
                                            note.color === "#F59E0B" ? "bg-[#D97706]  border-t border-[#FBBF24]" :
                                                note.color === "#2563EB" ? "bg-[#1D4ED8]  border-t border-[#3B82F6]" :
                                                    note.color === "#DC2626" ? "bg-[#B91C1C] border-t border-[#EF4444]" :
                                                        note.color === "#059669" ? "bg-[#047857] border-t border-[#10B981]" :
                                                            note.color === "black" ? "bg-black border-t border-white/10" : "bg-gray-100"}`}>
                                            {/* Created date */}
                                            <div className={`text-xs mb-2 flex items-center ${note.color === "white" ? "text-gray-500" :
                                                note.color === "#eab308" ? "text-gray-800" : "text-white/80"}`}>
                                                <FaCalendar className="mr-1 flex-shrink-0 w-3 h-3" />
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </div>

                                            {/* Tags */}
                                            {note.tags && Array.isArray(note.tags) && note.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 overflow-hidden">
                                                    {note.tags.slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                    ${note.color === "white" ? "bg-blue-100 text-blue-800" :
                                                                    note.color === "#eab308" ? "bg-yellow-200 text-yellow-900" : "bg-white/20 text-white"} 
                    truncate max-w-[90px]`}
                                                        >
                                                            <FaTag className="mr-1 flex-shrink-0 w-2.5 h-2.5" />
                                                            <span className="truncate">{tag}</span>
                                                        </span>
                                                    ))}
                                                    {note.tags.length > 3 && (
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${note.color === "white" || note.color === "#eab308" ? "bg-gray-200 text-gray-700" : "bg-white/20 text-white"}`}>
                                                            +{note.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 gap-2">
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
                <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-20">
                    <button
                        onClick={handleOpenDrawingModal}
                        className="bg-neutral-800 text-white p-4 rounded-full shadow-lg hover:bg-neutral-950 transition-colors cursor-pointer"
                        title="Add Drawing Note"
                    >
                        <FaPencilAlt className="text-2xl" />
                    </button>
                    <button
                        onClick={handleOpenTextNoteModal}
                        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        title="Add Text Note"
                    >
                        <FaPlus className="text-2xl" />
                    </button>
                </div>

                {/* Display Modal */}
                {isDisplayModalOpen && displayNote && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[95vh] overflow-hidden flex flex-col">
                            {/* Header */}

                            <div className="p-6 border-b border-gray-300">

                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">{displayNote.title}</h3>
                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                            <FaCalendar className="w-4 h-4 mr-1" />
                                            <span>
                                                {new Date(displayNote.createdAt).toLocaleDateString('tr-TR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsDisplayModalOpen(false)}
                                        className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable content - now with more vertical space */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Image with overlay if exists */}
                                {displayNote.imgUrl && (
                                    <div className="relative">
                                        <img
                                            src={displayNote.imgUrl}
                                            alt="Note"
                                            className="w-full max-h-[60vh] object-cover"
                                        />
                                        {displayNote.tags && displayNote.tags.length > 0 && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                                                <div className="p-6 w-full">
                                                    <span
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-800"
                                                    >
                                                        <FaTag className="mr-2 h-3 w-3" />
                                                        {displayNote.tags[0]}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Drawing content if exists - more space */}
                                {displayNote.content && displayNote.content.startsWith('data:image') && (
                                    <div className="p-8">
                                        <img
                                            src={displayNote.content}
                                            alt="Drawing"
                                            className="w-full rounded-lg shadow-md"
                                        />
                                    </div>
                                )}

                                {/* AI Summary if exists - improved styling */}
                                {showSummary && summary && (
                                    <div
                                        ref={summaryRef}
                                        className="mt-4 p-4 bg-purple-50 rounded-md border border-purple-200">
                                        <h3 className="font-medium text-purple-800 mb-2">AI Summary</h3>
                                        <p className="text-gray-800">{summary}</p>
                                    </div>
                                )}

                                {/* Text content - increased padding and better typography */}
                                {(!displayNote.content || !displayNote.content.startsWith('data:image')) && (
                                    <div className="px-8 py-6">
                                        <p className="text-gray-700 whitespace-pre-wrap wrap-break-word leading-relaxed text-base">
                                            {displayNote.content}
                                        </p>
                                    </div>
                                )}

                                {/* Tags - improved layout */}
                                {displayNote.tags && Array.isArray(displayNote.tags) && displayNote.tags.length > 0 && (
                                    <div className="px-8 pb-8 flex flex-wrap gap-2">
                                        {displayNote.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                            >
                                                <FaTag className="mr-2 h-3 w-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer with action button - improved border and spacing */}
                            <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 shadow-inner">
                                <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-700 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                        <span>AI Summary: </span>
                                        <span className="ml-1 font-bold">{summaryUsage.count}/5</span>
                                        <span className="ml-1">remaining this week</span>
                                        {summaryUsage.count <= 1 && (
                                            <span className="ml-2 text-orange-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Resets on {summaryUsage.nextReset}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`relative flex items-center ${showSummaryInfo ? 'flex-col gap-5 ' : ''}`}>
                                    <div className={`relative flex items-center ${showSummaryInfo ? 'flex-col gap-5 ' : ''}`}>
                                        {showSummaryInfo && !isSummarizing && summaryUsage.count > 0 && (
                                            <div className="absolute bottom-full z-50 mb-2 w-80 px-4 py-3 bg-white text-sm text-blue-800 border border-blue-400 rounded-lg shadow-xl animate-fade-in font-medium transition-opacity duration-200  lg:left-[-150px] md:left-[-200px] sm:left-[-250px] "
                                                style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                                <div className="flex items-start">
                                                    <svg className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>
                                                        Summarization may take up to a few minutes depending on note length and AI service status. <a href="https://huggingface.co/facebook/bart-large-cnn" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 ml-1">Model status</a>.
                                                    </span>
                                                </div>
                                                <div className="absolute left-1/2 bottom-[-8px] w-0 h-0 -translate-x-1/2" style={{ zIndex: 51 }}>
                                                    <svg width="18" height="10" viewBox="0 0 18 10" className="block mx-auto">
                                                        <polygon points="9,10 0,0 18,0" fill="#fff" stroke="#60a5fa" strokeWidth="1" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                if (window.innerWidth <= 768) {
                                                    setShowSummaryInfo(!showSummaryInfo);
                                                } else {
                                                    setShowSummaryInfo(false);
                                                }
                                                handleSummarize(e);
                                            }}
                                            onMouseEnter={() => window.innerWidth > 768 && setShowSummaryInfo(true)}
                                            onFocus={() => window.innerWidth > 768 && setShowSummaryInfo(true)}
                                            onMouseLeave={() => window.innerWidth > 768 && setShowSummaryInfo(false)}
                                            onBlur={() => window.innerWidth > 768 && setShowSummaryInfo(false)}
                                            disabled={isSummarizing || summaryUsage.count <= 0}
                                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center cursor-pointer ${isSummarizing
                                                ? 'bg-blue-300 text-white cursor-wait'
                                                : summaryUsage.count <= 0
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                                }`}
                                            tabIndex={0}
                                        >
                                            {isSummarizing && (
                                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {isSummarizing
                                                ? 'Summarizing...'
                                                : summaryUsage.count <= 0
                                                    ? `Limit reached`
                                                    : 'Summarize with AI'}
                                        </button>
                                        {showSummaryInfo && window.innerWidth <= 768 && !isSummarizing && summaryUsage.count > 0 && (
                                            <div className="fixed inset-x-0 bottom-20 mx-auto z-50 w-64 sm:w-80 px-3 py-2 sm:px-4 sm:py-3 bg-white text-xs sm:text-sm text-blue-800 border border-blue-400 rounded-lg shadow-xl animate-fade-in font-medium transition-opacity duration-200"
                                                style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)', maxWidth: '90%', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                                <div className="flex items-start">
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>
                                                        Summarization may take up to a few minutes depending on note length and AI service status. <a href="https://huggingface.co/facebook/bart-large-cnn" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 ml-1">Model status</a>.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/*Add Note*/}
                {/* Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {editingNote && editingNote.content && editingNote.content.startsWith('data:image')
                                        ? 'Edit Note'
                                        : 'Add Note'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Background
                                </label>

                                <div className="flex gap-3 mb-2">
                                    {boxcolors.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setSelectedBoxColor(color.value)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedBoxColor === color.value
                                                ? 'border-gray-600 scale-110'
                                                : 'border-gray-200 hover:scale-105'
                                                }`}
                                            style={{
                                                backgroundColor: color.value,
                                                boxShadow: selectedBoxColor === color.value ? '0 0 0 2px white, 0 0 0 4px' + color.value : 'none'
                                            }}
                                            title={color.name}
                                        />
                                    ))}
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
                                {/* Image Upload Section */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Image Upload
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="imageUpload"
                                            disabled={uploadLoading}
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className={`cursor-pointer bg-white border-2 border-gray-300 border-dashed rounded-lg p-4 text-center hover:border-gray-400 transition-colors ${uploadLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="max-h-48 mx-auto"
                                                />
                                            ) : uploadLoading ? (
                                                <div className="text-gray-500">
                                                    <p>Uploading...</p>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500">
                                                    <FaImage className="mx-auto text-3xl mb-2" />
                                                    <p>Click to upload an image</p>
                                                    {editingNote?.imgUrl && (
                                                        <p className="text-sm text-blue-600 mt-1">
                                                            Current image will be kept if no new image is selected
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </label>
                                        {(previewUrl || editingNote?.imgUrl) && !uploadLoading && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove Image
                                            </button>
                                        )}
                                    </div>
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
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                        {isLoading ? "Loading.." : `${editingNote && editingNote.content && editingNote.content.startsWith('data:image')
                                            ? 'Update Drawing'
                                            : 'Save Note'}`}

                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Drawing Modal */}
                {isDrawingModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {editingNote ? "Edit Drawing Note" : "Add Drawing Note"}
                                </h3>
                                <button
                                    onClick={() => setIsDrawingModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>

                            <form onSubmit={handleDrawingSubmit}>
                                {/* Başlık Alanı */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="drawingTitle">
                                            Title
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            {(editingNote?.title || title).length}/50
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        id="drawingTitle"
                                        value={editingNote?.title || title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                        maxLength={50}
                                    />
                                </div>

                                {/* Çizim Alanı */}
                                <div className="mb-4">


                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Drawing Color
                                        </label>

                                        <div className="flex gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color.value)}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedColor === color.value
                                                        ? 'border-gray-600 scale-110'
                                                        : 'border-gray-200 hover:scale-105'
                                                        }`}
                                                    style={{
                                                        backgroundColor: color.value,
                                                        boxShadow: selectedColor === color.value ? '0 0 0 2px white, 0 0 0 4px' + color.value : 'none'
                                                    }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Drawing
                                    </label>
                                    <canvas
                                        ref={canvasRef}
                                        id="drawingCanvas"
                                        className="border-2 border-gray-300 rounded-lg w-full h-[400px] bg-white"
                                        onMouseDown={startDrawing}
                                        onMouseUp={finishDrawing}
                                        onMouseMove={draw}
                                        onMouseLeave={finishDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchEnd={finishDrawing}
                                        onTouchMove={draw}
                                    />
                                </div>

                                {/* Tag Alanı */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-700 text-sm font-bold">
                                            Tags ({tags.filter(tag => tag.trim() !== '').length}/6)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            disabled={tags.length >= 6}
                                            className={`text-blue-600 hover:text-blue-800 cursor-pointer ${tags.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={clearCanvas}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer"
                                    >
                                        Clear Drawing
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Drawing Note'}
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