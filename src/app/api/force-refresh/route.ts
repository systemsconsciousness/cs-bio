import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // Force revalidate the home page and setup page
    revalidatePath('/');
    revalidatePath('/setup');
    
    // Clear any Next.js cache
    revalidatePath('/api/setup/status');
    
    console.log('🔄 Cache cleared, paths revalidated');
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Cache cleared and paths revalidated',
      timestamp: Date.now()
    });

    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Force refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh cache' },
      { status: 500 }
    );
  }
}