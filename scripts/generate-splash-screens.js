const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define splash screen configurations for different devices
const splashScreens = [
  // iPhone 5/SE (320x568 @2x)
  {
    width: 640,
    height: 1136,
    pixelRatio: 2,
    orientation: 'portrait',
    output: 'iphone5_splash.png',
  },
  // iPhone 6/7/8 (375x667 @2x)
  {
    width: 750,
    height: 1334,
    pixelRatio: 2,
    orientation: 'portrait',
    output: 'iphone6_splash.png',
  },
  // iPhone 6+/7+/8+ (414x736 @3x)
  {
    width: 1242,
    height: 2208,
    pixelRatio: 3,
    orientation: 'portrait',
    output: 'iphoneplus_splash.png',
  },
  // iPhone X/XS/11 Pro (375x812 @3x)
  {
    width: 1125,
    height: 2436,
    pixelRatio: 3,
    orientation: 'portrait',
    output: 'iphonex_splash.png',
  },
  // iPad (768x1024 @2x)
  {
    width: 1536,
    height: 2048,
    pixelRatio: 2,
    orientation: 'portrait',
    output: 'ipad_splash.png',
  },
  // iPad Pro (1024x1366 @2x)
  {
    width: 2048,
    height: 2732,
    pixelRatio: 2,
    orientation: 'portrait',
    output: 'ipadpro_splash.png',
  },
];

// Create splash screens directory if it doesn't exist
const splashDir = path.join(process.cwd(), 'public', 'splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
}

// Generate splash screens
async function generateSplashScreens() {
  console.log('Generating PWA splash screens...');
  
  // Source image path (replace with your splash screen image)
  const sourceImage = path.join(process.cwd(), 'public', 'splash-source.png');
  
  // Check if source image exists
  if (!fs.existsSync(sourceImage)) {
    console.error(`Splash screen source image not found at: ${sourceImage}`);
    console.log('Please add your splash-source.png to the public folder');
    return;
  }
  
  // Generate each splash screen
  for (const screen of splashScreens) {
    const outputPath = path.join(splashDir, screen.output);
    
    try {
      await sharp(sourceImage)
        .resize({
          width: screen.width,
          height: screen.height,
          fit: 'cover',
          position: 'center',
        })
        .toFile(outputPath);
      
      console.log(`Generated: splash/${screen.output} (${screen.width}x${screen.height})`);
    } catch (error) {
      console.error(`Error generating ${screen.output}:`, error);
    }
  }
  
  console.log('\nPWA splash screen generation complete!');
}

generateSplashScreens();
