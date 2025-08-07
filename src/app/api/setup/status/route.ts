import { NextResponse } from 'next/server';
import { getSiteConfiguration } from '@/lib/contentstack';

export async function GET() {
  try {
    const siteConfig = await getSiteConfiguration();
    
    return NextResponse.json({
      setupCompleted: !!(siteConfig && siteConfig.setup_completed)
    });
  } catch (error) {
    console.error('Setup status check error:', error);
    return NextResponse.json(
      { setupCompleted: false },
      { status: 500 }
    );
  }
}