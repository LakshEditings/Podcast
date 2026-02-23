import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import podcastRoutes from './routes/podcasts.js';
import quizPollRoutes from './routes/quizPolls.js';
import leaderboardRoutes from './routes/leaderboard.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/episodes', quizPollRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.get('/api/health', (req, res) => res.json({ service: 'USER', status: 'ok' }));

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎧 USER backend running on http://localhost:${PORT}`);
    });
});
