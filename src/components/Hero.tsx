'use client';

import { ArrowDown, Download, Github, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { HomePageContent, SiteConfiguration } from '@/lib/contentstack';
import dynamic from 'next/dynamic';
import { useScrollOpacity } from '@/hooks/useScrollOpacity';
import { useSectionScroll } from '@/hooks/useSectionScroll';
import { useState, useEffect, useRef } from 'react';
import SparkleEffect from './SparkleEffect';

// Dynamically import MandalaBackground to avoid SSR issues
const MandalaBackground = dynamic(() => import('./MandalaBackground'), {
  ssr: false,
  loading: () => null
});

interface HeroProps {
  content: HomePageContent | null;
  siteConfig: SiteConfiguration | null;
}

const Hero = ({ content, siteConfig }: HeroProps) => {
  const mandalaOpacity = useScrollOpacity(800); // Longer fade distance for full screen
  const { scrollThroughSections, addInterruptListeners } = useSectionScroll();
  const [avatarScale, setAvatarScale] = useState(0.85); // Start smaller (85% of normal size)
  const avatarRef = useRef<HTMLDivElement>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const viewWorkRef = useRef<HTMLButtonElement>(null);
  const resumeRef = useRef<HTMLAnchorElement>(null);

  // Helper function to extract file URL from various Contentstack file field formats
  const getFileUrl = (fileField: SiteConfiguration['avatar_photo'] | SiteConfiguration['resume_cv']): string | null => {
    if (!fileField) return null;
    
    // If it's a string, check if it's a UID or full URL
    if (typeof fileField === 'string') {
      // If it starts with 'blt', it's a Contentstack asset UID - construct delivery URL
      if (fileField.startsWith('blt')) {
        // Construct the delivery URL using Contentstack's asset delivery pattern
        const stackApiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || 'bltf30bb27542f99789'; // fallback from logs
        const cdnHost = 'images.contentstack.io';
        return `https://${cdnHost}/v3/assets/${stackApiKey}/${fileField}/download`;
      }
      // Otherwise assume it's already a full URL
      return fileField;
    }
    
    // If it's an array, get the first file
    if (Array.isArray(fileField) && fileField.length > 0) {
      return fileField[0].url || null;
    }
    
    // If it's an object with url property
    if (typeof fileField === 'object' && 'url' in fileField) {
      return fileField.url || null;
    }
    
    return null;
  };

  const avatarUrl = getFileUrl(siteConfig?.avatar_photo);
  const resumeUrl = getFileUrl(siteConfig?.resume_cv);

  // Mouse proximity effect for avatar
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!avatarRef.current) return;

      const avatarRect = avatarRef.current.getBoundingClientRect();
      const avatarCenterX = avatarRect.left + avatarRect.width / 2;
      const avatarCenterY = avatarRect.top + avatarRect.height / 2;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Calculate distance from mouse to avatar center
      const distance = Math.sqrt(
        Math.pow(mouseX - avatarCenterX, 2) + Math.pow(mouseY - avatarCenterY, 2)
      );

      // Define proximity thresholds
      const maxDistance = 250; // Max distance for effect (reduced)
      const minDistance = 80;  // Min distance for max scale (increased for gentler effect)

      if (distance <= maxDistance) {
        // Calculate scale based on inverse distance (closer = bigger) - much more subtle
        const proximityFactor = Math.max(0, 1 - (distance - minDistance) / (maxDistance - minDistance));
        const scale = 0.92 + (proximityFactor * 0.12); // Scale from 0.92 to 1.04 (much smaller range)
        setAvatarScale(Math.min(scale, 1.04));
      } else {
        setAvatarScale(0.92); // Default size closer to normal
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleViewMyWork = () => {
    // Set up interrupt listeners and start scrolling immediately
    const removeListeners = addInterruptListeners();
    scrollThroughSections();
    
    // Clean up listeners after scrolling completes (or is interrupted)
    setTimeout(() => {
      removeListeners();
    }, 15000); // Clean up after 15 seconds max
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Mandala Background - Full Screen (conditionally rendered) */}
      {(siteConfig?.enable_mandala_background !== false) && (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <MandalaBackground opacity={mandalaOpacity} />
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8">
          {/* Profile Image */}
          <div 
            ref={avatarRef}
            className="relative inline-block"
            style={{ 
              transform: `scale(${avatarScale})`,
              transition: 'transform 0.8s ease-out'
            }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={siteConfig?.owner_name || 'Profile'}
                width={200}
                height={200}
                className="w-50 h-50 rounded-full mx-auto mb-8 object-cover border-8 border-accent/20"
                unoptimized={true}
              />
            ) : (
              <div className="w-50 h-50 bg-gradient-to-br from-accent to-accent/70 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-accent-foreground text-6xl font-bold">
                  {siteConfig?.owner_name?.charAt(0) || content?.title?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>

          {/* Hero Text */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="block text-foreground">
                {siteConfig?.owner_name || content?.hero_headline || 'Your Name'}
              </span>
              <span className="block gradient-text-2 pb-2">
                {siteConfig?.site_subtitle || content?.hero_headline || 'Creator & Developer'}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              {siteConfig?.bio || content?.hero_subtext || 'Welcome to my digital space where I share my work and journey.'}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto ${!resumeUrl ? 'sm:max-w-xs' : ''}`}>
            <button
              ref={viewWorkRef}
              onClick={handleViewMyWork}
              onMouseEnter={() => setHoveredButton('viewWork')}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 gradient-1 text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden"
            >
              <SparkleEffect 
                isHovered={hoveredButton === 'viewWork'}
                containerRef={viewWorkRef}
                intensity={1.2}
                color="#ffffff"
              />
              <span className="relative z-10">
                View My Work
                <ArrowDown className="ml-2 w-4 sm:w-5 h-4 sm:h-5 inline" />
              </span>
            </button>
            
            {resumeUrl && (
              <a
                ref={resumeRef}
                href={resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredButton('resume')}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-border rounded-full font-medium hover:bg-muted transition-all duration-300 relative overflow-hidden"
              >
                <SparkleEffect 
                  isHovered={hoveredButton === 'resume'}
                  containerRef={resumeRef}
                  intensity={0.8}
                  color="#7c4dff"
                />
                <span className="relative z-10">
                  <Download className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                  Download CV
                </span>
              </a>
            )}
          </div>

          {/* Skills Tags */}
          {content?.skills && content.skills.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {content.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {(siteConfig?.github_url || siteConfig?.linkedin_url) && (
            <div className="flex gap-4 justify-center">
              {siteConfig?.github_url && (
                <a
                  href={siteConfig.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-muted/50 hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {siteConfig?.linkedin_url && (
                <a
                  href={siteConfig.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-muted/50 hover:bg-accent hover:text-accent-foreground rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;