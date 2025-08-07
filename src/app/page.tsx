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
  const siteConfig = await getSiteConfiguration();
  
  console.log('🔍 Home page - site config:', JSON.stringify(siteConfig, null, 2));
  console.log('🔍 Home page - setup completed:', siteConfig?.setup_completed);
  
  // If setup is not completed or site config doesn't exist, redirect to setup page
  if (!siteConfig || !siteConfig.setup_completed) {
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
