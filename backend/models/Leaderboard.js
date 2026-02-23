import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    podcast: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast', required: true },
    correct: { type: Number, default: 0 },
    totalQ: { type: Number, default: 5 },
    avgTime: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
}, { timestamps: true });

leaderboardSchema.index({ podcast: 1, points: -1 });

export default mongoose.model('Leaderboard', leaderboardSchema);
