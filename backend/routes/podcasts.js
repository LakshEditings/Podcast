import { Router } from 'express';
import Podcast from '../models/Podcast.js';
import Episode from '../models/Episode.js';
import Quiz from '../models/Quiz.js';
import PollFlag from '../models/PollFlag.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Get all podcasts
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let filter = { status: 'active' };
        if (category) filter.category = category;
        if (search) filter.title = { $regex: search, $options: 'i' };
        const podcasts = await Podcast.find(filter).sort({ createdAt: -1 });
        res.json(podcasts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get podcast by ID with episodes
router.get('/:id', async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
        const episodes = await Episode.find({ podcast: podcast._id }).sort({ createdAt: -1 });
        res.json({ podcast, episodes });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create podcast (creator only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'creator') return res.status(403).json({ message: 'Only creators can create podcasts' });
        const { title, description, emoji, category, language, episodes: episodeData } = req.body;
        const podcast = await Podcast.create({
            title, description, emoji, category, language,
            creator: req.user.id, creatorName: req.body.creatorName,
            episodeCount: episodeData?.length || 0,
        });

        // Create episodes with quizzes and poll flags
        if (episodeData && episodeData.length > 0) {
            for (const ep of episodeData) {
                const episode = await Episode.create({
                    podcast: podcast._id, title: ep.title,
                    description: ep.description, duration: ep.duration, captions: ep.captions || '',
                });
                // Create quiz (5 questions)
                if (ep.quizzes && ep.quizzes.length > 0) {
                    const validQuestions = ep.quizzes.filter(q => q.question && q.question.trim() !== '');
                    if (validQuestions.length > 0) {
                        await Quiz.create({ episode: episode._id, questions: validQuestions });
                    }
                }
                // Create poll flags
                if (ep.pollFlags && ep.pollFlags.length > 0) {
                    const validFlags = ep.pollFlags.filter(f => f.question && f.question.trim() !== '');
                    if (validFlags.length > 0) {
                        await PollFlag.create({
                            episode: episode._id,
                            flags: validFlags.map(f => ({
                                percentage: f.percentage,
                                question: f.question,
                                options: f.options.filter(o => o.trim() !== '').map(o => ({ text: o, votes: 0 })),
                            })),
                        });
                    }
                }
            }
        }
        res.status(201).json(podcast);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get podcasts by creator
router.get('/creator/:creatorId', auth, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ creator: req.params.creatorId }).sort({ createdAt: -1 });
        res.json(podcasts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete podcast
router.delete('/:id', auth, async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        if (req.user.role !== 'admin' && podcast.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Episode.deleteMany({ podcast: podcast._id });
        await podcast.deleteOne();
        res.json({ message: 'Podcast deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
