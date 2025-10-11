const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const https = require('https');

const tmpDir = '/tmp/cloud-icons';
const targetDir = './client/public/icons/cloud';

// Download URLs for different cloud vendors
const CLOUD_VENDORS = {
  gcp: {
    name: 'Google Cloud',
    urls: [
      {
        url: 'https://services.google.com/fh/files/misc/core-products-icons.zip',
        type: 'core'
      },
      {
        url: 'https://services.google.com/fh/files/misc/category-icons.zip',
        type: 'category'
      }
    ]
  },
  aws: {
    name: 'AWS',
    urls: [
      {
        // Latest AWS Architecture Icons - updated quarterly
        url: 'https://d1.awsstatic.com/webteam/architecture-icons/q3-2024/Asset-Package_07312024.489977c3b3c4ce9ea88e45f0f645f770fb7b3e42.zip',
        type: 'all'
      }
    ]
  },
  oracle: {
    name: 'Oracle Cloud',
    urls: [
      {
        // Oracle draw.io package contains SVG icons
        url: 'https://docs.oracle.com/iaas/Content/Resources/Assets/OCI-Style-Guide-for-Drawio.zip',
        type: 'all'
      }
    ]
  }
};

// Create directories
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Download a file with redirect support
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(destPath);
    
    const fetch = (downloadUrl) => {
      https.get(downloadUrl, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(destPath);
          fetch(response.headers.location);
        } else if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${path.basename(destPath)}`);
            resolve();
          });
        } else {
          file.close();
          fs.unlinkSync(destPath);
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      }).on('error', (err) => {
        file.close();
        fs.unlinkSync(destPath);
        reject(err);
      });
    };
    
    fetch(url);
  });
}

// Walk directories recursively
const walkDir = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

// Copy SVG files from source to target
const copySvgFiles = (sourceDir, vendor, type) => {
  const targetSubdir = path.join(targetDir, vendor);
  if (!fs.existsSync(targetSubdir)) {
    fs.mkdirSync(targetSubdir, { recursive: true });
  }
  
  const files = [];
  walkDir(sourceDir, (filePath) => {
    if (filePath.endsWith('.svg')) {
      const fileName = path.basename(filePath);
      const targetPath = path.join(targetSubdir, fileName);
      fs.copyFileSync(filePath, targetPath);
      files.push({ name: fileName, type });
    }
  });
  return files;
};

// Main execution
async function main() {
  const manifest = {
    vendors: {},
    downloadedAt: new Date().toISOString(),
    sources: {}
  };

  try {
    // Process each cloud vendor
    for (const [vendorKey, vendorConfig] of Object.entries(CLOUD_VENDORS)) {
      console.log(`\n=== Processing ${vendorConfig.name} ===`);
      
      const vendorTmpDir = path.join(tmpDir, vendorKey);
      if (!fs.existsSync(vendorTmpDir)) {
        fs.mkdirSync(vendorTmpDir, { recursive: true });
      }

      let allFiles = [];

      // Download each URL for this vendor
      for (const source of vendorConfig.urls) {
        const zipFileName = `${vendorKey}-${source.type}.zip`;
        const zipPath = path.join(vendorTmpDir, zipFileName);
        
        try {
          await downloadFile(source.url, zipPath);
          
          // Extract ZIP
          console.log(`Extracting ${zipFileName}...`);
          const zip = new AdmZip(zipPath);
          const extractPath = path.join(vendorTmpDir, source.type);
          zip.extractAllTo(extractPath, true);
          
          // Copy SVG files
          const files = copySvgFiles(extractPath, vendorKey, source.type);
          allFiles.push(...files);
          console.log(`✓ Found ${files.length} SVG icons`);
        } catch (error) {
          console.error(`✗ Failed to process ${vendorConfig.name} ${source.type}:`, error.message);
        }
      }

      // Update manifest
      if (allFiles.length > 0) {
        manifest.vendors[vendorKey] = {
          name: vendorConfig.name,
          icons: allFiles.map(f => f.name).sort(),
          count: allFiles.length
        };
        manifest.sources[vendorKey] = vendorConfig.urls[0].url;
      }
    }

    // Save manifest
    fs.writeFileSync(
      path.join(targetDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    // Summary
    console.log('\n=== Summary ===');
    let totalIcons = 0;
    for (const [vendor, data] of Object.entries(manifest.vendors)) {
      console.log(`${data.name}: ${data.count} icons`);
      totalIcons += data.count;
    }
    console.log(`\nTotal cloud icons: ${totalIcons}`);
    console.log(`Icons saved to: ${targetDir}`);
    console.log(`Manifest: ${path.join(targetDir, 'manifest.json')}`);
    console.log('\n✅ Cloud icons downloaded successfully!');
    
  } catch (error) {
    console.error('Error downloading icons:', error);
    process.exit(1);
  }
}

main();
