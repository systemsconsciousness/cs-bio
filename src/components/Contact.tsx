import { Mail, MessageCircle, Send } from 'lucide-react';
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
            Let's Work Together
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s discuss how we can bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Get in Touch</h4>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                I&apos;m always interested in new opportunities and collaborations. Whether you have a project, 
                a question, or just want to say hello, feel free to reach out!
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-accent/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm sm:text-base">Email</p>
                  <a 
                    href={`mailto:${content?.contact_email || 'hello@example.com'}`}
                    className="text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors break-all"
                  >
                    {content?.contact_email || 'hello@example.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-accent/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Response Time</p>
                  <p className="text-sm sm:text-base text-muted-foreground">Usually within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-3">
              <a
                href={`mailto:${content?.contact_email || 'hello@example.com'}`}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-background rounded-2xl border border-border p-4 sm:p-6 lg:p-8">
            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;