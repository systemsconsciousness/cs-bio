import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';

export async function GET() {
  try {
    console.log('🔍 Debug: Starting site config check...');
    
    const siteConfig = await getSiteConfiguration();
    
    const debug = {
      timestamp: new Date().toISOString(),
      configExists: !!siteConfig,
      configData: siteConfig ? {
        site_name: siteConfig.site_name,
        owner_name: siteConfig.owner_name,
        hasTitle: !!siteConfig.title
      } : null,
      env: {
        api_key_present: !!process.env.CONTENTSTACK_API_KEY,
        delivery_token_present: !!process.env.CONTENTSTACK_DELIVERY_TOKEN,
        management_token_present: !!process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
        environment: process.env.CONTENTSTACK_ENVIRONMENT,
        api_host: process.env.CONTENTSTACK_API_HOST,
        cdn: process.env.CONTENTSTACK_CDN
      }
    };

    console.log('🔍 Debug result:', debug);

    const response = NextResponse.json(debug);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}