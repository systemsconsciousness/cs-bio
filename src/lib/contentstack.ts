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
  setup_completed: boolean;
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
    await ensureSetup();
    const query = stack.ContentType('site_configuration').Query();
    query.descending('created_at');
    const result = await query.toJSON().find();
    return result[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching site configuration:', error);
    return null;
  }
};

export const updateSiteConfiguration = async (data: Partial<SiteConfiguration>): Promise<boolean> => {
  try {
    await ensureSetup();
    
    // First get the existing entry
    const query = stack.ContentType('site_configuration').Query();
    const result = await query.toJSON().find();
    const existingEntry = result[0]?.[0];
    
    if (!existingEntry) {
      console.error('No site configuration found to update');
      return false;
    }

    // Update the entry using Contentstack Management API
    const MGMT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
    const API_KEY = process.env.CONTENTSTACK_API_KEY;
    const API_HOST = process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io';
    
    if (!MGMT_TOKEN || !API_KEY) {
      console.error('Missing management token or API key for updating configuration');
      return false;
    }

    const response = await fetch(
      `https://${API_HOST}/v3/content_types/site_configuration/entries/${existingEntry.uid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MGMT_TOKEN,
        },
        body: JSON.stringify({
          entry: {
            ...existingEntry,
            ...data,
            setup_completed: true
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Failed to update site configuration:', await response.text());
      return false;
    }

    console.log('✅ Site configuration updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating site configuration:', error);
    return false;
  }
};

export const getHomePageContent = async (): Promise<HomePageContent | null> => {
  try {
    await ensureSetup();
    const query = stack.ContentType('home_page').Query();
    const result = await query.toJSON().find();
    return result[0]?.[0] || null;
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