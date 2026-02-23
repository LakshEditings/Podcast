import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
const router = Router();

// Register listener
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
        const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
        const token = generateToken({ id: user._id, role: 'listener' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'listener' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Login listener
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid email or password' });
        const token = generateToken({ id: user._id, role: 'listener' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, points: user.points, streak: user.streak, role: 'listener' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
