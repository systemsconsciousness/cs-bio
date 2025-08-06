// scripts/init-contentstack.js
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

console.log("🚀 Starting Contentstack Bio Site Setup...");
console.log("✅ Loaded environment variables:");
console.log("CONTENTSTACK_API_KEY =", process.env.CONTENTSTACK_API_KEY);
console.log("CONTENTSTACK_MANAGEMENT_TOKEN =", process.env.CONTENTSTACK_MANAGEMENT_TOKEN ? 'Present' : 'Missing');
console.log("CONTENTSTACK_API_HOST =", process.env.CONTENTSTACK_API_HOST);

const API_KEY = process.env.CONTENTSTACK_API_KEY;
const MGMT_TOKEN = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
const API_HOST = process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io';
const BASE_URL = `https://${API_HOST}`;

const headers = {
  api_key: API_KEY,
  authorization: MGMT_TOKEN,
  'Content-Type': 'application/json',
};

// Validation
if (!API_KEY || !MGMT_TOKEN) {
  console.error("❌ Missing required environment variables. Please check your .env.local file.");
  process.exit(1);
}

// Helper function to handle API requests with better error reporting
async function makeRequest(method, url, data = null, description = "") {
  try {
    const config = { method, url, headers };
    if (data) config.data = data;
    
    const response = await axios(config);
    console.log(`✅ ${description}: ${response.data.content_type?.uid || response.data.entry?.uid || 'Success'}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 422 && error.response?.data?.errors?.title) {
      console.log(`⚠️  ${description}: Already exists, skipping...`);
      return null; // Not a real error, just already exists
    }
    console.error(`❌ Error ${description}:`, error.response?.data || error.message);
    throw error;
  }
}

// Content Type Schemas
const contentTypes = {
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
        uid: "tags",
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

// Sample Content Data
const sampleContent = {
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
      tags: ["CMS", "Architecture", "Web Development"]
    },
    {
      title: "Building Scalable React Applications",
      slug: "building-scalable-react-applications",
      excerpt: "Best practices and patterns for creating React applications that can grow with your business needs.",
      content: "Scalability in React applications isn't just about handling more users—it's about creating code that's maintainable...",
      author: "John Doe",
      published_date: "2024-01-10T14:30:00.000Z",
      tags: ["React", "JavaScript", "Scalability"]
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

// Create Content Types
async function createContentTypes() {
  console.log("\n📝 Creating content types...");
  
  for (const [key, contentType] of Object.entries(contentTypes)) {
    await makeRequest(
      'POST',
      `${BASE_URL}/v3/content_types`,
      { content_type: contentType },
      `Created content type: ${contentType.title}`
    );
  }
}

// Create Entries
async function createEntries() {
  console.log("\n📄 Creating sample content...");
  
  // Create Home Page
  await makeRequest(
    'POST',
    `${BASE_URL}/v3/content_types/home_page/entries`,
    { entry: sampleContent.home_page },
    `Created home page entry`
  );
  
  // Create Blog Posts
  for (const blogPost of sampleContent.blog_posts) {
    await makeRequest(
      'POST',
      `${BASE_URL}/v3/content_types/blog_post/entries`,
      { entry: blogPost },
      `Created blog post: ${blogPost.title}`
    );
  }
  
  // Create Work Experiences
  for (const work of sampleContent.work_experiences) {
    await makeRequest(
      'POST',
      `${BASE_URL}/v3/content_types/work_experience/entries`,
      { entry: work },
      `Created work experience: ${work.title}`
    );
  }
  
  // Create Portfolio Projects
  for (const project of sampleContent.portfolio_projects) {
    await makeRequest(
      'POST',
      `${BASE_URL}/v3/content_types/portfolio_project/entries`,
      { entry: project },
      `Created portfolio project: ${project.title}`
    );
  }
}

// Main execution function
async function run() {
  try {
    console.log("\n🎯 Setting up your Bio Site in Contentstack...");
    console.log("This will create content models and sample content for:");
    console.log("• Home Page");
    console.log("• Blog Posts");
    console.log("• Work Experience");
    console.log("• Portfolio Projects");
    
    await createContentTypes();
    await createEntries();
    
    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📋 Summary:");
    console.log("✅ 4 Content Types created");
    console.log("✅ 1 Home page created");
    console.log("✅ 2 Blog posts created");
    console.log("✅ 2 Work experiences created");
    console.log("✅ 2 Portfolio projects created");
    console.log("\n🚀 Your Contentstack Bio Site is ready!");
    console.log("💡 Next steps:");
    console.log("1. Log into your Contentstack dashboard to review the content");
    console.log("2. Publish the entries to make them available via the Delivery API");
    console.log("3. Set up your frontend to fetch and display this content");
    
  } catch (error) {
    console.error("\n💥 Setup failed:", error.message);
    process.exit(1);
  }
}

run();
