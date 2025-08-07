'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WelcomeSetup from '@/components/WelcomeSetup';

// Force this page to be dynamic (not cached)
export const dynamic = 'force-dynamic';

interface SetupFormData {
  ownerName: string;
  ownerEmail: string;
  siteName: string;
  siteSubtitle: string;
  bio: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check if setup is already completed
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        // Add cache-busting query parameter
        const response = await fetch(`/api/setup/status?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await response.json();
        
        if (data.setupCompleted) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Failed to check setup status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, [router]);

  const handleSetupComplete = async (data: SetupFormData) => {
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Setup failed');
    }



    // Wait for the data to propagate through Contentstack's systems
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Force a complete page reload to ensure all data is fresh
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <WelcomeSetup onComplete={handleSetupComplete} />;
}