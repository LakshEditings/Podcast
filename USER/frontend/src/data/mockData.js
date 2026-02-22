// Mock data for the entire podcast app
export const mockPodcasts = [
    { id: 1, title: 'Tech Unplugged', creator: 'Sarah Chen', emoji: '💻', category: 'Technology', episodes: 48, subscribers: 12400, language: 'English', description: 'Exploring the latest in tech, AI, and the digital future.' },
    { id: 2, title: 'Mindful Mornings', creator: 'David Park', emoji: '🧘', category: 'Wellness', episodes: 120, subscribers: 45000, language: 'English', description: 'Start your day with guided meditation and wellness insights.' },
    { id: 3, title: 'Crime Files', creator: 'Julia Ross', emoji: '🔍', category: 'True Crime', episodes: 67, subscribers: 89000, language: 'English', description: 'Deep dives into the most mysterious unsolved cases.' },
    { id: 4, title: 'Startup Stories', creator: 'Mike Johnson', emoji: '🚀', category: 'Business', episodes: 34, subscribers: 22000, language: 'English', description: 'Real stories from founders who built companies from scratch.' },
    { id: 5, title: 'History Rewind', creator: 'Emma Wilson', emoji: '📜', category: 'History', episodes: 89, subscribers: 56000, language: 'English', description: 'Fascinating tales from the pages of history.' },
    { id: 6, title: 'Comedy Hour', creator: 'Jake Torres', emoji: '😂', category: 'Comedy', episodes: 150, subscribers: 78000, language: 'English', description: 'Non-stop laughs with the funniest comedians around.' },
    { id: 7, title: 'Science Daily', creator: 'Dr. Aisha Patel', emoji: '🔬', category: 'Science', episodes: 200, subscribers: 34000, language: 'Hindi', description: 'Breaking down complex science into bite-sized episodes.' },
    { id: 8, title: 'Music Lab', creator: 'Carlos Rivera', emoji: '🎵', category: 'Music', episodes: 55, subscribers: 19000, language: 'Spanish', description: 'Behind the scenes of music production and artist stories.' },
];

export const mockEpisodes = [
    { id: 1, podcastId: 1, title: 'The Future of AI in 2025', duration: '42:15', date: 'Feb 20, 2025', listens: 8500 },
    { id: 2, podcastId: 1, title: 'Web3 Reality Check', duration: '38:42', date: 'Feb 13, 2025', listens: 6200 },
    { id: 3, podcastId: 1, title: 'Quantum Computing Explained', duration: '55:30', date: 'Feb 6, 2025', listens: 12000 },
    { id: 4, podcastId: 1, title: 'The Rise of Edge Computing', duration: '31:18', date: 'Jan 30, 2025', listens: 4300 },
    { id: 5, podcastId: 2, title: 'Morning Breathing Techniques', duration: '22:10', date: 'Feb 21, 2025', listens: 15000 },
    { id: 6, podcastId: 2, title: 'Mindfulness at Work', duration: '28:45', date: 'Feb 14, 2025', listens: 11000 },
    { id: 7, podcastId: 3, title: 'The Vanishing Hiker', duration: '48:33', date: 'Feb 19, 2025', listens: 32000 },
    { id: 8, podcastId: 3, title: 'Cold Case Reopened', duration: '52:11', date: 'Feb 12, 2025', listens: 28000 },
    { id: 9, podcastId: 4, title: 'From Garage to IPO', duration: '45:00', date: 'Feb 18, 2025', listens: 9800 },
    { id: 10, podcastId: 5, title: 'The Fall of Rome', duration: '58:22', date: 'Feb 17, 2025', listens: 18000 },
];

export const mockCategories = [
    { name: 'Technology', emoji: '💻', count: 245 }, { name: 'Wellness', emoji: '🧘', count: 180 },
    { name: 'True Crime', emoji: '🔍', count: 320 }, { name: 'Business', emoji: '🚀', count: 156 },
    { name: 'History', emoji: '📜', count: 210 }, { name: 'Comedy', emoji: '😂', count: 290 },
    { name: 'Science', emoji: '🔬', count: 175 }, { name: 'Music', emoji: '🎵', count: 130 },
    { name: 'Sports', emoji: '⚽', count: 200 }, { name: 'Education', emoji: '📚', count: 165 },
    { name: 'News', emoji: '📰', count: 300 }, { name: 'Fiction', emoji: '📖', count: 95 },
];

export const mockQuiz = {
    title: 'Tech Unplugged: AI Quiz', passScore: 2, reward: 50,
    questions: [
        { question: 'What does GPT stand for?', options: ['General Processing Tool', 'Generative Pre-trained Transformer', 'Global Pattern Technology', 'Grouped Parallel Threading'], correct: 1 },
        { question: 'Which company created ChatGPT?', options: ['Google', 'Meta', 'OpenAI', 'Microsoft'], correct: 2 },
        { question: 'What is the primary function of a neural network?', options: ['Data storage', 'Pattern recognition', 'Web browsing', 'File compression'], correct: 1 },
    ]
};

export const mockPolls = [
    { id: 1, question: 'What topic should we cover next?', options: [{ text: 'Blockchain & Crypto', votes: 234 }, { text: 'Cybersecurity Basics', votes: 189 }, { text: 'AR/VR Future', votes: 156 }, { text: 'Green Technology', votes: 201 }] },
    { id: 2, question: 'Preferred episode length?', options: [{ text: '15-30 minutes', votes: 412 }, { text: '30-45 minutes', votes: 567 }, { text: '45-60 minutes', votes: 234 }, { text: '60+ minutes', votes: 89 }] },
];

export const languages = ['English', 'Hindi', 'Spanish', 'French', 'Tamil', 'Telugu', 'Japanese', 'Korean', 'Mandarin', 'German'];
