import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';
import { checkContentTypesExist } from '@/lib/contentstack-setup';

export async function GET() {
  try {
    console.log('🔧 Debug setup endpoint called');
    
    const debug = {
      timestamp: new Date().toISOString(),
      environment: {
        API_KEY: !!process.env.CONTENTSTACK_API_KEY,
        DELIVERY_TOKEN: !!process.env.CONTENTSTACK_DELIVERY_TOKEN,
        MGMT_TOKEN: !!process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
        ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT || 'production'
      },
      contentTypesExist: false,
      siteConfig: null,
      siteConfigExists: false,
      setupCompleted: false,
      logs: [] as string[]
    };

    // Capture console logs
    const originalLog = console.log;
    const logs: string[] = [];
    console.log = (...args) => {
      const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
      logs.push(message);
      originalLog(...args);
    };

    try {
      // Check content types
      debug.contentTypesExist = await checkContentTypesExist();
      
      // Check site configuration
      debug.siteConfig = await getSiteConfiguration();
      debug.siteConfigExists = !!debug.siteConfig;
      debug.setupCompleted = debug.siteConfigExists;
      
    } catch (error) {
      logs.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Restore console.log
      console.log = originalLog;
      debug.logs = logs;
    }

    const response = NextResponse.json(debug);
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: `Debug endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}