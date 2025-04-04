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
async function fetchAllCastsForUser(fid: number, includeReplies: boolean = true): Promise<any[]> {
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
      
      // Make the request to Neynar API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-api-key': NEYNAR_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      
      // Add fetched casts to our collection
      if (data.casts && Array.isArray(data.casts)) {
        allCasts = [...allCasts, ...data.casts];
        console.log(`Fetched ${data.casts.length} casts. Total so far: ${allCasts.length}`);
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
 * Convert JSON data to CSV
 */
function convertToCSV(data: any[]): string {
  if (!data || !data.length) {
    return '';
  }
  
  // Start with a set of known essential fields
  const essentialFields = [
    'hash', 
    'thread_hash', 
    'parent_hash', 
    'author.fid', 
    'author.username', 
    'author.display_name', 
    'text', 
    'timestamp', 
    'reactions.likes', 
    'reactions.recasts', 
    'replies.count'
  ];
  
  // Extract all fields from first cast for header
  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: {[key: string]: any}, key: string) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
      } else {
        acc[`${pre}${key}`] = obj[key];
      }
      return acc;
    }, {});
  };
  
  // Simplify casts for CSV export by extracting only crucial information
  const simplifiedCasts = data.map(cast => {
    return {
      hash: cast.hash,
      thread_hash: cast.thread_hash || '',
      parent_hash: cast.parent_hash || '',
      fid: cast.author?.fid,
      username: cast.author?.username,
      display_name: cast.author?.display_name,
      text: cast.text,
      timestamp: cast.timestamp,
      likes: cast.reactions?.likes || 0,
      recasts: cast.reactions?.recasts || 0,
      replies: cast.replies?.count || 0,
      embed_url: cast.embeds?.[0]?.url || '',
      channel_id: cast.parent_url?.includes('channel') ? cast.parent_url : ''
    };
  });
  
  // Get headers from the simplified structure
  const headers = Object.keys(simplifiedCasts[0] || {});
  
  // Create CSV header row
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  simplifiedCasts.forEach(cast => {
    const values = headers.map(header => {
      const value = cast[header as keyof typeof cast];
      // Handle values that need quotes (strings with commas, quotes, newlines)
      if (typeof value === 'string') {
        // Clean the string and escape quotes
        return `"${value.replace(/"/g, '""').replace(/\n/g, ' ').trim()}"`;
      } else if (value === null || value === undefined) {
        return '';
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  return csvContent;
}

/**
 * Save data to S3 and return the public URL
 */
async function saveToS3(data: any, filename: string, contentType: string): Promise<string> {
  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: filename,
    Body: data,
    ContentType: contentType,
    ACL: 'public-read' // Make it publicly accessible
  });
  
  await s3Client.send(command);
  
  // Return the public URL
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${filename}`;
}

/**
 * Export user casts
 */
export async function exportUserCasts(
  fid: number,
  format: 'json' | 'csv' = 'json',
  includeReplies: boolean = true
): Promise<string> {
  // Fetch all casts
  const casts = await fetchAllCastsForUser(fid, includeReplies);
  
  // Generate unique filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `farcaster-casts-${fid}-${timestamp}.${format}`;
  
  // Prepare data based on format
  let fileData: string;
  let contentType: string;
  
  if (format === 'json') {
    fileData = JSON.stringify({
      metadata: {
        fid,
        exportDate: new Date().toISOString(),
        count: casts.length,
        includeReplies
      },
      casts
    }, null, 2);
    
    contentType = 'application/json';
  } else {
    fileData = convertToCSV(casts);
    contentType = 'text/csv';
  }
  
  // Upload to S3
  const url = await saveToS3(fileData, filename, contentType);
  
  return url;
}