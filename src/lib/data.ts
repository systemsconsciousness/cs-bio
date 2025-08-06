// Simple data service for static content
import { 
  homePageContent, 
  blogPosts, 
  workExperiences, 
  portfolioProjects,
  type HomePageContent,
  type BlogPost,
  type WorkExperience,
  type PortfolioProject
} from '@/data/content';

// Simulate async operations (you can remove the delays if you want)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getHomePageContent = async (): Promise<HomePageContent | null> => {
  await delay(100); // Simulate API call
  return homePageContent;
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  await delay(100);
  return blogPosts.sort((a, b) => 
    new Date(b.published_date || b.created_at).getTime() - 
    new Date(a.published_date || a.created_at).getTime()
  );
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  await delay(100);
  return blogPosts.find(post => post.slug === slug) || null;
};

export const getWorkExperiences = async (): Promise<WorkExperience[]> => {
  await delay(100);
  return workExperiences.sort((a, b) => 
    new Date(b.start_date || b.created_at).getTime() - 
    new Date(a.start_date || a.created_at).getTime()
  );
};

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  await delay(100);
  return portfolioProjects.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const getFeaturedProjects = async (): Promise<PortfolioProject[]> => {
  await delay(100);
  return portfolioProjects
    .filter(project => project.featured)
    .sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
};

// Export types for convenience
export type { HomePageContent, BlogPost, WorkExperience, PortfolioProject };