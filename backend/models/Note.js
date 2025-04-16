import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    color: {
        type: String,
        default: "white"

    },
    imgUrl: {
        type: String,
        default: null,
        required: false
    },
    pinned: { type: Boolean, default: false }

}, {
    timestamps: true
});

const Note = mongoose.model('Note', noteSchema);

export default Note; 