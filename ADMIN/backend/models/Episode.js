import mongoose from 'mongoose';
const episodeSchema = new mongoose.Schema({
    podcast: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast', required: true },
    title: { type: String, required: true }, description: { type: String, default: '' },
    duration: { type: String, default: '00:00' }, listens: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Episode', episodeSchema);
