# CS Bio - Contentstack Bio Site Starter

A modern, fully-functional bio/portfolio website powered by [Next.js](https://nextjs.org) and [Contentstack](https://contentstack.com). This starter project automatically sets up a complete content management system with sample content, ready for customization and deployment.

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd cs-bio
npm install
```

### 2. Set Up Contentstack

1. Create a Contentstack account and stack at [contentstack.com](https://contentstack.com)
2. Get your API credentials:
   - Stack API Key
   - Management Token (required for setup)
   - Delivery Token
3. Copy `.env.local` from the environment variables documentation:

```bash
# Copy environment variables from environment-variables.md
cp environment-variables.md .env.local.example
```

### 3. Configure Environment Variables

Create `.env.local` in the project root with your Contentstack credentials:

```bash
CONTENTSTACK_API_HOST=api.contentstack.io
CONTENTSTACK_CDN=cdn.contentstack.com/v3
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
CONTENTSTACK_MANAGEMENT_TOKEN=your-management-token
CONTENTSTACK_ENVIRONMENT=production
```

### 4. Initialize Contentstack Content

Run the setup script to create content models and sample data:

```bash
npm run build
# The postbuild script automatically runs the Contentstack initialization
```

This creates:
- ✅ **4 Content Types**: Home Page, Blog Post, Work Experience, Portfolio Project  
- ✅ **Sample Content**: 1 home page, 2 blog posts, 2 work experiences, 2 portfolio projects

### 5. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your bio site!

## 📋 What Gets Created

The initialization script sets up a complete bio site structure:

### Content Types
1. **Home Page** - Hero section, about text, skills list, contact info
2. **Blog Post** - Title, slug, content, author, tags, publish date
3. **Work Experience** - Company, position, dates, description, technologies
4. **Portfolio Project** - Title, description, technologies, live/GitHub URLs

### Sample Content
- Professional home page with hero section and about text
- 2 technical blog posts about web development
- 2 work experience entries with realistic job descriptions  
- 2 portfolio projects showcasing different types of work

## 🛠 Customization

### Editing Content
1. Log into your [Contentstack dashboard](https://app.contentstack.com)
2. Navigate to your stack
3. Edit the sample content or create new entries
4. Publish entries to make them available via the API

### Modifying Content Models
- Edit `scripts/init-contentstack.js` to customize the content type schemas
- Add new fields, change field types, or create entirely new content types
- Re-run `npm run build` to apply changes

### Frontend Development
- Edit `src/app/page.tsx` to customize the homepage layout
- Create new pages in the `src/app` directory
- Use the Contentstack Delivery API to fetch and display content

## 📚 Documentation

- [Environment Variables Guide](./environment-variables.md) - Complete setup instructions
- [Contentstack Documentation](https://www.contentstack.com/docs/) - Official API docs
- [Next.js Documentation](https://nextjs.org/docs) - Frontend framework docs

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Contentstack setup)
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy to Vercel
The easiest way to deploy is using [Vercel](https://vercel.com):

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Environment Variables for Production
Make sure to set all required environment variables in your deployment platform:
- `CONTENTSTACK_API_HOST`
- `CONTENTSTACK_CDN`  
- `CONTENTSTACK_API_KEY`
- `CONTENTSTACK_DELIVERY_TOKEN`
- `CONTENTSTACK_ENVIRONMENT`

Note: `CONTENTSTACK_MANAGEMENT_TOKEN` is only needed for the initial setup, not for production runtime.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Next.js](https://nextjs.org) and [Contentstack](https://contentstack.com)