const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const tmpDir = '/tmp/gcp-icons';
const targetDir = './client/public/icons/gcp';

// Create target directory
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Extract core products
console.log("Extracting core-products-icons.zip...");
const coreZip = new AdmZip(path.join(tmpDir, 'core-products-icons.zip'));
coreZip.extractAllTo(path.join(tmpDir, 'core-products'), true);

// Extract category icons
console.log("Extracting category-icons.zip...");
const categoryZip = new AdmZip(path.join(tmpDir, 'category-icons.zip'));
categoryZip.extractAllTo(path.join(tmpDir, 'category'), true);

// Function to walk directories and find SVG files
const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

// Copy SVG files to project
const copySvgFiles = (sourceDir, subdir) => {
  const targetSubdir = path.join(targetDir, subdir);
  if (!fs.existsSync(targetSubdir)) {
    fs.mkdirSync(targetSubdir, { recursive: true });
  }
  
  walkDir(sourceDir, (filePath) => {
    if (filePath.endsWith('.svg')) {
      const fileName = path.basename(filePath);
      const targetPath = path.join(targetSubdir, fileName);
      fs.copyFileSync(filePath, targetPath);
      console.log(`Copied: ${fileName} -> ${subdir}/${fileName}`);
    }
  });
};

// Copy files
console.log("\n=== Copying Core Product Icons ===");
copySvgFiles(path.join(tmpDir, 'core-products'), 'core');

console.log("\n=== Copying Category Icons ===");
copySvgFiles(path.join(tmpDir, 'category'), 'category');

// List what we have
const coreFiles = fs.readdirSync(path.join(targetDir, 'core')).filter(f => f.endsWith('.svg'));
const categoryFiles = fs.readdirSync(path.join(targetDir, 'category')).filter(f => f.endsWith('.svg'));

console.log(`\n=== Summary ===`);
console.log(`Core product icons: ${coreFiles.length}`);
console.log(`Category icons: ${categoryFiles.length}`);
console.log(`Total GCP icons: ${coreFiles.length + categoryFiles.length}`);
console.log(`\nIcons saved to: ${targetDir}`);
