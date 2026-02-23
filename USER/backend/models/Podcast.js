import mongoose from 'mongoose';
const podcastSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    emoji: { type: String, default: '🎧' },
    category: { type: String, required: true },
    language: { type: String, default: 'English' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    creatorName: { type: String },
    subscribers: { type: Number, default: 0 },
    episodeCount: { type: Number, default: 0 },
    flagged: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'flagged', 'removed'], default: 'active' },
    editHistory: [{
        field: String, oldValue: String, newValue: String,
        editedAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });
export default mongoose.model('Podcast', podcastSchema);
