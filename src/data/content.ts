// Static content data for the portfolio site

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
  project_link?: string;
  github_repository_link?: string;
  project_type?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Static data
export const homePageContent: HomePageContent = {
  title: "Welcome to My Bio Site",
  hero_headline: "Full-Stack Developer & Digital Creator",
  hero_subtext: "Building amazing web experiences with modern technologies",
  about_section: "I'm a passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I love creating innovative solutions that make a real impact.",
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS", "Next.js", "Tailwind CSS"],
  contact_email: "hello@example.com"
};

export const blogPosts: BlogPost[] = [
  {
    uid: "getting-started-headless-cms",
    title: "Getting Started with Headless CMS",
    slug: "getting-started-headless-cms",
    excerpt: "Learn how headless CMS architecture can revolutionize your content management strategy.",
    content: "In today's fast-paced digital world, traditional monolithic CMS platforms are being challenged by a new approach: headless CMS. This architecture separates the content management backend from the presentation layer, offering unprecedented flexibility and performance benefits.",
    author: "CS",
    published_date: "2024-01-15T10:00:00.000Z",
    blog_tags: ["CMS", "Architecture", "Web Development"],
    created_at: "2024-01-15T10:00:00.000Z",
    updated_at: "2024-01-15T10:00:00.000Z"
  },
  {
    uid: "building-scalable-react-applications",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt: "Best practices and patterns for creating React applications that can grow with your business needs.",
    content: "Scalability in React applications isn't just about handling more users—it's about creating code that's maintainable, testable, and adaptable to changing requirements. Here are the key patterns and practices I've learned.",
    author: "CS",
    published_date: "2024-01-10T14:30:00.000Z",
    blog_tags: ["React", "JavaScript", "Scalability", "Best Practices"],
    created_at: "2024-01-10T14:30:00.000Z",
    updated_at: "2024-01-10T14:30:00.000Z"
  },
  {
    uid: "modern-web-development-tools",
    title: "Modern Web Development Tools for 2024",
    slug: "modern-web-development-tools",
    excerpt: "A comprehensive overview of the latest tools and technologies that are shaping web development.",
    content: "The web development landscape continues to evolve rapidly. Here's my take on the most impactful tools and technologies you should consider for your next project.",
    author: "CS",
    published_date: "2024-01-05T09:00:00.000Z",
    blog_tags: ["Tools", "Web Development", "Technology"],
    created_at: "2024-01-05T09:00:00.000Z",
    updated_at: "2024-01-05T09:00:00.000Z"
  }
];

export const workExperiences: WorkExperience[] = [
  {
    uid: "senior-developer-techcorp",
    title: "Senior Full-Stack Developer at TechCorp",
    company: "TechCorp Solutions",
    position: "Senior Full-Stack Developer",
    start_date: "2022-03-01T00:00:00.000Z",
    current_position: true,
    description: "Leading the development of scalable web applications using React, Node.js, and AWS. Responsible for architectural decisions, code reviews, and mentoring junior developers.",
    technologies: ["React", "Node.js", "AWS", "PostgreSQL", "TypeScript", "Docker"],
    created_at: "2022-03-01T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z"
  },
  {
    uid: "frontend-developer-startupxyz",
    title: "Frontend Developer at StartupXYZ",
    company: "StartupXYZ",
    position: "Frontend Developer",
    start_date: "2020-06-01T00:00:00.000Z",
    end_date: "2022-02-28T00:00:00.000Z",
    current_position: false,
    description: "Built responsive web applications and improved user experience across multiple products. Collaborated with design and backend teams to deliver high-quality features.",
    technologies: ["Vue.js", "Express.js", "MongoDB", "SASS", "Webpack"],
    created_at: "2020-06-01T00:00:00.000Z",
    updated_at: "2022-02-28T00:00:00.000Z"
  },
  {
    uid: "junior-developer-webstudio",
    title: "Junior Developer at WebStudio",
    company: "WebStudio",
    position: "Junior Web Developer",
    start_date: "2019-01-01T00:00:00.000Z",
    end_date: "2020-05-31T00:00:00.000Z",
    current_position: false,
    description: "Started my professional journey building websites and learning modern web development practices. Gained experience in both frontend and backend development.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    created_at: "2019-01-01T00:00:00.000Z",
    updated_at: "2020-05-31T00:00:00.000Z"
  }
];

export const portfolioProjects: PortfolioProject[] = [
  {
    uid: "ecommerce-platform",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description: "A full-featured e-commerce platform built with Next.js and Stripe integration. Features include product catalog, shopping cart, checkout, and admin dashboard.",
    technologies: ["Next.js", "React", "Stripe", "PostgreSQL", "Tailwind CSS"],
    live_url: "https://ecommerce-demo.example.com",
    github_url: "https://github.com/your-username/ecommerce-platform",
    project_type: "Web Application",
    featured: true,
    created_at: "2023-12-01T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z"
  },
  {
    uid: "task-management-app",
    title: "Task Management App",
    slug: "task-management-app",
    description: "A collaborative task management application with real-time updates using Socket.io. Features include task boards, team collaboration, and progress tracking.",
    technologies: ["React", "Socket.io", "Express.js", "MongoDB", "Material-UI"],
    live_url: "https://taskapp-demo.example.com",
    github_url: "https://github.com/your-username/task-management",
    project_type: "Web Application",
    featured: true,
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-12-15T00:00:00.000Z"
  },
  {
    uid: "weather-dashboard",
    title: "Weather Dashboard",
    slug: "weather-dashboard",
    description: "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics. Built with modern React patterns.",
    technologies: ["React", "TypeScript", "Chart.js", "OpenWeatherMap API"],
    live_url: "https://weather-dashboard.example.com",
    github_url: "https://github.com/your-username/weather-dashboard",
    project_type: "Dashboard",
    featured: false,
    created_at: "2023-08-01T00:00:00.000Z",
    updated_at: "2023-09-15T00:00:00.000Z"
  },
  {
    uid: "blog-platform",
    title: "Personal Blog Platform",
    slug: "blog-platform",
    description: "A custom-built blog platform with markdown support, syntax highlighting, and SEO optimization. Features a clean, minimalist design.",
    technologies: ["Next.js", "MDX", "Prisma", "SQLite"],
    live_url: "https://blog.example.com",
    github_url: "https://github.com/your-username/blog-platform",
    project_type: "Blog",
    featured: false,
    created_at: "2023-06-01T00:00:00.000Z",
    updated_at: "2023-07-15T00:00:00.000Z"
  }
];