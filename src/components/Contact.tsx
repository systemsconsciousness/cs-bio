import { Mail, Github, Linkedin } from 'lucide-react';
import { HomePageContent, SiteConfiguration } from '@/lib/contentstack';

interface ContactProps {
  content: HomePageContent | null;
  siteConfig: SiteConfiguration | null;
}

const Contact = ({ content, siteConfig }: ContactProps) => {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
            Contact
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let&apos;s Connect
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you. Reach out through any of the channels below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card - Always show */}
            <div className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="text-sm text-muted-foreground">Direct contact</p>
                </div>
              </div>
              <a 
                href={`mailto:${siteConfig?.owner_email || content?.contact_email || 'hello@example.com'}`}
                className="text-accent hover:text-accent/80 transition-colors font-medium break-all"
              >
                {siteConfig?.owner_email || content?.contact_email || 'hello@example.com'}
              </a>
            </div>

            {/* GitHub Card - Only show if URL is provided */}
            {siteConfig?.github_url && (
              <div className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                    <Github className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">GitHub</h4>
                    <p className="text-sm text-muted-foreground">Code portfolio</p>
                  </div>
                </div>
                <a
                  href={siteConfig.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  View my projects
                </a>
              </div>
            )}

            {/* LinkedIn Card - Only show if URL is provided */}
            {siteConfig?.linkedin_url && (
              <div className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                    <Linkedin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">LinkedIn</h4>
                    <p className="text-sm text-muted-foreground">Professional network</p>
                  </div>
                </div>
                <a
                  href={siteConfig.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  Connect with me
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;