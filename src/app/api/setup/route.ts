import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import axios from 'axios';

// Force this API route to be dynamic (not cached)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerName, ownerEmail, siteName, siteSubtitle, bio } = body;

    // Validate required fields
    if (!ownerName || !siteName) {
      return NextResponse.json(
        { error: 'Owner name and site name are required' },
        { status: 400 }
      );
    }

    // Server-side environment variables (secure)
    const API_KEY = process.env.CONTENTSTACK_API_KEY;
    const MGMT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
    const API_HOST = process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io';
    const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || 'production';
    const BASE_URL = `https://${API_HOST}`;

    if (!API_KEY || !MGMT_TOKEN) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create the site configuration entry
    const headers = {
      'api_key': API_KEY,
      'authorization': MGMT_TOKEN,
      'Content-Type': 'application/json'
    };

    // Check if site configuration already exists
    const checkResponse = await axios.get(
      `${BASE_URL}/v3/content_types/site_configuration/entries`,
      { headers }
    );

    if (checkResponse.data.entries && checkResponse.data.entries.length > 0) {
      return NextResponse.json(
        { error: 'Setup has already been completed' },
        { status: 400 }
      );
    }

    // Create the new site configuration entry
    const createData = {
      entry: {
        title: 'Site Configuration',
        site_name: siteName,
        site_subtitle: siteSubtitle || '',
        owner_name: ownerName,
        owner_email: ownerEmail || '',
        bio: bio || ''
      }
    };

    const createResponse = await axios.post(
      `${BASE_URL}/v3/content_types/site_configuration/entries`,
      createData,
      { headers }
    );

    const entryUid = createResponse.data.entry.uid;

    // Publish the new entry so it's available via delivery API
    try {
      const publishData = {
        entry: {
          environments: [ENVIRONMENT || 'production'],
          locales: ['en-us']
        }
      };

      await axios.post(
        `${BASE_URL}/v3/content_types/site_configuration/entries/${entryUid}/publish`,
        publishData,
        { headers }
      );

    } catch (publishError) {
      console.warn('Failed to publish entry, but creation succeeded:', publishError);
      // Don't fail the request if publish fails, the creation is what matters
    }

    // Revalidate pages to clear any cached data
    revalidatePath('/', 'layout'); // Revalidate layout to update metadata
    revalidatePath('/');
    revalidatePath('/setup');
    
    const response = NextResponse.json({ 
      success: true,
      timestamp: Date.now()
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Setup API error:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}