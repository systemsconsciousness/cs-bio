'use client';

import { useState } from 'react';
import { User, Globe, FileText, Sparkles } from 'lucide-react';

interface SetupFormData {
  ownerName: string;
  ownerEmail: string;
  siteName: string;
  siteSubtitle: string;
  bio: string;
}

interface WelcomeSetupProps {
  onComplete: (data: SetupFormData) => Promise<void>;
}

export default function WelcomeSetup({ onComplete }: WelcomeSetupProps) {
  const [formData, setFormData] = useState<SetupFormData>({
    ownerName: '',
    ownerEmail: '',
    siteName: '',
    siteSubtitle: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to Your New Site! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Let&apos;s personalize your bio site with a few quick details. This will only take a minute!
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-accent" />
                About You
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="ownerEmail" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="ownerEmail"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Site Info Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-accent" />
                Site Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-foreground mb-2">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="John&apos;s Portfolio"
                  />
                </div>
                
                <div>
                  <label htmlFor="siteSubtitle" className="block text-sm font-medium text-foreground mb-2">
                    Site Subtitle
                  </label>
                  <input
                    type="text"
                    id="siteSubtitle"
                    name="siteSubtitle"
                    value={formData.siteSubtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="Full-Stack Developer & Designer"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-accent" />
                Tell Your Story
              </h2>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                  Short Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
                  placeholder="I&apos;m a passionate developer who loves creating amazing digital experiences. I specialize in..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will appear in your hero section and about page
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.ownerName || !formData.siteName}
                className="w-full bg-accent text-accent-foreground font-semibold py-4 px-6 rounded-lg hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2"></div>
                    Setting up your site...
                  </span>
                ) : (
                  'Complete Setup & Launch Site!'
                )}
              </button>
            </div>
          </form>
          
          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t worry, you can always change these details later in your Contentstack dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}