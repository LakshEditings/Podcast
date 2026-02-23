import mongoose from 'mongoose';
const episodeSchema = new mongoose.Schema({
    podcast: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast', required: true },
    title: { type: String, required: true }, description: { type: String, default: '' },
    duration: { type: String, default: '00:00' }, listens: { type: Number, default: 0 },
    captions: { type: String, default: '' },
    audioFile: { type: String, default: '' },
    editHistory: [{
        field: String, oldValue: String, newValue: String,
        editedAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });
export default mongoose.model('Episode', episodeSchema);
