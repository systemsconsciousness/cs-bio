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
    
    // Try both delivery API (via SDK) and management API approaches
    let siteConfig = null;
    
    // First try with the SDK (delivery API)
    try {
      const query = stack.ContentType('site_configuration').Query();
      query.descending('updated_at');
      const result = await query.toJSON().find();
      
          console.log('🔍 SDK query result structure:', Array.isArray(result) ? 'array' : typeof result, 'length:', result?.length || result?.entries?.length || 0);
    
    // Check various possible data structures
    console.log('🔍 SDK result structure analysis:', {
      isArray: Array.isArray(result),
      length: result?.length,
      firstItemType: result?.[0] ? typeof result[0] : 'none',
      firstItemIsArray: Array.isArray(result?.[0]),
      hasEntries: !!result?.entries,
      entriesLength: result?.entries?.length
    });
    
    if (Array.isArray(result) && result.length > 0) {
      if (Array.isArray(result[0]) && result[0].length > 0) {
        siteConfig = result[0][0]; // Nested array structure: [[entry]]
        console.log('🔍 Using nested array structure');
      } else if (result[0] && typeof result[0] === 'object') {
        siteConfig = result[0]; // Direct array structure: [entry]
        console.log('🔍 Using direct array structure');
      }
    } else if (result && result.entries && result.entries.length > 0) {
      siteConfig = result.entries[0]; // Object with entries property: {entries: [entry]}
      console.log('🔍 Using entries property structure');
    }
    
    console.log('🔍 SDK extracted config exists:', !!siteConfig);
    } catch (sdkError) {
      console.log('🔍 SDK query failed, trying management API:', sdkError);
    }
    
    // Log if SDK extraction failed but still attempt the result
    if (!siteConfig) {
      console.log('🔍 SDK query did not return site configuration, setup not completed');
    }
    
    console.log('🔍 Final site config exists:', !!siteConfig);
    
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