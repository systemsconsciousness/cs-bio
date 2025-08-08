import Contentstack from 'contentstack';
import { ensureContentTypesExist, checkContentTypesExist } from './contentstack-setup';

// Initialize Contentstack SDK with your specific env vars
const stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY!,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'production',
});

// Flag to track if setup has been attempted
let setupAttempted = false;

// Type definitions for our content types
export interface SiteConfiguration {
  title: string;
  site_name: string;
  site_subtitle: string;
  owner_name: string;
  owner_email: string;
  bio: string;
  avatar_photo?: {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  } | {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  }[] | string;
  resume_cv?: {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  } | {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  }[] | string;
  years_experience?: number;
  work_location?: string;
  projects_completed?: number;
  technologies_count?: number;
  time_zone?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface HomePageContent {
  title: string;
  hero_headline: string;
  hero_subtext?: string;
  about_section?: string;
  skills?: string[];
  contact_email?: string;
}

export interface BlogPost {
  uid: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  published_date?: string;
  blog_tags?: string[];
  featured_image?: {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  } | {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  }[] | string;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  uid: string;
  title: string;
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  current_position?: boolean;
  description?: string;
  technologies?: string[];
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  uid: string;
  title: string;
  slug: string;
  description?: string;
  technologies?: string[];
  live_url?: string;
  github_url?: string;
  project_type?: string;
  featured?: boolean;
  featured_image?: {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  } | {
    url: string;
    title?: string;
    filename?: string;
    uid?: string;
  }[] | string;
  created_at: string;
  updated_at: string;
}

// Ensure content types exist before making queries
async function ensureSetup() {
  if (setupAttempted) return;
  setupAttempted = true;
  
  const contentTypesExist = await checkContentTypesExist();
  if (!contentTypesExist) {
    console.log('🔧 Content types not found, setting up Contentstack...');
    await ensureContentTypesExist();
  }
}

// API functions
export const getSiteConfiguration = async (): Promise<SiteConfiguration | null> => {
  try {
    // Check if content types exist first
    const contentTypesExist = await checkContentTypesExist();
    
    if (!contentTypesExist) {
      await ensureSetup();
      // After setup, no site configuration entry exists yet
      return null;
    }
    
    // Try both delivery API (via SDK) and management API approaches
    let siteConfig = null;
    
    // First try with the SDK (delivery API)
    try {
      const query = stack.ContentType('site_configuration').Query();
      query.descending('updated_at');
      query.addParam('timestamp', Date.now().toString());
      const result = await query.toJSON().find();
      
      // Handle various possible data structures from Contentstack SDK
      if (Array.isArray(result) && result.length > 0) {
        if (Array.isArray(result[0])) {
          // Nested array structure: [[entry]]
          if (result[0].length > 0 && result[0][0] && typeof result[0][0] === 'object' && Object.keys(result[0][0]).length > 0) {
            siteConfig = result[0][0];
          }
        } else if (result[0] && typeof result[0] === 'object' && Object.keys(result[0]).length > 0) {
          // Direct array structure: [entry]
          siteConfig = result[0];
        }
      } else if (result && result.entries && result.entries.length > 0) {
        // Object with entries property: {entries: [entry]}
        if (result.entries[0] && typeof result.entries[0] === 'object' && Object.keys(result.entries[0]).length > 0) {
          siteConfig = result.entries[0];
        }
      }
    } catch {
      console.log('SDK query failed, trying management API fallback');
    }
    
    // If SDK failed, try Management API as fallback
    if (!siteConfig) {
      try {
        const managementApiUrl = `https://${process.env.CONTENTSTACK_API_HOST}/v3/content_types/site_configuration/entries`;
        const response = await fetch(managementApiUrl, {
          headers: {
            'api_key': process.env.CONTENTSTACK_API_KEY!,
            'authorization': process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.entries && data.entries.length > 0) {
            siteConfig = data.entries[0];
          }
        }
      } catch (managementError) {
        console.error('Management API error:', managementError);
      }
    }
    
    return siteConfig;
  } catch (error) {
    console.error('Error fetching site configuration:', error);
    return null;
  }
};



export const getHomePageContent = async (): Promise<HomePageContent | null> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('home_page').Query();
    query.addParam('timestamp', Date.now().toString());
    const result = await query.toJSON().find();
    return result[0]?.[0] || result[0] || null;
  } catch (error) {
    console.error('Error fetching home page content:', error);
    return null;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('blog_post').Query();
    query.descending('published_date');
    query.addParam('timestamp', Date.now().toString());
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('blog_post').Query();
    query.where('slug', slug);
    const result = await query.toJSON().find();
    return result[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

export const getWorkExperiences = async (): Promise<WorkExperience[]> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('work_experience').Query();
    query.descending('start_date');
    query.addParam('timestamp', Date.now().toString());
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching work experiences:', error);
    return [];
  }
};

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('portfolio_project').Query();
    query.descending('created_at');
    query.addParam('timestamp', Date.now().toString());
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return [];
  }
};

export const getFeaturedProjects = async (): Promise<PortfolioProject[]> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('portfolio_project').Query();
    query.where('featured', true);
    query.descending('created_at');
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
};