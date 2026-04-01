const sharp = require('sharp');
const path = require('path');

async function optimizeImages() {
  const images = [
    {
      input: path.join(__dirname, '../src/assets/moz-electronic-hub.png'),
      output: path.join(__dirname, '../src/assets/moz-electronic-hub.webp'),
      width: 600,
      height: 400
    },
    {
      input: path.join(__dirname, '../src/assets/smart-irriga.png'),
      output: path.join(__dirname, '../src/assets/smart-irriga.webp'),
      width: 600,
      height: 400
    }
  ];

  for (const img of images) {
    try {
      await sharp(img.input)
        .resize(img.width, img.height, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(img.output);
      console.log(`✓ Optimized: ${path.basename(img.output)}`);
    } catch (error) {
      console.error(`✗ Error optimizing ${img.input}:`, error.message);
    }
  }
}

optimizeImages();
