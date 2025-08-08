import { HomePageContent, SiteConfiguration } from '@/lib/contentstack';

interface AboutProps {
  content: HomePageContent | null;
  siteConfig: SiteConfiguration | null;
}

const About = ({ content, siteConfig }: AboutProps) => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div>
              <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                About Me
              </h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                About {siteConfig?.owner_name || 'Me'}
              </h3>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {siteConfig?.bio || content?.about_section || 
                  "I'm a passionate creator building amazing things. Welcome to my digital space where I share my work, thoughts, and journey."
                }
              </p>
            </div>

            {/* Contact Info */}
            <div className="pt-6">
              <h4 className="font-semibold mb-4">Get in touch</h4>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span>{' '}
                  <a 
                    href={`mailto:${siteConfig?.owner_email || content?.contact_email || 'hello@example.com'}`}
                    className="text-accent hover:underline"
                  >
                    {siteConfig?.owner_email || content?.contact_email || 'hello@example.com'}
                  </a>
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Location:</span> {siteConfig?.work_location || 'Remote / Global'}
                </p>
                {siteConfig?.time_zone && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Time Zone:</span> {siteConfig.time_zone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats/Highlights */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 order-1 lg:order-2">
            <div className="bg-background p-4 sm:p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                {siteConfig?.years_experience ? `${siteConfig.years_experience}+` : '3+'}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Years Experience</div>
            </div>
            <div className="bg-background p-4 sm:p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                {siteConfig?.projects_completed ? `${siteConfig.projects_completed}+` : '50+'}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Projects Completed</div>
            </div>
            <div className="bg-background p-4 sm:p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                {siteConfig?.technologies_count ? `${siteConfig.technologies_count}+` : '10+'}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Technologies</div>
            </div>
            <div className="bg-background p-4 sm:p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">
                {siteConfig?.time_zone || 'PST'}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Time Zone</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;