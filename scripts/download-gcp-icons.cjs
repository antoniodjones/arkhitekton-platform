const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const https = require('https');

const tmpDir = '/tmp/gcp-icons';
const targetDir = './client/public/icons/gcp';

// Download URLs
const CORE_PRODUCTS_URL = 'https://services.google.com/fh/files/misc/core-products-icons.zip';
const CATEGORY_ICONS_URL = 'https://services.google.com/fh/files/misc/category-icons.zip';

// Create directories
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Download a file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${path.basename(destPath)}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${path.basename(destPath)}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}); // Delete file on error
      reject(err);
    });
  });
}

// Main execution
async function main() {
  try {
    // Download ZIP files
    console.log('=== Downloading Google Cloud Icons ===');
    await downloadFile(CORE_PRODUCTS_URL, path.join(tmpDir, 'core-products-icons.zip'));
    await downloadFile(CATEGORY_ICONS_URL, path.join(tmpDir, 'category-icons.zip'));
    
    // Extract core products
    console.log('\n=== Extracting Core Products Icons ===');
    const coreZip = new AdmZip(path.join(tmpDir, 'core-products-icons.zip'));
    coreZip.extractAllTo(path.join(tmpDir, 'core-products'), true);
    
    // Extract category icons
    console.log('=== Extracting Category Icons ===');
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
      
      const files = [];
      walkDir(sourceDir, (filePath) => {
        if (filePath.endsWith('.svg')) {
          const fileName = path.basename(filePath);
          const targetPath = path.join(targetSubdir, fileName);
          fs.copyFileSync(filePath, targetPath);
          files.push(fileName);
        }
      });
      return files;
    };
    
    // Copy files
    console.log('\n=== Copying Icons to Project ===');
    const coreFiles = copySvgFiles(path.join(tmpDir, 'core-products'), 'core');
    const categoryFiles = copySvgFiles(path.join(tmpDir, 'category'), 'category');
    
    console.log(`\nCore product icons: ${coreFiles.length}`);
    console.log(`Category icons: ${categoryFiles.length}`);
    
    // Generate icon list file for dynamic loading
    const iconManifest = {
      core: coreFiles.sort(),
      category: categoryFiles.sort(),
      downloadedAt: new Date().toISOString(),
      source: 'https://cloud.google.com/icons'
    };
    
    fs.writeFileSync(
      path.join(targetDir, 'manifest.json'),
      JSON.stringify(iconManifest, null, 2)
    );
    
    console.log('\n=== Summary ===');
    console.log(`Total GCP icons: ${coreFiles.length + categoryFiles.length}`);
    console.log(`Icons saved to: ${targetDir}`);
    console.log(`Manifest saved to: ${path.join(targetDir, 'manifest.json')}`);
    console.log('\n✅ Google Cloud icons downloaded successfully!');
    
  } catch (error) {
    console.error('Error downloading icons:', error);
    process.exit(1);
  }
}

main();
