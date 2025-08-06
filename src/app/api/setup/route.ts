import { NextRequest, NextResponse } from 'next/server';
import { updateSiteConfiguration } from '@/lib/contentstack';

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

    // Update site configuration
    const success = await updateSiteConfiguration({
      owner_name: ownerName,
      owner_email: ownerEmail || '',
      site_name: siteName,
      site_subtitle: siteSubtitle || '',
      bio: bio || '',
      setup_completed: true
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update site configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}