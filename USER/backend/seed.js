import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Creator from './models/Creator.js';
import Admin from './models/Admin.js';
import Podcast from './models/Podcast.js';
import Episode from './models/Episode.js';
import Quiz from './models/Quiz.js';
import PollFlag from './models/PollFlag.js';
import Leaderboard from './models/Leaderboard.js';

const seed = async () => {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
        User.deleteMany(), Creator.deleteMany(), Admin.deleteMany(),
        Podcast.deleteMany(), Episode.deleteMany(), Quiz.deleteMany(),
        PollFlag.deleteMany(), Leaderboard.deleteMany(),
    ]);

    const pw = await bcrypt.hash('123456', 10);

    // ── Users ──
    console.log('👤 Creating users...');
    const user = await User.create({ name: 'Test Listener', email: 'user@test.com', password: pw });
    const user2 = await User.create({ name: 'Priya Kumar', email: 'priya@test.com', password: pw, avatar: '🥇', points: 475, streak: 5 });
    const user3 = await User.create({ name: 'Alex Morgan', email: 'alex@test.com', password: pw, avatar: '🥈', points: 435, streak: 3 });
    const user4 = await User.create({ name: 'Jordan Lee', email: 'jordan@test.com', password: pw, avatar: '🥉', points: 395, streak: 7 });

    // ── Creators ──
    console.log('🎙️ Creating creators...');
    const creator1 = await Creator.create({ name: 'Sarah Chen', email: 'creator@test.com', password: pw, bio: 'Tech enthusiast & podcaster', subscribers: 12400, totalListens: 31000 });
    const creator2 = await Creator.create({ name: 'David Park', email: 'david@test.com', password: pw, bio: 'Wellness coach', subscribers: 45000, totalListens: 96000 });
    const creator3 = await Creator.create({ name: 'Julia Ross', email: 'julia@test.com', password: pw, bio: 'True crime investigator', subscribers: 89000, totalListens: 180000 });

    // ── Admin ──
    console.log('🛡️ Creating admin...');
    await Admin.create({ name: 'Admin', email: 'admin@test.com', password: pw });

    // ── Podcasts ──
    console.log('📻 Creating podcasts...');
    const p1 = await Podcast.create({
        title: 'Tech Unplugged', description: 'Exploring the latest in tech, AI, and the digital future.',
        emoji: '💻', category: 'Technology', language: 'English', creator: creator1._id, creatorName: 'Sarah Chen', subscribers: 12400, episodeCount: 4
    });
    const p2 = await Podcast.create({
        title: 'Mindful Mornings', description: 'Start your day with guided meditation and wellness insights.',
        emoji: '🧘', category: 'Wellness', language: 'English', creator: creator2._id, creatorName: 'David Park', subscribers: 45000, episodeCount: 2
    });
    const p3 = await Podcast.create({
        title: 'Crime Files', description: 'Deep dives into the most mysterious unsolved cases.',
        emoji: '🔍', category: 'True Crime', language: 'English', creator: creator3._id, creatorName: 'Julia Ross', subscribers: 89000, episodeCount: 2
    });
    const p4 = await Podcast.create({
        title: 'Startup Stories', description: 'Real stories from founders who built companies from scratch.',
        emoji: '🚀', category: 'Business', language: 'English', creator: creator1._id, creatorName: 'Sarah Chen', subscribers: 22000, episodeCount: 1
    });
    const p5 = await Podcast.create({
        title: 'History Rewind', description: 'Fascinating tales from the pages of history.',
        emoji: '📜', category: 'History', language: 'English', creator: creator2._id, creatorName: 'David Park', subscribers: 56000, episodeCount: 1
    });
    await Podcast.create({
        title: 'Comedy Hour', description: 'Non-stop laughs with the funniest comedians around.',
        emoji: '😂', category: 'Comedy', language: 'English', creator: creator3._id, creatorName: 'Julia Ross', subscribers: 78000, episodeCount: 0
    });
    await Podcast.create({
        title: 'Science Daily', description: 'Breaking down complex science into bite-sized episodes.',
        emoji: '🔬', category: 'Science', language: 'Hindi', creator: creator1._id, creatorName: 'Sarah Chen', subscribers: 34000, episodeCount: 0
    });
    await Podcast.create({
        title: 'Music Lab', description: 'Behind the scenes of music production and artist stories.',
        emoji: '🎵', category: 'Music', language: 'Spanish', creator: creator2._id, creatorName: 'David Park', subscribers: 19000, episodeCount: 0
    });

    // ── Episodes ──
    console.log('🎧 Creating episodes...');
    const ep1 = await Episode.create({ podcast: p1._id, title: 'The Future of AI in 2025', duration: '42:15', listens: 8500 });
    const ep2 = await Episode.create({ podcast: p1._id, title: 'Web3 Reality Check', duration: '38:42', listens: 6200 });
    const ep3 = await Episode.create({ podcast: p1._id, title: 'Quantum Computing Explained', duration: '55:30', listens: 12000 });
    const ep4 = await Episode.create({ podcast: p1._id, title: 'The Rise of Edge Computing', duration: '31:18', listens: 4300 });
    const ep5 = await Episode.create({ podcast: p2._id, title: 'Morning Breathing Techniques', duration: '22:10', listens: 15000 });
    const ep6 = await Episode.create({ podcast: p2._id, title: 'Mindfulness at Work', duration: '28:45', listens: 11000 });
    const ep7 = await Episode.create({ podcast: p3._id, title: 'The Vanishing Hiker', duration: '48:33', listens: 32000 });
    const ep8 = await Episode.create({ podcast: p3._id, title: 'Cold Case Reopened', duration: '52:11', listens: 28000 });
    const ep9 = await Episode.create({ podcast: p4._id, title: 'From Garage to IPO', duration: '45:00', listens: 9800 });
    const ep10 = await Episode.create({ podcast: p5._id, title: 'The Fall of Rome', duration: '58:22', listens: 18000 });

    // ── Quizzes (5 questions per episode) ──
    console.log('📝 Creating quizzes...');
    await Quiz.create({
        episode: ep1._id, questions: [
            { question: 'What year was the term "Artificial Intelligence" coined?', options: ['1943', '1956', '1967', '1980'], correct: 1 },
            { question: 'Which AI model is known for generating images from text?', options: ['BERT', 'DALL-E', 'GPT-2', 'ResNet'], correct: 1 },
            { question: 'What does LLM stand for?', options: ['Large Language Model', 'Linear Logic Machine', 'Linked Learning Module', 'Low Latency Memory'], correct: 0 },
            { question: 'Which company developed the Transformer architecture?', options: ['OpenAI', 'Meta', 'Google', 'Apple'], correct: 2 },
            { question: 'What is "hallucination" in AI?', options: ['A visual glitch', 'Generating false information confidently', 'An error in training', 'A type of neural network'], correct: 1 },
        ]
    });
    await Quiz.create({
        episode: ep2._id, questions: [
            { question: 'What blockchain does Ethereum use?', options: ['Proof of Work', 'Proof of Stake', 'Proof of Authority', 'Proof of Burn'], correct: 1 },
            { question: 'What is a "smart contract"?', options: ['A legal document', 'Self-executing code on blockchain', 'An AI assistant', 'A type of wallet'], correct: 1 },
            { question: 'Who created Bitcoin?', options: ['Elon Musk', 'Satoshi Nakamoto', 'Vitalik Buterin', 'Mark Zuckerberg'], correct: 1 },
            { question: 'What does "DeFi" stand for?', options: ['Default Finance', 'Decentralized Finance', 'Digital Finance', 'Defined Finance'], correct: 1 },
            { question: 'What is an NFT?', options: ['New File Type', 'Non-Fungible Token', 'Network Free Transfer', 'Node Function Tool'], correct: 1 },
        ]
    });
    await Quiz.create({
        episode: ep3._id, questions: [
            { question: 'How many qubits does a basic quantum computer need?', options: ['1', '2', '50+', 'Depends on task'], correct: 3 },
            { question: 'What is quantum entanglement?', options: ['Particles linked regardless of distance', 'A type of encryption', 'Quantum error', 'Slow processing'], correct: 0 },
            { question: 'What is superposition?', options: ['Being in multiple states simultaneously', 'Being faster', 'Having more memory', 'Being connected'], correct: 0 },
            { question: 'Which company built the first 1000+ qubit processor?', options: ['Google', 'IBM', 'Microsoft', 'Intel'], correct: 1 },
            { question: 'What problem can quantum computers solve faster?', options: ['Word processing', 'Factoring large numbers', 'Web browsing', 'Video editing'], correct: 1 },
        ]
    });

    // ── Poll Flags ──
    console.log('📊 Creating poll flags...');
    await PollFlag.create({
        episode: ep1._id, flags: [
            { percentage: 25, question: 'Do you think AI will replace most jobs by 2030?', options: [{ text: 'Yes, definitely', votes: 342 }, { text: 'Only some jobs', votes: 567 }, { text: 'No way', votes: 201 }] },
            { percentage: 60, question: 'Which AI tool do you use the most?', options: [{ text: 'ChatGPT', votes: 890 }, { text: 'Gemini', votes: 456 }, { text: 'Claude', votes: 234 }, { text: 'None', votes: 120 }] },
            { percentage: 85, question: 'Should AI art be copyrightable?', options: [{ text: 'Yes', votes: 312 }, { text: 'No', votes: 445 }, { text: 'Depends', votes: 523 }] },
        ]
    });
    await PollFlag.create({
        episode: ep2._id, flags: [
            { percentage: 30, question: 'Have you invested in crypto?', options: [{ text: 'Yes, actively', votes: 234 }, { text: 'Just a little', votes: 456 }, { text: 'Never', votes: 310 }] },
            { percentage: 70, question: "What's the future of Web3?", options: [{ text: "It's the future", votes: 345 }, { text: 'Overhyped', votes: 567 }, { text: 'Too early to tell', votes: 388 }] },
        ]
    });

    // ── Leaderboard ──
    console.log('🏆 Creating leaderboard entries...');
    await Leaderboard.create({ user: user2._id, podcast: p1._id, correct: 5, totalQ: 5, avgTime: 2.1, points: 475, streak: 5 });
    await Leaderboard.create({ user: user3._id, podcast: p1._id, correct: 5, totalQ: 5, avgTime: 4.3, points: 435, streak: 3 });
    await Leaderboard.create({ user: user4._id, podcast: p1._id, correct: 5, totalQ: 5, avgTime: 6.8, points: 395, streak: 7 });
    await Leaderboard.create({ user: user._id, podcast: p1._id, correct: 0, totalQ: 5, avgTime: 0, points: 0, streak: 0 });

    console.log('');
    console.log('✅ Seed complete! Database populated with:');
    console.log('   👤 4 users (user@test.com / 123456)');
    console.log('   🎙️ 3 creators (creator@test.com / 123456)');
    console.log('   🛡️ 1 admin (admin@test.com / 123456)');
    console.log('   📻 8 podcasts');
    console.log('   🎧 10 episodes');
    console.log('   📝 3 quizzes (5 questions each)');
    console.log('   📊 2 poll flag sets');
    console.log('   🏆 4 leaderboard entries');
    process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
