// app/api/export/[fid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exportUserCasts } from '@/services/export-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = Number(params.fid);
    
    if (isNaN(fid)) {
      return NextResponse.json(
        { error: 'Invalid FID parameter' },
        { status: 400 }
      );
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const format = (url.searchParams.get('format') || 'json') as 'json' | 'csv';
    const includeReplies = url.searchParams.get('include_replies') !== 'false';
    
    if (format !== 'json' && format !== 'csv') {
      return NextResponse.json(
        { error: 'Format must be either "json" or "csv"' },
        { status: 400 }
      );
    }
    
    // Process the export
    const downloadUrl = await exportUserCasts(fid, format, includeReplies);
    
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