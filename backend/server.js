import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import podcastRoutes from './routes/podcasts.js';
import quizPollRoutes from './routes/quizPolls.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/episodes', quizPollRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API endpoints:`);
        console.log(`   POST /api/auth/login/user`);
        console.log(`   POST /api/auth/login/creator`);
        console.log(`   POST /api/auth/login/admin`);
        console.log(`   GET  /api/podcasts`);
        console.log(`   GET  /api/episodes/quiz/:episodeId`);
        console.log(`   GET  /api/episodes/polls/:episodeId`);
        console.log(`   GET  /api/leaderboard/:podcastId`);
        console.log(`   GET  /api/admin/stats`);
    });
});
