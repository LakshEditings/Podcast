import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import manageRoutes from './routes/manage.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', manageRoutes);
app.get('/api/health', (req, res) => res.json({ service: 'ADMIN', status: 'ok' }));

const PORT = process.env.PORT || 5003;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🛡️ ADMIN backend running on http://localhost:${PORT}`);
    });
});
