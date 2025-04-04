// services/export-service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Constants
const NEYNAR_API_BASE = 'https://api.neynar.com/v2/farcaster';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || 'NEYNAR_API_KEY';
const MAX_BATCH_SIZE = 150; // Maximum allowed by the API
const S3_BUCKET = process.env.S3_BUCKET || 'your-public-bucket-name';
const S3_REGION = process.env.S3_REGION || 'us-east-1';

// S3 Client
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_AWS_ACCESS_KEY_ID',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_AWS_SECRET_ACCESS_KEY',
  },
});

/**
 * Fetch all casts for a user recursively
 */
async function fetchAllCastsForUser(fid: string, includeReplies: boolean = true): Promise<any[]> {
  let allCasts: any[] = [];
  let cursor: string | null = null;
  let hasMore = true;
  
  console.log(`Starting to fetch casts for FID: ${fid}`);
  
  while (hasMore) {
    try {
      // Construct URL with parameters
      let url = `${NEYNAR_API_BASE}/feed/user/casts?fid=${fid}&limit=${MAX_BATCH_SIZE}&include_replies=${includeReplies}`;
      if (cursor) {
        url += `&cursor=${encodeURIComponent(cursor)}`;
      }
      
      console.log(`Fetching casts with URL: ${url}`);
      
      // Make the request to Neynar API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': NEYNAR_API_KEY
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed with status ${response.status}: ${errorText}`);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Add fetched casts to our collection
      if (data.casts && Array.isArray(data.casts)) {
        allCasts = [...allCasts, ...data.casts];
        console.log(`Fetched ${data.casts.length} casts. Total so far: ${allCasts.length}`);
      } else {
        console.warn("Response didn't contain casts array:", data);
      }
      
      // Check if there's more data to fetch
      if (data.next && data.next.cursor) {
        cursor = data.next.cursor;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error('Error fetching casts:', error);
      hasMore = false; // Stop on error
    }
  }
  
  console.log(`Completed fetching all casts for FID: ${fid}. Total: ${allCasts.length}`);
  return allCasts;
}

/**
 * Save data to S3 and return the public URL
 */
async function saveToS3(data: any, filename: string): Promise<string> {
  try {
    console.log(`Uploading to S3: ${filename}`);
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: filename,
      Body: data,
      ContentType: 'application/json',
      ACL: 'public-read' // Make it publicly accessible
    });
    
    const response = await s3Client.send(command);
    console.log('S3 upload successful:', response);
    
    // Return the public URL
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${filename}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

/**
 * Export user casts (JSON only)
 */
export async function exportUserCasts(
  fid: string,
  includeReplies: boolean = true
): Promise<string> {
  // Fetch all casts
  const casts = await fetchAllCastsForUser(fid, includeReplies);
  
  // Generate unique filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `farcaster-casts-${fid}-${timestamp}.json`;
  
  // Prepare JSON data
  const fileData = JSON.stringify({
    metadata: {
      fid,
      exportDate: new Date().toISOString(),
      count: casts.length,
      includeReplies
    },
    casts
  }, null, 2);
  
  // Upload to S3
  const url = await saveToS3(fileData, filename);
  
  return url;
}