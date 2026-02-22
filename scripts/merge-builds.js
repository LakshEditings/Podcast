const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) copyDir(srcPath, destPath);
        else fs.copyFileSync(srcPath, destPath);
    }
}

const dist = path.join(__dirname, '..', 'dist');

// Clean & create dist
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist, { recursive: true });

// Copy root landing page
fs.copyFileSync(path.join(__dirname, '..', 'index.html'), path.join(dist, 'index.html'));

// Copy each frontend build into sub-directory
copyDir(path.join(__dirname, '..', 'USER', 'frontend', 'dist'), path.join(dist, 'user'));
copyDir(path.join(__dirname, '..', 'CREATOR', 'frontend', 'dist'), path.join(dist, 'creator'));
copyDir(path.join(__dirname, '..', 'ADMIN', 'frontend', 'dist'), path.join(dist, 'admin'));

console.log('✅ Merged all builds into /dist');
console.log('   /dist/index.html  → Landing page');
console.log('   /dist/user/       → Listener frontend');
console.log('   /dist/creator/    → Creator frontend');
console.log('   /dist/admin/      → Admin frontend');
