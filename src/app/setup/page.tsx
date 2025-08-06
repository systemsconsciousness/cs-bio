'use client';

import { useRouter } from 'next/navigation';
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

  const handleSetupComplete = async (data: SetupFormData) => {
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Setup failed');
      }

      // Redirect to home page after successful setup
      router.push('/');
      router.refresh(); // Force refresh to reload the page with new data
    } catch (error) {
      console.error('Setup error:', error);
      // You could add error handling here (e.g., show toast notification)
    }
  };

  return <WelcomeSetup onComplete={handleSetupComplete} />;
}