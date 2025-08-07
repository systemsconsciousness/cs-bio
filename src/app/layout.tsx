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

export const metadata: Metadata = {
  title: "CS Bio - Full-Stack Developer",
  description: "Full-stack developer passionate about creating innovative web experiences with modern technologies.",
  keywords: ["developer", "portfolio", "full-stack", "React", "Next.js", "TypeScript"],
  authors: [{ name: "CS" }],
  openGraph: {
    title: "CS Bio - Full-Stack Developer",
    description: "Full-stack developer passionate about creating innovative web experiences with modern technologies.",
    type: "website",
  },
};

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
        <Footer />
      </body>
    </html>
  );
}
