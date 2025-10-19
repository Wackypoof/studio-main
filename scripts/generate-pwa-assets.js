const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const iconsPath = path.join(publicPath, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsPath)) {
  fs.mkdirSync(iconsPath, { recursive: true });
}

// Source image path (replace with your logo path)
const sourceImage = path.join(publicPath, 'logo.png');

// Icon sizes
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate icons
async function generateIcons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      console.error(`Source image not found at: ${sourceImage}`);
      console.log('Please add your logo.png to the public folder');
      return;
    }

    console.log('Generating PWA icons...');
    
    // Generate each icon size
    for (const size of iconSizes) {
      const outputPath = path.join(iconsPath, `icon-${size}x${size}.png`);
      
      await sharp(sourceImage)
        .resize(size, size)
        .toFile(outputPath);
      
      console.log(`Generated: icons/icon-${size}x${size}.png`);
    }
    
    console.log('\nPWA icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
