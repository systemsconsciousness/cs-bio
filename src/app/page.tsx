import Hero from '@/components/Hero';
import About from '@/components/About';
import WorkExperience from '@/components/WorkExperience';
import Portfolio from '@/components/Portfolio';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import { 
  getHomePageContent, 
  getBlogPosts, 
  getWorkExperiences, 
  getPortfolioProjects 
} from '@/lib/contentstack';

export default async function Home() {
  // Fetch all content from Contentstack
  const [homeContent, blogPosts, workExperiences, portfolioProjects] = await Promise.all([
    getHomePageContent(),
    getBlogPosts(),
    getWorkExperiences(),
    getPortfolioProjects(),
  ]);

  return (
    <div className="min-h-screen">
      <Hero content={homeContent} />
      <About content={homeContent} />
      <WorkExperience experiences={workExperiences} />
      <Portfolio projects={portfolioProjects} />
      <Blog posts={blogPosts} />
      <Contact content={homeContent} />
    </div>
  );
}
