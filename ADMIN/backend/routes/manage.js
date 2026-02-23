import { Router } from 'express';
import User from '../models/User.js';
import Creator from '../models/Creator.js';
import Podcast from '../models/Podcast.js';
import Episode from '../models/Episode.js';
import { auth } from '../middleware/auth.js';
const router = Router();

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
};

// Dashboard stats
router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const [users, creators, podcasts, episodes] = await Promise.all([
            User.countDocuments(), Creator.countDocuments(),
            Podcast.countDocuments(), Episode.countDocuments(),
        ]);
        const flagged = await Podcast.countDocuments({ flagged: true });
        const totalListens = (await Episode.aggregate([{ $group: { _id: null, total: { $sum: '$listens' } } }]))[0]?.total || 0;
        res.json({ users, creators, podcasts, episodes, flagged, totalListens });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// All users
router.get('/users', auth, adminOnly, async (req, res) => {
    try { res.json(await User.find().select('-password').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// All creators
router.get('/creators', auth, adminOnly, async (req, res) => {
    try { res.json(await Creator.find().select('-password').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// All podcasts
router.get('/content', auth, adminOnly, async (req, res) => {
    try { res.json(await Podcast.find().sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});

// Remove user
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
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
        const p = await Podcast.findById(req.params.id);
        if (!p) return res.status(404).json({ message: 'Not found' });
        p.flagged = !p.flagged;
        p.status = p.flagged ? 'flagged' : 'active';
        await p.save();
        res.json(p);
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
