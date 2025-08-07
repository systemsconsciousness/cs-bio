'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Globe, FileText, Sparkles, Camera } from 'lucide-react';

interface SetupFormData {
  ownerName: string;
  ownerEmail: string;
  siteName: string;
  siteSubtitle: string;
  bio: string;
  avatarPhoto?: File | null;
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

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be less than 5MB');
        return;
      }
      
      setSelectedPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setError(null);
    }
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ownerName.trim() || !formData.siteName.trim()) {
      setError('Please fill in your name and site name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      setStatusMessage('Creating your site configuration...');
      const formDataWithPhoto = { ...formData, avatarPhoto: selectedPhoto };
      await onComplete(formDataWithPhoto);
      setIsSuccess(true);
      setStatusMessage('Setup completed! Redirecting to your site...');
      // Keep submitting state active until redirect happens
    } catch (error) {
      console.error('Setup failed:', error);
      setError('Setup failed. Please try again.');
      setIsSubmitting(false);
      setStatusMessage('');
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
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Setup completed successfully! Redirecting to your site...
            </div>
          )}
          {statusMessage && !error && !isSuccess && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              {statusMessage}
            </div>
          )}
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

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <div className="relative">
                      <Image
                        src={photoPreview}
                        alt="Profile preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-accent/20"
                        unoptimized={true}
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-accent/50" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      id="avatarPhoto"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatarPhoto"
                      className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg cursor-pointer hover:bg-accent/90 transition-colors"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
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
                    {isSuccess ? 'Launching your site...' : 'Setting up your site...'}
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