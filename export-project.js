import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output file
const outputFile = 'project-export.txt';
let output = '';

// Function to walk directory recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    callback(path.join(dir, f), isDirectory);
    if (isDirectory) walkDir(dirPath, callback);
  });
}

// Exclude node_modules, .git, etc.
const excludeFolders = ['node_modules', '.git', 'dist', '.replit', '.config', '.upm'];
const excludeFiles = ['.DS_Store', 'package-lock.json', '.gitignore', 'project-export.txt'];
const excludeExtensions = ['.jpg', '.png', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

// Process all files
walkDir('.', (filePath, isDirectory) => {
  // Skip directories we don't want to process
  if (isDirectory) {
    if (excludeFolders.some(folder => filePath.includes('/' + folder + '/') || filePath === './' + folder)) {
      return;
    }
  } 
  // Process files
  else {
    const ext = path.extname(filePath);
    if (excludeFiles.includes(path.basename(filePath)) || excludeExtensions.includes(ext)) {
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      output += `\n\n===== FILE: ${filePath} =====\n\n`;
      output += content;
    } catch (err) {
      console.error(`Error reading file ${filePath}: ${err.message}`);
    }
  }
});

// Write output to file
fs.writeFileSync(outputFile, output);
console.log(`Project exported to ${outputFile}`);