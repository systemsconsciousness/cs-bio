import { Github, Linkedin, Mail } from 'lucide-react';
import { SiteConfiguration } from '@/lib/contentstack';

interface FooterProps {
  siteConfig?: SiteConfiguration | null;
}

const Footer = ({ siteConfig }: FooterProps) => {
  // Create social links array with dynamic URLs from siteConfig
  const socialLinks = [
    {
      href: `mailto:${siteConfig?.owner_email || 'hello@example.com'}`,
      icon: Mail,
      label: 'Email',
      show: true, // Always show email
    },
    {
      href: siteConfig?.github_url || '',
      icon: Github,
      label: 'GitHub',
      show: !!siteConfig?.github_url, // Only show if URL exists
    },
    {
      href: siteConfig?.linkedin_url || '',
      icon: Linkedin,
      label: 'LinkedIn',
      show: !!siteConfig?.linkedin_url, // Only show if URL exists
    },
  ].filter(link => link.show); // Filter out links that shouldn't be shown

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">{siteConfig?.site_name || 'Personal Website'}</h3>
            <p className="text-muted-foreground mb-4">
              {siteConfig?.bio || 'Just another vibe coder looking for a token.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#work" className="text-muted-foreground hover:text-foreground transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get In Touch</h4>
            <p className="text-muted-foreground mb-2">
              Interested in working together?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              Let&apos;s Connect
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {siteConfig?.site_name || 'Personal Website'}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 sm:mt-0">
            Built with{' '}
            <a 
              href="https://github.com/systemsconsciousness/cs-bio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              cs-bio
            </a>
            {' '}&amp;{' '}
            <a 
              href="https://contentstack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Contentstack
            </a>
            {' '}•{' '}
            <a 
              href="https://www.contentstack.com/platforms/launch" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Powered by Launch
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;