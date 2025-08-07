# CS Bio - Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js 15, Tailwind CSS, and Contentstack CMS.

## Features

✨ **Modern Design**
- Clean, minimalist interface with dark/light mode support
- Fully responsive design optimized for all devices
- Smooth animations and transitions
- Beautiful typography with custom fonts

🚀 **Performance Optimized**
- Built with Next.js 15 for optimal performance
- Server-side rendering and static generation
- Optimized images and assets
- Fast loading times

📱 **Mobile-First Responsive**
- Optimized for mobile, tablet, and desktop
- Touch-friendly interface
- Responsive navigation and layouts
- Progressive enhancement

🎨 **Customizable**
- Easy color scheme customization
- Flexible layout system
- Component-based architecture
- Headless CMS integration

📝 **Content Management**
- Contentstack CMS integration
- Easy content updates without code changes
- Support for blog posts, projects, and experience
- SEO optimization

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **CMS:** Contentstack
- **Icons:** Lucide React
- **TypeScript:** Full type safety
- **Deployment:** Contentstack Launch-ready

## 🚀 One-Click Deployment

This portfolio is designed for **instant deployment** - no local setup required!

### Deploy to Contentstack Launch (Recommended)

1. **Deploy to Contentstack Launch** and connect your repository
2. **Add Environment Variables** in the Launch dashboard:
   ```env
   CONTENTSTACK_API_HOST=api.contentstack.io
   CONTENTSTACK_CDN=cdn.contentstack.com/v3
   CONTENTSTACK_API_KEY=your_api_key_here
   CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
   CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token_here
   CONTENTSTACK_ENVIRONMENT=production
   ```
3. **Deploy!** - Content types and sample data are created automatically on first load

### Alternative: Local Development

If you prefer to develop locally:

\`\`\`bash
# 1. Clone and install
git clone https://github.com/your-username/cs-bio.git
cd cs-bio
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Contentstack credentials

# 3. Start development server
npm run dev
\`\`\`

**That's it!** No setup scripts to run - everything happens automatically.

## Content Types

The site includes the following content types:

### Home Page
- Hero headline and subtext
- About section
- Skills list
- Contact email

### Blog Posts
- Title and slug
- Excerpt and content
- Author and publish date
- Tags

### Work Experience
- Company and position
- Start/end dates
- Description
- Technologies used

### Portfolio Projects
- Project title and description
- Technologies used
- Live URL and GitHub URL
- Featured status

## Customization

### Colors and Theming

The site uses CSS custom properties for theming. You can customize colors in \`src/app/globals.css\`:

\`\`\`css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --accent: #3b82f6;
  /* ... more variables */
}
\`\`\`

### Components

All components are located in \`src/components/\` and are fully customizable:

- \`Hero.tsx\` - Hero section
- \`About.tsx\` - About section
- \`WorkExperience.tsx\` - Work experience timeline
- \`Portfolio.tsx\` - Project showcase
- \`Blog.tsx\` - Blog posts preview
- \`Contact.tsx\` - Contact form and information

### Content Management

Update your content through the Contentstack dashboard, and it will automatically appear on your site. No code changes required!

## Deployment

### Deploy to Contentstack Launch

1. Connect your GitHub repository to Contentstack Launch
2. Add your environment variables in the Launch dashboard
3. Deploy!

### Other Platforms

The site is a standard Next.js application and can be deployed to any platform that supports Node.js, including Vercel, Netlify, or other hosting providers.

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Automatic Setup

✨ **No manual setup required!** The app automatically:
- Detects if Contentstack content types exist
- Creates content types and sample data on first load
- Handles all API configurations seamlessly

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## License

MIT License - feel free to use this project for your own portfolio!