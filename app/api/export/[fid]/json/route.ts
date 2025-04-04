import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = params.fid;
    
    // In a real app, you would:
    // 1. Verify authentication
    // 2. Fetch data from Farcaster API or your database
    // 3. Format the data as JSON
    
    // For demo purposes, let's create a simple mock JSON dataset
    const mockJsonData = {
      user: {
        fid: fid,
        username: 'demo_user',
        displayName: 'Demo User',
        bio: 'This is a demo export',
        followers: 150,
        following: 240,
      },
      casts: [
        {
          hash: '0x123',
          timestamp: '2023-01-01T12:00:00Z',
          text: 'Hello Farcaster world!',
          reactions: {
            likes: 5,
            recasts: 2,
          },
          url: 'https://warpcast.com/~/cast/0x123',
        },
        {
          hash: '0x456',
          timestamp: '2023-01-02T14:30:00Z',
          text: 'This is interesting',
          replyTo: '0xabc',
          reactions: {
            likes: 3,
            recasts: 0,
          },
          url: 'https://warpcast.com/~/cast/0x456',
        },
        {
          hash: '0x789',
          timestamp: '2023-01-03T09:15:00Z',
          text: 'Just sharing some thoughts',
          reactions: {
            likes: 12,
            recasts: 4,
          },
          url: 'https://warpcast.com/~/cast/0x789',
        },
      ],
      reactions: [
        {
          type: 'like',
          targetCast: '0xabc',
          timestamp: '2023-01-04T18:45:00Z',
          url: 'https://warpcast.com/~/cast/0xabc',
        },
        {
          type: 'recast',
          targetCast: '0xdef',
          timestamp: '2023-01-05T11:20:00Z',
          url: 'https://warpcast.com/~/cast/0xdef',
        },
      ],
    };

    // Set headers for JSON download
    return NextResponse.json(mockJsonData, {
      headers: {
        'Content-Disposition': `attachment; filename="warpcast-data-fid-${fid}.json"`,
      },
    });
  } catch (error) {
    console.error('Error generating JSON:', error);
    return NextResponse.json(
      { error: 'Failed to generate JSON export' },
      { status: 500 }
    );
  }
}