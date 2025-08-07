'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage('');

    try {
      // Force refresh the cache
      const response = await fetch('/api/force-refresh', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        setMessage('✅ Cache cleared successfully!');
        
        // Wait a moment then redirect to home
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage('❌ Failed to clear cache');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setMessage('❌ Error occurred while refreshing');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            🔄 Force Refresh
          </h1>
          <p className="text-muted-foreground mb-8">
            Use this page to clear caches and force a fresh setup check. 
            Useful when you&apos;ve deleted content in Contentstack but the site isn&apos;t reflecting the changes.
          </p>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full bg-accent text-accent-foreground font-semibold py-3 px-6 rounded-lg hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isRefreshing ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2"></div>
                Refreshing...
              </span>
            ) : (
              'Clear Cache & Refresh'
            )}
          </button>

          {message && (
            <div className="mt-4 p-3 rounded-lg bg-muted text-foreground">
              {message}
            </div>
          )}

          <div className="mt-8 text-sm text-muted-foreground">
            <p className="mb-2">💡 <strong>When to use this:</strong></p>
            <ul className="text-left space-y-1">
              <li>• Deleted Site Configuration entry</li>
              <li>• Deleted all content entries</li>
              <li>• Deleted content types</li>
              <li>• Setup form not appearing after changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}