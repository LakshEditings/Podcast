import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '👤' },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Podcast' }],
    history: [{ episode: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }, playedAt: { type: Date, default: Date.now } }],
    role: { type: String, default: 'listener' },
}, { timestamps: true });
export default mongoose.model('User', userSchema);
