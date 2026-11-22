const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

console.log('=== STEP 1: COMPRESSING VIDEO ===');
const inputVideo = path.join(__dirname, '..', 'walk.mp4');
const outputVideo = path.join(__dirname, '..', 'walk-compressed.mp4');

if (fs.existsSync(inputVideo)) {
  console.log('Compressing walk.mp4 with H.264 (CRF 24)...');
  execSync(`"${ffmpeg}" -y -i "${inputVideo}" -c:v libx264 -crf 24 -preset fast -movflags +faststart -an "${outputVideo}"`, { stdio: 'inherit' });
  const inSize = (fs.statSync(inputVideo).size / (1024 * 1024)).toFixed(2);
  const outSize = (fs.statSync(outputVideo).size / (1024 * 1024)).toFixed(2);
  console.log(`Original video: ${inSize} MB -> Compressed video: ${outSize} MB`);

  // Replace walk.mp4 with the compressed version
  fs.copyFileSync(outputVideo, inputVideo);
  fs.unlinkSync(outputVideo);
  console.log(`Replaced walk.mp4 with compressed version (${outSize} MB).`);
}

console.log('\n=== STEP 2: CONVERTING IMAGES TO WEBP ===');
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(png|jpe?g)$/i.test(f));

let totalOriginalBytes = 0;
let totalWebpBytes = 0;

for (const file of imageFiles) {
  const inputPath = path.join(imagesDir, file);
  const baseName = path.parse(file).name;
  const outputPath = path.join(imagesDir, `${baseName}.webp`);

  const inBytes = fs.statSync(inputPath).size;
  totalOriginalBytes += inBytes;

  console.log(`Converting ${file} -> ${baseName}.webp...`);
  // Convert to WebP using libwebp at quality 82, with max dimension 1600px
  execSync(`"${ffmpeg}" -y -i "${inputPath}" -vf "scale='min(1600,iw)':-2" -c:v libwebp -quality 82 "${outputPath}"`);

  const outBytes = fs.statSync(outputPath).size;
  totalWebpBytes += outBytes;
  console.log(`  ${(inBytes/1024).toFixed(1)} KB -> ${(outBytes/1024).toFixed(1)} KB (${((1 - outBytes/inBytes)*100).toFixed(0)}% saved)`);
}

console.log(`\nImages converted: ${(totalOriginalBytes/(1024*1024)).toFixed(2)} MB -> ${(totalWebpBytes/(1024*1024)).toFixed(2)} MB (${((1 - totalWebpBytes/totalOriginalBytes)*100).toFixed(0)}% total reduction)`);
