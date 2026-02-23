import { Router } from 'express';
import Podcast from '../models/Podcast.js';
import Episode from '../models/Episode.js';
import Quiz from '../models/Quiz.js';
import PollFlag from '../models/PollFlag.js';
import { auth } from '../middleware/auth.js';
const router = Router();

// Get creator's podcasts
router.get('/', auth, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ creator: req.user.id }).sort({ createdAt: -1 });
        res.json(podcasts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get podcast detail with episodes
router.get('/:id', auth, async (req, res) => {
    try {
        const podcast = await Podcast.findOne({ _id: req.params.id, creator: req.user.id });
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        const episodes = await Episode.find({ podcast: podcast._id }).sort({ createdAt: -1 });
        res.json({ podcast, episodes });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Upload podcast with episodes, quizzes, and poll flags
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, emoji, category, language, creatorName, episodes: episodeData } = req.body;
        const podcast = await Podcast.create({
            title, description, emoji: emoji || '🎧', category, language,
            creator: req.user.id, creatorName, episodeCount: episodeData?.length || 0,
        });

        if (episodeData && episodeData.length > 0) {
            for (const ep of episodeData) {
                const episode = await Episode.create({
                    podcast: podcast._id, title: ep.title,
                    description: ep.description, duration: ep.duration, captions: ep.captions || '',
                });
                // 5 quiz questions per episode
                if (ep.quizzes?.length > 0) {
                    const valid = ep.quizzes.filter(q => q.question?.trim());
                    if (valid.length > 0) await Quiz.create({ episode: episode._id, questions: valid });
                }
                // Poll flags on timeline
                if (ep.pollFlags?.length > 0) {
                    const valid = ep.pollFlags.filter(f => f.question?.trim());
                    if (valid.length > 0) {
                        await PollFlag.create({
                            episode: episode._id,
                            flags: valid.map(f => ({
                                percentage: f.percentage, question: f.question,
                                options: f.options.filter(o => o.trim()).map(o => ({ text: o, votes: 0 })),
                            })),
                        });
                    }
                }
            }
        }
        res.status(201).json(podcast);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete podcast
router.delete('/:id', auth, async (req, res) => {
    try {
        const podcast = await Podcast.findOne({ _id: req.params.id, creator: req.user.id });
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        const episodes = await Episode.find({ podcast: podcast._id });
        for (const ep of episodes) {
            await Quiz.deleteMany({ episode: ep._id });
            await PollFlag.deleteMany({ episode: ep._id });
        }
        await Episode.deleteMany({ podcast: podcast._id });
        await podcast.deleteOne();
        res.json({ message: 'Podcast deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get analytics for creator
router.get('/analytics/summary', auth, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ creator: req.user.id });
        const podcastIds = podcasts.map(p => p._id);
        const episodes = await Episode.find({ podcast: { $in: podcastIds } });
        const totalListens = episodes.reduce((sum, e) => sum + e.listens, 0);
        const totalSubs = podcasts.reduce((sum, p) => sum + p.subscribers, 0);
        res.json({
            totalPodcasts: podcasts.length, totalEpisodes: episodes.length,
            totalListens, totalSubscribers: totalSubs,
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
