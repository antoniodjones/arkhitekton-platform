const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tmpDir = '/tmp/cloud-icons';
const targetDir = './client/public/icons/cloud';

// Cloud icon sources using GitHub repos for easier access
const CLOUD_VENDORS = {
  gcp: {
    name: 'Google Cloud',
    // Use the existing GCP icons already downloaded
    skip: true
  },
  aws: {
    name: 'AWS',
    github: 'https://github.com/icacho-dev/aws-architecture-icons.git',
    sourcePath: 'Architecture-Service-Icons_02072025',
    categories: ['Arch_Compute', 'Arch_Storage', 'Arch_Database', 'Arch_Networking-Content-Delivery', 'Arch_Analytics', 'Arch_Machine-Learning', 'Arch_Security-Identity-Compliance']
  },
  azure: {
    name: 'Microsoft Azure',
    github: 'https://github.com/benc-uk/icon-collection.git',
    sourcePath: 'azure-icons'
  },
  oracle: {
    name: 'Oracle Cloud',
    // Oracle icons require manual download - will use placeholders or skip for now
    skip: true  
  }
};

// Create directories
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
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

// Copy SVG files from source to target with limit
const copySvgFiles = (sourceDir, vendor, limit = 50) => {
  const targetSubdir = path.join(targetDir, vendor);
  if (!fs.existsSync(targetSubdir)) {
    fs.mkdirSync(targetSubdir, { recursive: true });
  }
  
  const files = [];
  let count = 0;
  
  walkDir(sourceDir, (filePath) => {
    if (filePath.endsWith('.svg') && count < limit) {
      const fileName = path.basename(filePath);
      const targetPath = path.join(targetSubdir, fileName);
      
      // Copy file if it doesn't exist
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(filePath, targetPath);
      }
      
      // Always record the filename (whether copied or already exists)
      files.push(fileName);
      count++;
    }
  });
  
  return files.sort();
};

// Clone GitHub repository (idempotent - cleans up existing directory first)
function cloneRepo(url, destPath) {
  console.log(`Cloning ${url}...`);
  try {
    // Remove existing directory if it exists
    if (fs.existsSync(destPath)) {
      console.log(`Cleaning up existing directory...`);
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    
    // Shallow clone to save time and space
    execSync(`git clone --depth 1 ${url} ${destPath}`, { 
      stdio: 'pipe',
      timeout: 60000 
    });
    console.log(`✓ Cloned successfully`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to clone:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  const manifest = {
    vendors: {},
    downloadedAt: new Date().toISOString(),
    sources: {}
  };

  try {
    // Process GCP (already downloaded)
    console.log('\n=== Google Cloud ===');
    const gcpDir = './client/public/icons/gcp';
    if (fs.existsSync(gcpDir)) {
      const gcpFiles = [];
      walkDir(gcpDir, (filePath) => {
        if (filePath.endsWith('.svg')) {
          gcpFiles.push(path.basename(filePath));
        }
      });
      
      // Copy to cloud directory for unified access
      const gcpTargetDir = path.join(targetDir, 'gcp');
      if (!fs.existsSync(gcpTargetDir)) {
        fs.mkdirSync(gcpTargetDir, { recursive: true });
      }
      
      walkDir(gcpDir, (filePath) => {
        if (filePath.endsWith('.svg')) {
          const fileName = path.basename(filePath);
          const targetPath = path.join(gcpTargetDir, fileName);
          if (!fs.existsSync(targetPath)) {
            fs.copyFileSync(filePath, targetPath);
          }
        }
      });
      
      manifest.vendors.gcp = {
        name: 'Google Cloud',
        icons: gcpFiles.sort(),
        count: gcpFiles.length
      };
      manifest.sources.gcp = 'https://cloud.google.com/icons';
      console.log(`✓ Found ${gcpFiles.length} GCP icons`);
    }

    // Process each cloud vendor from GitHub
    for (const [vendorKey, vendorConfig] of Object.entries(CLOUD_VENDORS)) {
      if (vendorConfig.skip || vendorKey === 'gcp') continue;
      
      console.log(`\n=== Processing ${vendorConfig.name} ===`);
      
      const vendorTmpDir = path.join(tmpDir, vendorKey);
      
      // Clone repository
      if (cloneRepo(vendorConfig.github, vendorTmpDir)) {
        // Find and copy SVG files
        const sourceDir = path.join(vendorTmpDir, vendorConfig.sourcePath);
        
        if (vendorConfig.categories) {
          // For AWS, process specific categories
          let allFiles = [];
          for (const category of vendorConfig.categories) {
            const categoryPath = path.join(sourceDir, category);
            if (fs.existsSync(categoryPath)) {
              const files = copySvgFiles(categoryPath, vendorKey, 10); // 10 per category
              allFiles.push(...files);
            }
          }
          
          if (allFiles.length > 0) {
            manifest.vendors[vendorKey] = {
              name: vendorConfig.name,
              icons: allFiles,
              count: allFiles.length
            };
            manifest.sources[vendorKey] = vendorConfig.github;
          }
          console.log(`✓ Found ${allFiles.length} ${vendorConfig.name} icons`);
        } else {
          // For Azure, copy from main directory
          const files = copySvgFiles(sourceDir, vendorKey, 50);
          
          if (files.length > 0) {
            manifest.vendors[vendorKey] = {
              name: vendorConfig.name,
              icons: files,
              count: files.length
            };
            manifest.sources[vendorKey] = vendorConfig.github;
          }
          console.log(`✓ Found ${files.length} ${vendorConfig.name} icons`);
        }
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
