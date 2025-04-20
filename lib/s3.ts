import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.NAWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NAWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NAWS_SECRET_ACCESS_KEY || '',
  },
});

// Function to upload image to AWS S3
export async function uploadImageToS3(
  file: Buffer,
  folderName: string,
  fileName: string
): Promise<string> {
  // Generate a unique key for the file
  const key = `${folderName}/${Date.now()}-${fileName}`;
  
  // Set up the upload parameters
  const params = {
    Bucket: process.env.NAWS_BUCKET_NAME || '',
    Key: key,
    Body: file,
    ContentType: 'image/jpeg', // Adjust content type as needed
  };

  try {
    // Upload file to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Create a signed URL or direct URL to the uploaded file
    const fileUrl = `https://${params.Bucket}.s3.${process.env.NAWS_REGION || 'us-east-1'}.amazonaws.com/${params.Key}`;
    
    return fileUrl;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

// Function to generate a pre-signed URL for direct browser upload
export async function getPresignedUploadUrl(
  folderName: string,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<{ url: string; key: string }> {
  // Generate a unique key for the file
  const key = `${folderName}/${Date.now()}-${fileName}`;
  
  // Set up the upload parameters
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '',
    Key: key,
    ContentType: contentType,
  };

  try {
    // Create a command for putting an object in the bucket
    const command = new PutObjectCommand(params);
    
    // Generate a pre-signed URL that expires in 15 minutes
    const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    
    return { url, key };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
}