import sharp from 'sharp';

/**
 * Creates a repeating watermark pattern SVG
 */
function createWatermarkPatternSVG(width: number, height: number, text: string = '© KlickStock'): string {
  // Calculate pattern size and spacing
  const patternWidth = 300;
  const patternHeight = 100;
  const xOffset = patternWidth / 2;
  const yOffset = patternHeight / 2;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="watermark" x="0" y="0" width="${patternWidth}" height="${patternHeight}" 
                 patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <text
            x="${xOffset}"
            y="${yOffset}"
            font-family="Arial, sans-serif"
            font-size="24"
            fill="rgba(255, 255, 255, 0.3)"
            text-anchor="middle"
            dominant-baseline="middle"
          >${text}</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#watermark)"/>
    </svg>
  `;
}

/**
 * Generates a preview image with repeating watermark pattern
 */
export async function generatePreviewWithWatermark(
  imageBuffer: Buffer,
  watermarkText: string = '© KlickStock'
): Promise<Buffer> {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 800;
    const originalHeight = metadata.height || 600;

    // Calculate preview dimensions (max width 800px while maintaining aspect ratio)
    const previewWidth = Math.min(originalWidth, 800);
    const previewHeight = Math.round((originalHeight * previewWidth) / originalWidth);

    // Create the watermark pattern SVG
    const watermarkSVG = createWatermarkPatternSVG(previewWidth, previewHeight, watermarkText);

    // Process the image
    const processedBuffer = await sharp(imageBuffer)
      // First resize the image
      .resize(previewWidth, previewHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      // Convert to RGB color space if needed
      .toColorspace('srgb')
      // Composite the watermark
      .composite([
        {
          input: Buffer.from(watermarkSVG),
          blend: 'over',
        }
      ])
      // Optimize for web
      .jpeg({
        quality: 80,
        mozjpeg: true, // Use mozjpeg for better compression
        chromaSubsampling: '4:4:4' // Better quality for text
      })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Error generating preview with watermark:', error);
    throw error;
  }
}

/**
 * Alternative version that creates a tiled diagonal text watermark
 */
export async function generatePreviewWithTiledWatermark(
  imageBuffer: Buffer,
  watermarkText: string = '© KlickStock'
): Promise<Buffer> {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 800;
    const originalHeight = metadata.height || 600;

    // Calculate preview dimensions
    const previewWidth = Math.min(originalWidth, 800);
    const previewHeight = Math.round((originalHeight * previewWidth) / originalWidth);

    // Create a small watermark tile
    const tileSize = 200;
    const tileSVG = `
      <svg width="${tileSize}" height="${tileSize}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .watermark { font-family: Arial, sans-serif; }
        </style>
        <text
          x="50%"
          y="50%"
          font-size="16"
          fill="rgba(255, 255, 255, 0.3)"
          text-anchor="middle"
          dominant-baseline="middle"
          transform="rotate(-45, ${tileSize/2}, ${tileSize/2})"
          class="watermark"
        >${watermarkText}</text>
      </svg>
    `;

    // Create the watermark tile buffer
    const tileBuffer = await sharp(Buffer.from(tileSVG))
      .png()
      .toBuffer();

    // Create a full-size watermark by extending the tile
    const fullWatermarkSVG = `
      <svg width="${previewWidth}" height="${previewHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tile" x="0" y="0" width="${tileSize}" height="${tileSize}" patternUnits="userSpaceOnUse">
            <image href="data:image/png;base64,${tileBuffer.toString('base64')}" width="${tileSize}" height="${tileSize}" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tile)"/>
      </svg>
    `;

    // Process the image
    const processedBuffer = await sharp(imageBuffer)
      .resize(previewWidth, previewHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .composite([
        {
          input: Buffer.from(fullWatermarkSVG),
          blend: 'over',
        }
      ])
      .jpeg({
        quality: 80,
        mozjpeg: true,
        chromaSubsampling: '4:4:4'
      })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Error generating preview with tiled watermark:', error);
    throw error;
  }
} 