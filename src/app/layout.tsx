import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getSiteConfiguration } from "@/lib/contentstack";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let siteConfig = null;
  try {
    siteConfig = await getSiteConfiguration();
  } catch (error) {
    console.error('Error fetching site config for metadata:', error);
  }

  const siteName = siteConfig?.site_name || 'Personal Website';
  const siteSubtitle = siteConfig?.site_subtitle || 'Welcome to my digital space';
  const ownerName = siteConfig?.owner_name || 'Developer';
  const bio = siteConfig?.bio || 'Welcome to my personal website where I share my work, thoughts, and journey.';
  
  const title = siteSubtitle ? `${siteName} - ${siteSubtitle}` : siteName;

  return {
    title,
    description: bio,
    keywords: ["developer", "portfolio", "full-stack", "React", "Next.js", "TypeScript"],
    authors: [{ name: ownerName }],
    openGraph: {
      title,
      description: bio,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let siteConfig = null;
  try {
    siteConfig = await getSiteConfiguration();
  } catch (error) {
    console.error('Error fetching site config in layout:', error);
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="https://www.contentstack.com/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation siteName={siteConfig?.site_name} />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer siteConfig={siteConfig} />
      </body>
    </html>
  );
}
