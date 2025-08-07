import { ArrowDown, Download } from 'lucide-react';
import Image from 'next/image';
import { HomePageContent, SiteConfiguration } from '@/lib/contentstack';

interface HeroProps {
  content: HomePageContent | null;
  siteConfig: SiteConfiguration | null;
}

const Hero = ({ content, siteConfig }: HeroProps) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Profile Image */}
          <div className="relative inline-block">
            {siteConfig?.avatar_photo?.url ? (
              <Image
                src={siteConfig.avatar_photo.url}
                alt={siteConfig.avatar_photo.title || siteConfig.owner_name || 'Profile'}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full mx-auto mb-8 object-cover border-4 border-accent/20"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-accent to-accent/70 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-accent-foreground text-4xl font-bold">
                  {siteConfig?.owner_name?.charAt(0) || content?.title?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>

          {/* Hero Text */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-foreground">
                {siteConfig?.owner_name || content?.hero_headline || 'Your Name'}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
                {siteConfig?.site_subtitle || content?.hero_headline || 'Creator & Developer'}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              {siteConfig?.bio || content?.hero_subtext || 'Welcome to my digital space where I share my work and journey.'}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
            <a
              href="#portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-all duration-300 transform hover:scale-105"
            >
              View My Work
              <ArrowDown className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
            </a>
            
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-border rounded-full font-medium hover:bg-muted transition-all duration-300">
              <Download className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
              Download CV
            </button>
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
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;