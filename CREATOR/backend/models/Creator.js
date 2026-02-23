import mongoose from 'mongoose';
const creatorSchema = new mongoose.Schema({
    name: { type: String, required: true }, email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, bio: { type: String, default: '' },
    avatar: { type: String, default: '🎙️' }, subscribers: { type: Number, default: 0 },
    totalListens: { type: Number, default: 0 }, approved: { type: Boolean, default: true },
    banned: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Creator', creatorSchema);
