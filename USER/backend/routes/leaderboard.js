import { Router } from 'express';
import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
const router = Router();

// Get leaderboard for a podcast
router.get('/:podcastId', async (req, res) => {
    try {
        const entries = await Leaderboard.find({ podcast: req.params.podcastId }).populate('user', 'name avatar').sort({ points: -1 }).limit(20);
        res.json(entries.map((e, i) => ({
            rank: i + 1, name: e.user?.name || 'Unknown', avatar: e.user?.avatar || '👤',
            correct: e.correct, totalQ: e.totalQ, avgTime: e.avgTime, points: e.points, streak: e.streak, userId: e.user?._id,
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Submit quiz score
router.post('/submit', auth, async (req, res) => {
    try {
        const { podcastId, correct, totalQ, avgTime, points } = req.body;
        let entry = await Leaderboard.findOne({ user: req.user.id, podcast: podcastId });
        if (entry) {
            if (points > entry.points) { entry.correct = correct; entry.totalQ = totalQ; entry.avgTime = avgTime; entry.points = points; }
            entry.streak += 1;
            await entry.save();
        } else {
            entry = await Leaderboard.create({ user: req.user.id, podcast: podcastId, correct, totalQ, avgTime, points, streak: 1 });
        }
        await User.findByIdAndUpdate(req.user.id, { $inc: { points } });
        res.json(entry);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
