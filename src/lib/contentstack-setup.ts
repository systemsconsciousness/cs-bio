// Automatic Contentstack setup that runs during build or first request
import axios from 'axios';

const API_KEY = process.env.CONTENTSTACK_API_KEY;
const MGMT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
const API_HOST = process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io';
const BASE_URL = `https://${API_HOST}`;

const headers = {
  api_key: API_KEY!,
  authorization: MGMT_TOKEN!,
  'Content-Type': 'application/json',
};

// Helper function to handle API requests
async function makeRequest(method: string, url: string, data: unknown = null) {
  try {
    const config: { method: string; url: string; headers: typeof headers; data?: unknown } = { method, url, headers };
    if (data) config.data = data;
    
    const response = await axios(config);
    return response.data;
  } catch (error: unknown) {
    // If content type already exists, that's fine
    const axiosError = error as { response?: { status?: number; data?: { errors?: { title?: unknown } } } };
    if (axiosError.response?.status === 422 && axiosError.response?.data?.errors?.title) {
      return null; // Already exists
    }
    console.error('Contentstack setup error:', axiosError.response?.data || (error as Error).message);
    throw error;
  }
}

// Content Type Schemas (same as before but with corrected field names)
const contentTypes = {
  site_configuration: {
    title: "Site Configuration",
    uid: "site_configuration",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        field_metadata: { _default: true, mandatory: true },
        unique: false
      },
      {
        display_name: "Site Name",
        uid: "site_name",
        data_type: "text",
        field_metadata: {
          description: "The name of your personal website",
          mandatory: true
        },
        unique: false
      },
      {
        display_name: "Site Subtitle",
        uid: "site_subtitle",
        data_type: "text",
        field_metadata: {
          description: "A short description or tagline for your site"
        },
        unique: false
      },
      {
        display_name: "Owner Name",
        uid: "owner_name",
        data_type: "text",
        field_metadata: {
          description: "Your full name",
          mandatory: true
        },
        unique: false
      },
      {
        display_name: "Owner Email",
        uid: "owner_email",
        data_type: "text",
        field_metadata: {
          description: "Your contact email address"
        },
        unique: false
      },
      {
        display_name: "Bio",
        uid: "bio",
        data_type: "text",
        field_metadata: {
          description: "A short bio about yourself",
          multiline: true
        },
        unique: false
      },
      {
        display_name: "Avatar Photo",
        uid: "avatar_photo",
        data_type: "file",
        field_metadata: {
          description: "Upload a profile photo (optional)",
          rich_text_type: "standard"
        },
        unique: false
      }
    ]
  },
  home: {
    title: "Home Page",
    uid: "home_page",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        field_metadata: { _default: true, mandatory: true },
        unique: false
      },
      {
        display_name: "Hero Headline",
        uid: "hero_headline",
        data_type: "text",
        field_metadata: { mandatory: true }
      },
      {
        display_name: "Hero Subtext",
        uid: "hero_subtext",
        data_type: "text"
      },
      {
        display_name: "About Section",
        uid: "about_section",
        data_type: "text",
        field_metadata: { multiline: true }
      },
      {
        display_name: "Skills",
        uid: "skills",
        data_type: "text",
        multiple: true
      },
      {
        display_name: "Contact Email",
        uid: "contact_email",
        data_type: "text"
      }
    ]
  },
  
  blog: {
    title: "Blog Post",
    uid: "blog_post",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        field_metadata: { _default: true, mandatory: true },
        unique: false
      },
      {
        display_name: "Slug",
        uid: "slug",
        data_type: "text",
        field_metadata: { mandatory: true },
        unique: true
      },
      {
        display_name: "Excerpt",
        uid: "excerpt",
        data_type: "text",
        field_metadata: { multiline: true }
      },
      {
        display_name: "Content",
        uid: "content",
        data_type: "text",
        field_metadata: { multiline: true }
      },
      {
        display_name: "Author",
        uid: "author",
        data_type: "text"
      },
      {
        display_name: "Published Date",
        uid: "published_date",
        data_type: "isodate"
      },
      {
        display_name: "Tags",
        uid: "blog_tags", // Fixed: was "tags" which is restricted
        data_type: "text",
        multiple: true
      }
    ]
  },
  
  work: {
    title: "Work Experience",
    uid: "work_experience",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        field_metadata: { _default: true, mandatory: true },
        unique: false
      },
      {
        display_name: "Company",
        uid: "company",
        data_type: "text",
        field_metadata: { mandatory: true }
      },
      {
        display_name: "Position",
        uid: "position",
        data_type: "text",
        field_metadata: { mandatory: true }
      },
      {
        display_name: "Start Date",
        uid: "start_date",
        data_type: "isodate"
      },
      {
        display_name: "End Date",
        uid: "end_date",
        data_type: "isodate"
      },
      {
        display_name: "Current Position",
        uid: "current_position",
        data_type: "boolean"
      },
      {
        display_name: "Description",
        uid: "description",
        data_type: "text",
        field_metadata: { multiline: true }
      },
      {
        display_name: "Technologies",
        uid: "technologies",
        data_type: "text",
        multiple: true
      }
    ]
  },
  
  portfolio: {
    title: "Portfolio Project",
    uid: "portfolio_project",
    schema: [
      {
        display_name: "Title",
        uid: "title",
        data_type: "text",
        field_metadata: { _default: true, mandatory: true },
        unique: false
      },
      {
        display_name: "Slug",
        uid: "slug",
        data_type: "text",
        field_metadata: { mandatory: true },
        unique: true
      },
      {
        display_name: "Description",
        uid: "description",
        data_type: "text",
        field_metadata: { multiline: true }
      },
      {
        display_name: "Technologies",
        uid: "technologies",
        data_type: "text",
        multiple: true
      },
      {
        display_name: "Live URL",
        uid: "live_url",
        data_type: "text"
      },
      {
        display_name: "GitHub URL",
        uid: "github_url",
        data_type: "text"
      },
      {
        display_name: "Project Type",
        uid: "project_type",
        data_type: "text"
      },
      {
        display_name: "Featured",
        uid: "featured",
        data_type: "boolean"
      }
    ]
  }
};

// Sample content data
const sampleContent = {
  site_configuration: {
    title: "Site Configuration",
    site_name: "My Personal Site",
    site_subtitle: "Welcome to my digital space",
    owner_name: "Your Name",
    owner_email: "hello@example.com", 
    bio: "I'm a passionate creator building amazing things. Welcome to my personal website where I share my work, thoughts, and journey."
  },
  home_page: {
    title: "Welcome to My Bio Site",
    hero_headline: "Full-Stack Developer & Digital Creator",
    hero_subtext: "Building amazing web experiences with modern technologies",
    about_section: "I'm a passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I love creating innovative solutions that make a real impact.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    contact_email: "hello@example.com"
  },
  
  blog_posts: [
    {
      title: "Getting Started with Headless CMS",
      slug: "getting-started-headless-cms",
      excerpt: "Learn how headless CMS architecture can revolutionize your content management strategy.",
      content: "In today's fast-paced digital world, traditional monolithic CMS platforms are being challenged by a new approach: headless CMS...",
      author: "John Doe",
      published_date: "2024-01-15T10:00:00.000Z",
      blog_tags: ["CMS", "Architecture", "Web Development"]
    },
    {
      title: "Building Scalable React Applications",
      slug: "building-scalable-react-applications",
      excerpt: "Best practices and patterns for creating React applications that can grow with your business needs.",
      content: "Scalability in React applications isn't just about handling more users—it's about creating code that's maintainable...",
      author: "John Doe",
      published_date: "2024-01-10T14:30:00.000Z",
      blog_tags: ["React", "JavaScript", "Scalability"]
    }
  ],
  
  work_experiences: [
    {
      title: "Senior Full-Stack Developer at TechCorp",
      company: "TechCorp Solutions",
      position: "Senior Full-Stack Developer",
      start_date: "2022-03-01T00:00:00.000Z",
      current_position: true,
      description: "Leading the development of scalable web applications using React, Node.js, and AWS.",
      technologies: ["React", "Node.js", "AWS", "PostgreSQL"]
    },
    {
      title: "Frontend Developer at StartupXYZ",
      company: "StartupXYZ",
      position: "Frontend Developer",
      start_date: "2020-06-01T00:00:00.000Z",
      end_date: "2022-02-28T00:00:00.000Z",
      current_position: false,
      description: "Built responsive web applications and improved user experience across multiple products.",
      technologies: ["Vue.js", "Express.js", "MongoDB"]
    }
  ],
  
  portfolio_projects: [
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      description: "A full-featured e-commerce platform built with Next.js and Stripe integration.",
      technologies: ["Next.js", "React", "Stripe", "PostgreSQL"],
      live_url: "https://ecommerce-demo.example.com",
      github_url: "https://github.com/johndoe/ecommerce-platform",
      project_type: "Web Application",
      featured: true
    },
    {
      title: "Task Management App",
      slug: "task-management-app",
      description: "A collaborative task management application with real-time updates.",
      technologies: ["React", "Socket.io", "Express.js", "MongoDB"],
      live_url: "https://taskapp-demo.example.com",
      github_url: "https://github.com/johndoe/task-management",
      project_type: "Web Application",
      featured: true
    }
  ]
};

// Main setup function
export async function ensureContentTypesExist(): Promise<boolean> {
  if (!API_KEY || !MGMT_TOKEN) {
    console.error('Missing Contentstack credentials');
    return false;
  }

  try {
    console.log('🚀 Setting up Contentstack content types...');
    
    // Create content types
    for (const [, contentType] of Object.entries(contentTypes)) {
      await makeRequest(
        'POST',
        `${BASE_URL}/v3/content_types`,
        { content_type: contentType }
      );
      console.log(`✅ Content type: ${contentType.title}`);
    }

    // Create sample content
    await createSampleContent();
    
    console.log('🎉 Contentstack setup completed!');
    return true;
  } catch (error) {
    console.error('❌ Contentstack setup failed:', error);
    return false;
  }
}

async function createSampleContent() {
  // Skip creating Site Configuration entry - user will create it via setup form
  
  const ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || 'production';
  const createdEntries: { uid: string; content_type: string }[] = [];
  
  // Helper function to check if content already exists
  const checkContentExists = async (contentType: string, slug?: string) => {
    try {
      let query = '';
      if (slug) {
        query = `?query={"slug":"${slug}"}`;
      }
      const response = await makeRequest(
        'GET',
        `${BASE_URL}/v3/content_types/${contentType}/entries${query}`
      );
      return response?.entries && response.entries.length > 0;
    } catch {
      return false;
    }
  };
  
  // Create Home Page (check if exists first)
  const homeExists = await checkContentExists('home_page');
  if (!homeExists) {
    const homePageResult = await makeRequest(
      'POST',
      `${BASE_URL}/v3/content_types/home_page/entries`,
      { entry: sampleContent.home_page }
    );
    if (homePageResult?.entry?.uid) {
      createdEntries.push({ uid: homePageResult.entry.uid, content_type: 'home_page' });
    }
    // Add delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Create Blog Posts (check each slug)
  for (const blogPost of sampleContent.blog_posts) {
    const exists = await checkContentExists('blog_post', blogPost.slug);
    if (!exists) {
      const result = await makeRequest(
        'POST',
        `${BASE_URL}/v3/content_types/blog_post/entries`,
        { entry: blogPost }
      );
      if (result?.entry?.uid) {
        createdEntries.push({ uid: result.entry.uid, content_type: 'blog_post' });
      }
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Create Work Experiences (check each title for uniqueness)
  for (const work of sampleContent.work_experiences) {
    const exists = await checkContentExists('work_experience', work.company || work.position);
    if (!exists) {
      const result = await makeRequest(
        'POST',
        `${BASE_URL}/v3/content_types/work_experience/entries`,
        { entry: work }
      );
      if (result?.entry?.uid) {
        createdEntries.push({ uid: result.entry.uid, content_type: 'work_experience' });
      }
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Create Portfolio Projects (check each slug for uniqueness)
  for (const project of sampleContent.portfolio_projects) {
    const exists = await checkContentExists('portfolio_project', project.slug);
    if (!exists) {
      const result = await makeRequest(
        'POST',
        `${BASE_URL}/v3/content_types/portfolio_project/entries`,
        { entry: project }
      );
      if (result?.entry?.uid) {
        createdEntries.push({ uid: result.entry.uid, content_type: 'portfolio_project' });
      }
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('📝 Sample content created');

  // Publish all created entries sequentially with delays to avoid rate limiting
  console.log(`📤 Publishing ${createdEntries.length} entries...`);
  
  for (let i = 0; i < createdEntries.length; i++) {
    const entry = createdEntries[i];
    try {
      const publishData = {
        entry: {
          environments: [ENVIRONMENT],
          locales: ['en-us']
        }
      };

      await makeRequest(
        'POST',
        `${BASE_URL}/v3/content_types/${entry.content_type}/entries/${entry.uid}/publish`,
        publishData
      );
      
      console.log(`✅ Published ${entry.content_type} entry (${i + 1}/${createdEntries.length})`);
      
      // Add a delay between publish operations to avoid rate limiting
      if (i < createdEntries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (publishError) {
      console.warn(`⚠️ Failed to publish ${entry.content_type} entry:`, publishError);
      // Continue with next entry even if one fails
    }
  }
  
  console.log('🎉 All entries processed for publishing');
}

// Check if content types exist
export async function checkContentTypesExist(): Promise<boolean> {
  if (!API_KEY) {
    return false;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/v3/content_types`, { headers });
    const contentTypeUids = response.data.content_types?.map((ct: { uid: string }) => ct.uid) || [];
    
    const requiredTypes = ['site_configuration', 'home_page', 'blog_post', 'work_experience', 'portfolio_project'];
    const allExist = requiredTypes.every(type => contentTypeUids.includes(type));
    
    return allExist;
  } catch (error) {
    console.error('Error checking content types:', error);
    return false;
  }
}