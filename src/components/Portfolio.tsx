'use client';

import { ExternalLink, Github, Star, Link } from 'lucide-react';
import Image from 'next/image';
import { PortfolioProject, SiteConfiguration } from '@/lib/contentstack';
import { useState, useRef } from 'react';
import SparkleEffect from './SparkleEffect';

interface PortfolioProps {
  projects: PortfolioProject[];
  siteConfig?: SiteConfiguration | null;
}

const Portfolio = ({ projects, siteConfig }: PortfolioProps) => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  // Create refs for each project outside the render loop
  const projectRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  
  // Initialize refs for all projects
  projects.forEach(project => {
    if (!projectRefs.current[project.uid]) {
      projectRefs.current[project.uid] = useRef<HTMLDivElement>(null);
    }
  });
  
  // Helper function to extract file URL from various Contentstack file field formats
  const getFileUrl = (fileField: PortfolioProject['featured_image']): string | null => {
    if (!fileField) return null;
    
    // If it's a string, check if it's a UID or full URL
    if (typeof fileField === 'string') {
      // If it starts with 'blt', it's a Contentstack asset UID - construct delivery URL
      if (fileField.startsWith('blt')) {
        // Construct the delivery URL using Contentstack's asset delivery pattern
        const stackApiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || 'bltf30bb27542f99789';
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

  return (
    <section id="portfolio" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold gradient-text-1 uppercase tracking-wide mb-2">
            Portfolio
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Projects
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and side projects that I&apos;m passionate about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => {
            const featuredImageUrl = getFileUrl(project.featured_image);
            const projectRef = projectRefs.current[project.uid];
            
            return (
              <div
                key={project.uid}
                ref={projectRef}
                className="group bg-background rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
                onMouseEnter={() => setHoveredProject(project.uid)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <SparkleEffect 
                  isHovered={hoveredProject === project.uid}
                  containerRef={projectRef}
                  intensity={0.8}
                  color="#7c4dff"
                />
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden">
                  {featuredImageUrl ? (
                    <Image
                      src={featuredImageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-6xl font-bold text-accent/30">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground p-2 rounded-full">
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>

              {/* Project Content */}
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Title and Type */}
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                      {project.title}
                    </h4>
                    {project.project_type && (
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {project.project_type}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-border mt-4 sm:mt-6">
                  {project.project_link && (
                    <a
                      href={project.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 gradient-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Link className="w-4 h-4 mr-1" />
                      View Project
                    </a>
                  )}
                  {project.github_repository_link && (
                    <a
                      href={project.github_repository_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </a>
                  )}
                  {/* Fallback to old fields if new ones aren't available */}
                  {!project.project_link && project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 gradient-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live Demo
                    </a>
                  )}
                  {!project.github_repository_link && project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Portfolio projects will be displayed here once added to Contentstack.
            </p>
          </div>
        )}

        {/* Call to Action - Only show if GitHub URL is configured */}
        {siteConfig?.github_url && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Interested in seeing more of my work?
            </p>
            <a
              href={siteConfig.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              <Github className="w-5 h-5 mr-2" />
              View All Projects on GitHub
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;