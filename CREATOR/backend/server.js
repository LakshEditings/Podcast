import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import podcastRoutes from './routes/podcasts.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.get('/api/health', (req, res) => res.json({ service: 'CREATOR', status: 'ok' }));

const PORT = process.env.PORT || 5002;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎙️ CREATOR backend running on http://localhost:${PORT}`);
    });
});
