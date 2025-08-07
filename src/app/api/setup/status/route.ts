import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';

// Force this API route to be dynamic (not cached)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🔍 === Setup Status Check Starting ===');
    
    const siteConfig = await getSiteConfiguration();
    
    console.log('🔍 Status check - site config result:', siteConfig ? 'EXISTS' : 'NULL');
    console.log('🔍 Status check - site config type:', typeof siteConfig);
    
    // Setup is completed if any site configuration entry exists
    const setupCompleted = !!siteConfig;
    
    console.log('🔍 Status check - final result:', setupCompleted);
    console.log('🔍 === Setup Status Check Complete ===');
    
    const response = NextResponse.json({
      setupCompleted,
      siteConfigExists: !!siteConfig,
      timestamp: Date.now() // Add timestamp for cache busting
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