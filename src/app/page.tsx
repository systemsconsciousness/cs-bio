import Hero from '@/components/Hero';
import About from '@/components/About';
import WorkExperience from '@/components/WorkExperience';
import Portfolio from '@/components/Portfolio';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import SetupGuard from '@/components/SetupGuard';
import { 
  getSiteConfiguration,
  getHomePageContent, 
  getBlogPosts, 
  getWorkExperiences, 
  getPortfolioProjects 
} from '@/lib/contentstack';

export default async function Home() {
  // Check if site configuration entry exists
  let siteConfig = null;
  
  try {
    siteConfig = await getSiteConfiguration();
    console.log('🔍 Home page - site config exists:', !!siteConfig);
  } catch (error) {
    console.error('🔍 Home page - error fetching site config:', error);
  }
  
  // Fetch all content from Contentstack (even if siteConfig is null for graceful fallback)
  const [homeContent, blogPosts, workExperiences, portfolioProjects] = await Promise.all([
    getHomePageContent(),
    getBlogPosts(),
    getWorkExperiences(),
    getPortfolioProjects(),
  ]);

  return (
    <SetupGuard siteConfigExists={!!siteConfig}>
      <div className="min-h-screen">
        <Hero content={homeContent} siteConfig={siteConfig} />
        <About content={homeContent} siteConfig={siteConfig} />
        <WorkExperience experiences={workExperiences} />
        <Portfolio projects={portfolioProjects} />
        <Blog posts={blogPosts} />
        <Contact content={homeContent} />
      </div>
    </SetupGuard>
  );
}
