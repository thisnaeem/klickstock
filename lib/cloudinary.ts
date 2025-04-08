import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
export async function uploadImageToCloudinary(file: Buffer, folder: string = 'freepik'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as 'image' | 'video' | 'auto' | 'raw',
      transformation: [
        { quality: 'auto:good' }, // Automatic quality optimization
        { fetch_format: 'auto' },  // Automatic format selection based on browser
        { width: 1920, crop: 'limit' } // Limit max width while maintaining aspect ratio
      ]
    };

    // Convert buffer to base64 string for Cloudinary upload
    const base64String = Buffer.from(file).toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64String}`;
    
    cloudinary.uploader.upload(dataURI, uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
        return;
      }
      
      resolve(result?.secure_url || '');
    });
  });
}

// Function to buffer a file from form data
export async function bufferizeFile(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
} 