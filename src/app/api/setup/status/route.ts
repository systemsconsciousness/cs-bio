import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';

// Force this API route to be dynamic (not cached)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const siteConfig = await getSiteConfiguration();
    const setupCompleted = !!siteConfig;
    
    const response = NextResponse.json({
      setupCompleted,
      siteConfigExists: !!siteConfig,
      timestamp: Date.now()
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Setup status check error:', error);
    return NextResponse.json(
      { 
        setupCompleted: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}