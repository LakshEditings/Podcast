import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { generateToken } from '../middleware/auth.js';
const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin || !(await bcrypt.compare(password, admin.password))) return res.status(400).json({ message: 'Invalid email or password' });
        const token = generateToken({ id: admin._id, role: 'admin' });
        res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
