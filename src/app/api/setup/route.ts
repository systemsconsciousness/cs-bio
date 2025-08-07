import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
    const BASE_URL = `https://${API_HOST}`;

    if (!API_KEY || !MGMT_TOKEN) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // First, get the existing site configuration entry
    const headers = {
      'api_key': API_KEY,
      'authorization': MGMT_TOKEN,
      'Content-Type': 'application/json'
    };

    // Get the site configuration entry
    const getResponse = await axios.get(
      `${BASE_URL}/v3/content_types/site_configuration/entries`,
      { headers }
    );

    const entries = getResponse.data.entries;
    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: 'Site configuration not found' },
        { status: 404 }
      );
    }

    const entryUid = entries[0].uid;

    // Update the site configuration entry
    const updateData = {
      entry: {
        title: 'Site Configuration',
        site_name: siteName,
        site_subtitle: siteSubtitle || '',
        owner_name: ownerName,
        owner_email: ownerEmail || '',
        bio: bio || '',
        setup_completed: true
      }
    };

    await axios.put(
      `${BASE_URL}/v3/content_types/site_configuration/entries/${entryUid}`,
      updateData,
      { headers }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup API error:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}