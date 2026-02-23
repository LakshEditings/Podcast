import { Router } from 'express';
import Quiz from '../models/Quiz.js';
import PollFlag from '../models/PollFlag.js';

const router = Router();

// Get quiz for an episode
router.get('/quiz/:episodeId', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ episode: req.params.episodeId });
        if (!quiz) return res.status(404).json({ message: 'No quiz for this episode' });
        res.json(quiz);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get poll flags for an episode
router.get('/polls/:episodeId', async (req, res) => {
    try {
        const pollFlag = await PollFlag.findOne({ episode: req.params.episodeId });
        if (!pollFlag) return res.json({ flags: [] });
        res.json(pollFlag);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Vote on a poll
router.post('/polls/:episodeId/vote', async (req, res) => {
    try {
        const { flagIndex, optionIndex } = req.body;
        const pollFlag = await PollFlag.findOne({ episode: req.params.episodeId });
        if (!pollFlag) return res.status(404).json({ message: 'Not found' });
        if (flagIndex >= pollFlag.flags.length) return res.status(400).json({ message: 'Invalid flag' });
        if (optionIndex >= pollFlag.flags[flagIndex].options.length) return res.status(400).json({ message: 'Invalid option' });
        pollFlag.flags[flagIndex].options[optionIndex].votes += 1;
        await pollFlag.save();
        res.json(pollFlag.flags[flagIndex]);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
