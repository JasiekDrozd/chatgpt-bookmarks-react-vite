const fs = require('fs');
const path = require('path');

/**
 * Copies necessary files for Chrome extension to the dist directory
 */
function copyExtensionFiles() {
  console.log('Copying extension files to dist...');
  
  // Copy manifest.json
  const manifestPath = path.join(__dirname, '../public/manifest.json');
  const manifestDestPath = path.join(__dirname, '../dist/manifest.json');
  fs.copyFileSync(manifestPath, manifestDestPath);
  console.log('Copied manifest.json');
  
  // Copy icons directory
  const iconsDir = path.join(__dirname, '../public/icons');
  const iconsDestDir = path.join(__dirname, '../dist/icons');
  
  if (!fs.existsSync(iconsDestDir)) {
    fs.mkdirSync(iconsDestDir, { recursive: true });
  }
  
  const iconFiles = fs.readdirSync(iconsDir);
  iconFiles.forEach(file => {
    const sourcePath = path.join(iconsDir, file);
    const destPath = path.join(iconsDestDir, file);
    fs.copyFileSync(sourcePath, destPath);
  });
  console.log(`Copied ${iconFiles.length} icon files`);
  
  // Copy CSS for content script
  console.log('Creating content.css for content script styles...');
  const contentCssSource = path.join(__dirname, '../src/contentScript.css');
  const contentCssDest = path.join(__dirname, '../dist/content.css');
  fs.copyFileSync(contentCssSource, contentCssDest);
  
  // Verify that popup.js and popup.css exist
  const popupJsPath = path.join(__dirname, '../dist/popup.js');
  const popupCssPath = path.join(__dirname, '../dist/popup.css');
  
  if (!fs.existsSync(popupJsPath)) {
    console.error('ERROR: popup.js is missing! The build:popup task may not have completed successfully.');
    console.log('Make sure to run npm run build:popup before this script.');
  } else {
    console.log('Verified popup.js exists in dist directory');
  }
  
  if (!fs.existsSync(popupCssPath)) {
    console.log('WARNING: popup.css is missing from dist directory.');
  } else {
    console.log('Verified popup.css exists in dist directory');
  }
  
  // Fix popup.js paths in index.html if needed
  const indexHtmlPath = path.join(__dirname, '../dist/index.html');
  const sourceIndexHtmlPath = path.join(__dirname, '../index.html');
  
  // Create index.html if it doesn't exist
  if (!fs.existsSync(indexHtmlPath) && fs.existsSync(sourceIndexHtmlPath)) {
    console.log('Creating index.html in dist directory...');
    let htmlContent = fs.readFileSync(sourceIndexHtmlPath, 'utf8');
    
    // Update paths and ensure type="module" without duplicating it
    htmlContent = htmlContent.replace(/src="\/src\/main\.tsx"/, 'src="popup.js"');
    
    // Make sure the script tag has type="module" but without duplication
    if (!htmlContent.includes('type="module"')) {
      htmlContent = htmlContent.replace(/<script([^>]*)src="popup\.js"([^>]*)>/, '<script type="module" src="popup.js">');
    }
    
    fs.writeFileSync(indexHtmlPath, htmlContent);
    console.log('Created index.html with proper script paths and type="module"');
  } else if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Replace any relative paths with proper ones while ensuring type="module" is present but not duplicated
    htmlContent = htmlContent.replace(/<script([^>]*)src="([^"]+)"([^>]*)>/g, (match, before, src, after) => {
      // Normalize paths
      let newSrc = src;
      if (src.startsWith('/')) {
        newSrc = src.substring(1);
      }
      if (src.includes('main.tsx')) {
        newSrc = 'popup.js';
      }
      
      // If type="module" already exists in the match, don't add it again
      const hasTypeModule = match.includes('type="module"');
      if (!hasTypeModule) {
        return `<script type="module" src="${newSrc}">`;
      } else {
        // Remove duplicate type="module" if present
        const cleanBefore = before.replace(/type="module"\s*/, '');
        const cleanAfter = after.replace(/type="module"\s*/, '');
        return `<script${cleanBefore}type="module" src="${newSrc}"${cleanAfter}>`;
      }
    });
    
    fs.writeFileSync(indexHtmlPath, htmlContent);
    console.log('Fixed asset paths in index.html and ensured script has type="module" without duplication');
  }
  
  console.log('Extension files copy complete!');
  console.log('You can now load the "dist" directory as an unpacked extension in Chrome.');
}

copyExtensionFiles(); 