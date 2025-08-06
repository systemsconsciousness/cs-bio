import Contentstack from 'contentstack';

// Initialize Contentstack SDK
const stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'development',
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us',
});

// Type definitions for our content types
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

// API functions
export const getHomePageContent = async (): Promise<HomePageContent | null> => {
  try {
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
    const query = stack.ContentType('blog_post').Query();
    query.orderByDescending('published_date');
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
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
    const query = stack.ContentType('work_experience').Query();
    query.orderByDescending('start_date');
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching work experiences:', error);
    return [];
  }
};

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const query = stack.ContentType('portfolio_project').Query();
    query.orderByDescending('created_at');
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return [];
  }
};

export const getFeaturedProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const query = stack.ContentType('portfolio_project').Query();
    query.where('featured', true);
    query.orderByDescending('created_at');
    const result = await query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
};