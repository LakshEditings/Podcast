import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    episode: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String }],
        correct: { type: Number, required: true },
    }],
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
