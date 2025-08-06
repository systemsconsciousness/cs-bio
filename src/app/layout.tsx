import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdminLink from "@/components/AdminLink";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
        <AdminLink />
      </body>
    </html>
  );
}
