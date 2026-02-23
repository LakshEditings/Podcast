import { Router } from 'express';
import User from '../models/User.js';
import Creator from '../models/Creator.js';
import Podcast from '../models/Podcast.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Middleware: admin only
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
};

// Dashboard stats
router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const [users, creators, podcasts] = await Promise.all([
            User.countDocuments(), Creator.countDocuments(), Podcast.countDocuments(),
        ]);
        res.json({ users, creators, podcasts, flaggedContent: await Podcast.countDocuments({ flagged: true }) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all creators
router.get('/creators', auth, adminOnly, async (req, res) => {
    try {
        const creators = await Creator.find().select('-password').sort({ createdAt: -1 });
        res.json(creators);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Ban/unban user
router.patch('/users/:id/ban', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Not found' });
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Ban/unban creator
router.patch('/creators/:id/ban', auth, adminOnly, async (req, res) => {
    try {
        const creator = await Creator.findById(req.params.id);
        if (!creator) return res.status(404).json({ message: 'Not found' });
        creator.banned = !creator.banned;
        await creator.save();
        res.json({ message: `Creator ${creator.banned ? 'banned' : 'unbanned'}`, creator });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Flag/unflag podcast
router.patch('/content/:id/flag', auth, adminOnly, async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) return res.status(404).json({ message: 'Not found' });
        podcast.flagged = !podcast.flagged;
        podcast.status = podcast.flagged ? 'flagged' : 'active';
        await podcast.save();
        res.json(podcast);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Remove podcast
router.delete('/content/:id', auth, adminOnly, async (req, res) => {
    try {
        await Podcast.findByIdAndUpdate(req.params.id, { status: 'removed' });
        res.json({ message: 'Content removed' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
