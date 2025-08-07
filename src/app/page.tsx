import { redirect } from 'next/navigation';
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

export default async function Home() {
  // Check if initial setup is complete
  let siteConfig = null;
  let setupCompleted = false;
  
  try {
    siteConfig = await getSiteConfiguration();
    console.log('🔍 Home page - site config:', JSON.stringify(siteConfig, null, 2));
    console.log('🔍 Home page - setup completed field:', siteConfig?.setup_completed);
    
    // Check setup completion with multiple fallbacks
    setupCompleted = !!(
      siteConfig && 
      (siteConfig.setup_completed === true || 
       siteConfig.setup_completed === 'true' ||
       siteConfig.setup_completed === 1)
    );
    
    console.log('🔍 Home page - final setup status:', setupCompleted);
  } catch (error) {
    console.error('🔍 Home page - error fetching site config:', error);
  }
  
  // If setup is not completed or site config doesn't exist, redirect to setup page
  if (!setupCompleted) {
    console.log('🔄 Redirecting to setup page');
    redirect('/setup');
  }
  
  console.log('✅ Setup is complete, showing home page');

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
