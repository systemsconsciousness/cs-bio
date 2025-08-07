import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    
    if (!uid) {
      return NextResponse.json({ error: 'Asset UID is required' }, { status: 400 });
    }

    const BASE_URL = process.env.CONTENTSTACK_API_HOST === 'api.contentstack.io' 
      ? 'https://api.contentstack.io' 
      : `https://${process.env.CONTENTSTACK_API_HOST}`;

    const headers = {
      api_key: process.env.CONTENTSTACK_API_KEY!,
      authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
      'Content-Type': 'application/json'
    };

    // Fetch asset details
    const response = await axios.get(
      `${BASE_URL}/v3/assets/${uid}`,
      { headers }
    );

    if (response.data?.asset) {
      return NextResponse.json({
        uid: response.data.asset.uid,
        url: response.data.asset.url,
        filename: response.data.asset.filename,
        title: response.data.asset.title
      }, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        }
      });
    }

    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}
