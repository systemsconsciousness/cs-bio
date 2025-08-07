'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WelcomeSetup from '@/components/WelcomeSetup';

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
        
        console.log('🔍 Setup page - status response:', data);
        
        if (data.setupCompleted) {
          console.log('🔄 Setup already completed, redirecting to home');
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

    console.log('✅ Site configuration created successfully');
    
    // Set a flag to prevent redirect loops
    localStorage.setItem('setup-completed', Date.now().toString());

    // Wait longer for the data to propagate through Contentstack's CDN
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try to verify the entry exists before redirecting
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🔍 Verification attempt ${retryCount + 1}/${maxRetries}...`);
        
        const checkResponse = await fetch(`/api/setup/status?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!checkResponse.ok) {
          console.error('❌ Status check failed:', checkResponse.status, checkResponse.statusText);
          break;
        }
        
        const checkData = await checkResponse.json();
        console.log('🔍 Status check response:', checkData);
        
        if (checkData.setupCompleted) {
          console.log('✅ Setup verified, redirecting...');
          break;
        }
        
        console.log(`⏳ Setup not yet detected (setupCompleted: ${checkData.setupCompleted}), retry ${retryCount + 1}/${maxRetries}`);
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`⏳ Waiting 2 seconds before next retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error('❌ Error verifying setup:', error);
        break;
      }
    }
    
    if (retryCount >= maxRetries) {
      console.warn('⚠️ Max retries reached, redirecting anyway. Setup may still be propagating.');
    }
    
    // Force a hard navigation to ensure the page reloads completely
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