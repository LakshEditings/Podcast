import mongoose from 'mongoose';
const pollFlagSchema = new mongoose.Schema({
    episode: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', required: true },
    flags: [{
        percentage: { type: Number, required: true }, question: { type: String, required: true },
        options: [{ text: { type: String, required: true }, votes: { type: Number, default: 0 } }]
    }],
}, { timestamps: true });
export default mongoose.model('PollFlag', pollFlagSchema);
