const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Client', 'src');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace <LogoLoader ... /> back to <CircularProgress ... />
    if (content.includes('<LogoLoader')) {
      content = content.replace(/<LogoLoader([^>]*)>/g, '<CircularProgress$1>');
      content = content.replace(/<\/LogoLoader>/g, '</CircularProgress>');
      modified = true;
    }

    // Remove LogoLoader imports
    if (content.includes("import LogoLoader from")) {
      content = content.replace(/import LogoLoader from '.*';\n?/g, '');
      modified = true;
    }

    // Ensure CircularProgress is imported from @mui/material if used
    if (content.includes('<CircularProgress') && !content.includes('CircularProgress')) {
        // This is a bit tricky if it was removed from an existing { ... } import
        // Let's check if @mui/material import exists
        if (content.includes("from '@mui/material'")) {
            content = content.replace(/import\s*\{([^}]*)\}\s*from\s*'@mui\/material'/g, (match, p1) => {
                if (!p1.includes('CircularProgress')) {
                    return `import { ${p1.trim()}, CircularProgress } from '@mui/material'`;
                }
                return match;
            });
            modified = true;
        }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Reverted:', filePath);
    }
  }
});
