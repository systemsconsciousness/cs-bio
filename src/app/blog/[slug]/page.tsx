import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { getBlogPost, getBlogPosts } from '@/lib/contentstack';

// Force this page to be dynamic (not cached)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string = '') => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back to Blog */}
        <div className="mb-8">
          <a
            href="/blog"
            className="inline-flex items-center text-accent font-medium hover:gap-2 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Blog
          </a>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="space-y-6">
            {/* Tags */}
            {post.blog_tags && post.blog_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.blog_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_date}>
                  {formatDate(post.published_date || post.created_at)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{calculateReadTime(post.content)} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-gray max-w-none">
          <div className="text-foreground leading-relaxed space-y-6">
            {post.content ? (
              <div
                className="whitespace-pre-wrap text-base md:text-lg leading-8"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />
            ) : (
              <p className="text-muted-foreground italic">
                No content available for this post.
              </p>
            )}
          </div>
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <a
              href="/blog"
              className="inline-flex items-center text-accent font-medium hover:gap-2 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Blog
            </a>
            
            <div className="text-sm text-muted-foreground">
              Published {formatDate(post.published_date || post.created_at)}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}
