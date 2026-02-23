import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import podcastRoutes from './routes/podcasts.js';
import uploadRoutes from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded audio files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/health', (req, res) => res.json({ service: 'CREATOR', status: 'ok' }));

const PORT = process.env.PORT || 5002;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎙️ CREATOR backend running on http://localhost:${PORT}`);
    });
});
