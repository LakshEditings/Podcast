import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Creator from '../models/Creator.js';
import { generateToken } from '../middleware/auth.js';
const router = Router();

// Register creator
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;
        if (await Creator.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
        const creator = await Creator.create({ name, email, password: await bcrypt.hash(password, 10), bio });
        const token = generateToken({ id: creator._id, role: 'creator' });
        res.status(201).json({ token, user: { id: creator._id, name: creator.name, email: creator.email, role: 'creator' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login creator
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const creator = await Creator.findOne({ email });
        if (!creator || !(await bcrypt.compare(password, creator.password))) return res.status(400).json({ message: 'Invalid email or password' });
        if (creator.banned) return res.status(403).json({ message: 'Account has been banned' });
        const token = generateToken({ id: creator._id, role: 'creator' });
        res.json({ token, user: { id: creator._id, name: creator.name, email: creator.email, subscribers: creator.subscribers, role: 'creator' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
