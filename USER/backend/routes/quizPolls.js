import { Router } from 'express';
import Quiz from '../models/Quiz.js';
import PollFlag from '../models/PollFlag.js';
const router = Router();

// Get quiz for episode
router.get('/quiz/:episodeId', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ episode: req.params.episodeId });
        if (!quiz) return res.status(404).json({ message: 'No quiz' });
        res.json(quiz);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get poll flags for episode
router.get('/polls/:episodeId', async (req, res) => {
    try {
        const pf = await PollFlag.findOne({ episode: req.params.episodeId });
        res.json(pf || { flags: [] });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Vote on a poll
router.post('/polls/:episodeId/vote', async (req, res) => {
    try {
        const { flagIndex, optionIndex } = req.body;
        const pf = await PollFlag.findOne({ episode: req.params.episodeId });
        if (!pf || flagIndex >= pf.flags.length) return res.status(400).json({ message: 'Invalid' });
        pf.flags[flagIndex].options[optionIndex].votes += 1;
        await pf.save();
        res.json(pf.flags[flagIndex]);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
