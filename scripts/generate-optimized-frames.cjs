const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const videoPath = path.join(__dirname, '..', 'walk.mp4');
const desktopFramesDir = path.join(__dirname, '..', 'public', 'frames');
const mobileFramesDir = path.join(__dirname, '..', 'public', 'frames-mobile');

console.log('=== EXTRACTING OPTIMIZED WEBP FRAMES ===');

// Clear existing frames
if (fs.existsSync(desktopFramesDir)) {
  fs.rmSync(desktopFramesDir, { recursive: true, force: true });
}
fs.mkdirSync(desktopFramesDir, { recursive: true });

if (fs.existsSync(mobileFramesDir)) {
  fs.rmSync(mobileFramesDir, { recursive: true, force: true });
}
fs.mkdirSync(mobileFramesDir, { recursive: true });

// 1. Desktop: 72 frames (9 fps * 8s), 1280px width, WebP quality 78
console.log('Generating 72 desktop frames (1280px width WebP)...');
execSync(`"${ffmpeg}" -y -i "${videoPath}" -vf "fps=9,scale='min(1280,iw)':-2" -c:v libwebp -quality 78 -vframes 72 "${desktopFramesDir}/frame_%04d.webp"`, { stdio: 'inherit' });

// 2. Mobile: 36 frames (4.5 fps * 8s), 640px width, WebP quality 72
console.log('Generating 36 mobile frames (640px width WebP)...');
execSync(`"${ffmpeg}" -y -i "${videoPath}" -vf "fps=4.5,scale='min(640,iw)':-2" -c:v libwebp -quality 72 -vframes 36 "${mobileFramesDir}/frame_%04d.webp"`, { stdio: 'inherit' });

// Check results
const desktopFiles = fs.readdirSync(desktopFramesDir).filter(f => f.endsWith('.webp'));
const mobileFiles = fs.readdirSync(mobileFramesDir).filter(f => f.endsWith('.webp'));

let dBytes = 0;
desktopFiles.forEach(f => dBytes += fs.statSync(path.join(desktopFramesDir, f)).size);

let mBytes = 0;
mobileFiles.forEach(f => mBytes += fs.statSync(path.join(mobileFramesDir, f)).size);

console.log(`\nDesktop frames generated: ${desktopFiles.length} files, Total size: ${(dBytes / (1024 * 1024)).toFixed(2)} MB (avg ${(dBytes / desktopFiles.length / 1024).toFixed(1)} KB/frame)`);
console.log(`Mobile frames generated: ${mobileFiles.length} files, Total size: ${(mBytes / (1024 * 1024)).toFixed(2)} MB (avg ${(mBytes / mobileFiles.length / 1024).toFixed(1)} KB/frame)`);
console.log(`Combined total frame weight: ${((dBytes + mBytes) / (1024 * 1024)).toFixed(2)} MB!`);
