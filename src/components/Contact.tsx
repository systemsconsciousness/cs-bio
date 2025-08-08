import { Mail, MessageCircle, ExternalLink } from 'lucide-react';
import { HomePageContent } from '@/lib/contentstack';

interface ContactProps {
  content: HomePageContent | null;
}

const Contact = ({ content }: ContactProps) => {
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

        <div className="max-w-2xl mx-auto">
          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Email Card */}
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
                href={`mailto:${content?.contact_email || 'hello@example.com'}`}
                className="text-accent hover:text-accent/80 transition-colors font-medium break-all"
              >
                {content?.contact_email || 'hello@example.com'}
              </a>
            </div>

            {/* LinkedIn Card */}
            <div className="bg-background rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                  <ExternalLink className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">LinkedIn</h4>
                  <p className="text-sm text-muted-foreground">Professional network</p>
                </div>
              </div>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Connect with me
              </a>
            </div>
          </div>

          {/* Response Info */}
          <div className="bg-background rounded-2xl border border-border p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-foreground">Response Time</h4>
            </div>
            <p className="text-muted-foreground">
              I typically respond within 24 hours. Looking forward to hearing from you!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;