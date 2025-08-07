import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';

export async function GET() {
  try {
    const siteConfig = await getSiteConfiguration();
    
    console.log('🔍 Status check - site config:', JSON.stringify(siteConfig, null, 2));
    console.log('🔍 Status check - setup completed field:', siteConfig?.setup_completed);
    
    // Check setup completion with multiple fallbacks
    const setupCompleted = !!(
      siteConfig && 
      (siteConfig.setup_completed === true || 
       siteConfig.setup_completed === 'true' ||
       siteConfig.setup_completed === 1)
    );
    
    console.log('🔍 Status check - final result:', setupCompleted);
    
    return NextResponse.json({
      setupCompleted,
      rawSetupFlag: siteConfig?.setup_completed,
      siteConfigExists: !!siteConfig
    });
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