import { Metadata } from 'next';
import { getSiteConfiguration } from './contentstack';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfiguration();
  
  const siteName = siteConfig?.site_name || 'My Personal Site';
  const ownerName = siteConfig?.owner_name || 'Your Name';
  const siteSubtitle = siteConfig?.site_subtitle || 'Creator & Developer';
  const bio = siteConfig?.bio || 'Welcome to my digital space';
  
  return {
    title: `${siteName} - ${ownerName}`,
    description: bio,
    keywords: ["portfolio", "developer", "creator", "personal site"],
    authors: [{ name: ownerName }],
    openGraph: {
      title: `${siteName} - ${ownerName}`,
      description: bio,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${ownerName}`,
      description: bio,
    },
  };
}