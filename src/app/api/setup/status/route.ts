import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';

export async function GET() {
  try {
    const siteConfig = await getSiteConfiguration();
    
    console.log('🔍 Status check - site config:', JSON.stringify(siteConfig, null, 2));
    console.log('🔍 Status check - setup completed:', siteConfig?.setup_completed);
    
    const setupCompleted = !!(siteConfig && siteConfig.setup_completed);
    
    console.log('🔍 Status check - final result:', setupCompleted);
    
    return NextResponse.json({
      setupCompleted,
      siteConfig: siteConfig // Include for debugging
    });
  } catch (error) {
    console.error('Setup status check error:', error);
    return NextResponse.json(
      { setupCompleted: false },
      { status: 500 }
    );
  }
}