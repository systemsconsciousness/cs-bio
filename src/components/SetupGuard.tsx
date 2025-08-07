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

  useEffect(() => {
    // Check if setup was recently completed (within last 30 seconds)
    const setupCompleted = localStorage.getItem('setup-completed');
    const now = Date.now();
    const recentlyCompleted = setupCompleted && (now - parseInt(setupCompleted)) < 30000;

    if (!siteConfigExists && !recentlyCompleted) {
      console.log('🔄 No site configuration found and not recently completed, redirecting to setup');
      router.push('/setup');
      return;
    }

    if (recentlyCompleted) {
      console.log('🔍 Setup recently completed, clearing flag and showing content');
      localStorage.removeItem('setup-completed');
    }

    console.log('✅ Site configuration exists or recently completed, showing home page');
    setIsChecking(false);
  }, [siteConfigExists, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}