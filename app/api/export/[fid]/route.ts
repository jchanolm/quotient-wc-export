import { NextRequest, NextResponse } from 'next/server';
import { exportUserCasts } from '@/services/export-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = params.fid;
    
    if (!fid) {
      return NextResponse.json(
        { error: 'Missing FID parameter' },
        { status: 400 }
      );
    }
    
    // Always use JSON format and include replies
    const includeReplies = true;
    
    // Process the export
    const downloadUrl = await exportUserCasts(fid);
    
    return NextResponse.json({
      success: true,
      url: downloadUrl,
      message: `Successfully exported casts for FID: ${fid}`
    });
  } catch (error) {
    console.error('Error processing export:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
}