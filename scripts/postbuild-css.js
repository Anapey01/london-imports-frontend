const fs = require('fs');
const path = require('path');

const candidateDirs = [
  path.join(__dirname, '..', '.next', 'static', 'css'),
  path.join(__dirname, '..', '.vercel', 'output', 'static', '_next', 'static', 'css'),
];

const legacyHashes = [
  '22d843d29efef3ed.css',
  '8ef137cc7b45679b.css',
  '2702258296b3bdef.css',
  '0b77e07caaecc1ad.css',
  'e4b84bdc30761cb9.css',
];

const targetDirs = [
  path.join(__dirname, '..', '.next', 'static', 'css'),
  path.join(__dirname, '..', 'public', 'legacy-css'),
  path.join(__dirname, '..', '.vercel', 'output', 'static', '_next', 'static', 'css'),
  path.join(__dirname, '..', '.vercel', 'output', 'static', 'legacy-css'),
];

let mainCssContent = null;
let mainCssSize = 0;

for (const dir of candidateDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.css')) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.size > mainCssSize) {
          mainCssSize = stat.size;
          mainCssContent = fs.readFileSync(filePath);
        }
      }
    }
  }
}

if (!mainCssContent) {
  const fallbackFile = path.join(__dirname, '..', 'public', 'legacy-css', '22d843d29efef3ed.css');
  if (fs.existsSync(fallbackFile)) {
    mainCssContent = fs.readFileSync(fallbackFile);
    mainCssSize = mainCssContent.length;
    console.log('[postbuild-css] Loaded fallback CSS from public/legacy-css');
  }
}

if (mainCssContent) {
  console.log(`[postbuild-css] Main CSS bundle ready (${mainCssSize} bytes)`);

  for (const targetDir of targetDirs) {
    try {
      const parentDir = path.dirname(targetDir);
      if (fs.existsSync(parentDir) || targetDir.includes('public') || targetDir.includes('.next')) {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        for (const legacyHash of legacyHashes) {
          const targetPath = path.join(targetDir, legacyHash);
          fs.writeFileSync(targetPath, mainCssContent);
        }
        console.log(`[postbuild-css] Synced legacy CSS to: ${targetDir}`);
      }
    } catch (err) {
      console.warn(`[postbuild-css] Could not write to ${targetDir}:`, err.message);
    }
  }
} else {
  console.warn('[postbuild-css] No CSS bundle available to replicate.');
}
