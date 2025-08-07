import Hero from '@/components/Hero';
import About from '@/components/About';
import WorkExperience from '@/components/WorkExperience';
import Portfolio from '@/components/Portfolio';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import { 
  getSiteConfiguration,
  getHomePageContent, 
  getBlogPosts, 
  getWorkExperiences, 
  getPortfolioProjects 
} from '@/lib/contentstack';
import { redirect } from 'next/navigation';

// Force this page to be dynamic (not cached)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Check if site configuration entry exists
  let siteConfig = null;
  
  try {
    siteConfig = await getSiteConfiguration();
    console.log('🔍 Home page - site config exists:', !!siteConfig);
  } catch (error) {
    console.error('🔍 Home page - error fetching site config:', error);
  }
  
  // If no site config exists, redirect to setup page
  if (!siteConfig) {
    console.log('🔄 No site configuration found, redirecting to setup page');
    redirect('/setup');
  }
  
  // Fetch all content from Contentstack
  const [homeContent, blogPosts, workExperiences, portfolioProjects] = await Promise.all([
    getHomePageContent(),
    getBlogPosts(),
    getWorkExperiences(),
    getPortfolioProjects(),
  ]);

  return (
    <div className="min-h-screen">
      <Hero content={homeContent} siteConfig={siteConfig} />
      <About content={homeContent} siteConfig={siteConfig} />
      <WorkExperience experiences={workExperiences} />
      <Portfolio projects={portfolioProjects} />
      <Blog posts={blogPosts} />
      <Contact content={homeContent} />
    </div>
  );
}
