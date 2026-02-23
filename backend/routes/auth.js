import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Creator from '../models/Creator.js';
import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// Register listener
router.post('/register/user', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        const token = generateToken({ id: user._id, role: 'listener' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'listener' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Register creator
router.post('/register/creator', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await Creator.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const creator = await Creator.create({ name, email, password: hashed });
        const token = generateToken({ id: creator._id, role: 'creator' });
        res.status(201).json({ token, user: { id: creator._id, name: creator.name, email: creator.email, role: 'creator' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login listener
router.post('/login/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
        const token = generateToken({ id: user._id, role: 'listener' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak, role: 'listener' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login creator
router.post('/login/creator', async (req, res) => {
    try {
        const { email, password } = req.body;
        const creator = await Creator.findOne({ email });
        if (!creator) return res.status(400).json({ message: 'Invalid email or password' });
        if (creator.banned) return res.status(403).json({ message: 'Account has been banned' });
        const valid = await bcrypt.compare(password, creator.password);
        if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
        const token = generateToken({ id: creator._id, role: 'creator' });
        res.json({ token, user: { id: creator._id, name: creator.name, email: creator.email, role: 'creator' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login admin
router.post('/login/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Invalid email or password' });
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
        const token = generateToken({ id: admin._id, role: 'admin' });
        res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
