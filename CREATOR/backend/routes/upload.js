import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only audio files are allowed'));
    },
});

const router = Router();

// Upload multiple audio files (one per episode)
router.post('/', upload.array('audioFiles', 20), (req, res) => {
    try {
        const files = req.files?.map(f => ({
            originalName: f.originalname,
            filename: f.filename,
            path: `/uploads/${f.filename}`,
            size: f.size,
            mimetype: f.mimetype,
        })) || [];
        res.json({ message: `${files.length} file(s) uploaded`, files });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

export { upload };
export default router;
