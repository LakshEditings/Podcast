import { Router } from 'express';
import Podcast from '../models/Podcast.js';
import Episode from '../models/Episode.js';
const router = Router();

// Get all podcasts (browse)
router.get('/', async (req, res) => {
    try {
        const { category, search, language } = req.query;
        let filter = { status: 'active' };
        if (category) filter.category = category;
        if (language) filter.language = language;
        if (search) filter.title = { $regex: search, $options: 'i' };
        const podcasts = await Podcast.find(filter).sort({ createdAt: -1 });
        res.json(podcasts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get podcast by ID with episodes
router.get('/:id', async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        const episodes = await Episode.find({ podcast: podcast._id }).sort({ createdAt: -1 });
        res.json({ podcast, episodes });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Increment listen count
router.post('/:episodeId/listen', async (req, res) => {
    try {
        await Episode.findByIdAndUpdate(req.params.episodeId, { $inc: { listens: 1 } });
        res.json({ message: 'Listen recorded' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
