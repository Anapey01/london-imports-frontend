const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './public/assets/images';

const imagesToConvert = [
    { src: 'fashion-for-less.png', quality: 80 },
    { src: 'tech-essentials.png', quality: 80 },
    { src: 'newyear-drop.jpg', quality: 85 },
    { src: 'home-living-1.jpg', quality: 80 },
    { src: 'home-living-2.jpg', quality: 80 },
    { src: 'tech-essentials.jpg', quality: 80 },
];

async function convertImages() {
    for (const img of imagesToConvert) {
        const inputPath = path.join(imagesDir, img.src);
        const outputName = img.src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const outputPath = path.join(imagesDir, outputName);

        if (!fs.existsSync(inputPath)) {
            console.log(`Skipping ${img.src} - file not found`);
            continue;
        }

        try {
            const originalSize = fs.statSync(inputPath).size;

            await sharp(inputPath)
                .webp({ quality: img.quality })
                .resize({ width: 1200, withoutEnlargement: true }) // Max width for hero images
                .toFile(outputPath);

            const newSize = fs.statSync(outputPath).size;
            const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

            console.log(`✓ ${img.src} → ${outputName}`);
            console.log(`  ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
        } catch (err) {
            console.error(`Error converting ${img.src}:`, err.message);
        }
    }
}

convertImages();
