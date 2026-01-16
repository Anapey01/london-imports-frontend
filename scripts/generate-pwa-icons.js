const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../public/logo.jpg');
const OUTPUT_DIR = path.join(__dirname, '../public');

const SIZES = [192, 512];

async function generateIcons() {
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.error('Error: Source image not found at', SOURCE_IMAGE);
        process.exit(1);
    }

    console.log('Generating PWA icons from:', SOURCE_IMAGE);

    for (const size of SIZES) {
        const outputPath = path.join(OUTPUT_DIR, `icon-${size}.png`);

        try {
            await sharp(SOURCE_IMAGE)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent if png, but source is jpg so doesn't matter much unless we convert.
                })
                .toFile(outputPath);

            console.log(`✅ Generated: ${outputPath}`);
        } catch (error) {
            console.error(`❌ Failed to generate ${size}px icon:`, error);
        }
    }
}

generateIcons();
