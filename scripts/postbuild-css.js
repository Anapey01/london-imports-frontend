const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', '.next', 'static', 'css');

if (!fs.existsSync(cssDir)) {
  console.log('[postbuild-css] .next/static/css directory not found. Skipping.');
  process.exit(0);
}

const files = fs.readdirSync(cssDir);
console.log('[postbuild-css] Found CSS files in build:', files);

// Find the main tailwind stylesheet (largest CSS file)
let mainCssFile = null;
let maxSizeBytes = 0;

for (const file of files) {
  if (file.endsWith('.css')) {
    const filePath = path.join(cssDir, file);
    const stat = fs.statSync(filePath);
    if (stat.size > maxSizeBytes) {
      maxSizeBytes = stat.size;
      mainCssFile = file;
    }
  }
}

if (mainCssFile) {
  console.log(`[postbuild-css] Main CSS file identified: ${mainCssFile} (${maxSizeBytes} bytes)`);
  const mainCssContent = fs.readFileSync(path.join(cssDir, mainCssFile));

  // Legacy hashes that might still be cached on CDN edges, browsers, or PWAs
  const legacyHashes = [
    '22d843d29efef3ed.css',
    '8ef137cc7b45679b.css',
    '2702258296b3bdef.css',
    '0b77e07caaecc1ad.css',
  ];

  for (const legacyHash of legacyHashes) {
    const targetPath = path.join(cssDir, legacyHash);
    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, mainCssContent);
      console.log(`[postbuild-css] Created legacy compatibility CSS copy: ${legacyHash}`);
    } else {
      console.log(`[postbuild-css] CSS file already exists: ${legacyHash}`);
    }
  }
} else {
  console.warn('[postbuild-css] No CSS files found to create legacy copies for.');
}
