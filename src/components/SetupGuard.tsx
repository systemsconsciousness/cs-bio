'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SetupGuardProps {
  children: React.ReactNode;
  siteConfigExists: boolean;
}

export default function SetupGuard({ children, siteConfigExists }: SetupGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkSetup = async () => {
      console.log('🔍 SetupGuard checking:', { siteConfigExists, retryCount });
      
      if (!siteConfigExists) {
        // If no config after multiple checks, redirect to setup
        if (retryCount > 2) {
          console.log('🔄 No site configuration found after retries, redirecting to setup');
          router.push('/setup');
          return;
        }
        
        // Try to refresh the status from the API
        try {
          const response = await fetch(`/api/setup/status?t=${Date.now()}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('🔍 API setup status:', data);
            
            if (data.setupCompleted) {
              console.log('✅ Setup completed according to API, showing content');
              setIsChecking(false);
              return;
            }
          }
        } catch (error) {
          console.error('❌ Error checking setup status:', error);
        }
        
        // Retry after a short delay
        setRetryCount(prev => prev + 1);
        setTimeout(() => checkSetup(), 1000);
        return;
      }

      console.log('✅ Site configuration exists, showing home page');
      setIsChecking(false);
    };

    checkSetup();
  }, [siteConfigExists, router, retryCount]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {retryCount > 0 ? `Checking setup status... (${retryCount}/3)` : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}