import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/data';

interface BlogProps {
  posts: BlogPost[];
}

const Blog = ({ posts }: BlogProps) => {
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

  // Show only the latest 3 posts
  const featuredPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
            Blog
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest Articles
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredPosts.map((post) => (
            <article
              key={post.uid}
              className="group bg-muted/30 rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Article Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center overflow-hidden">
                <div className="text-6xl font-bold text-accent/30">
                  {post.title.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>

              {/* Article Content */}
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Meta Information */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <time dateTime={post.published_date}>
                        {formatDate(post.published_date || post.created_at)}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{calculateReadTime(post.content)} min read</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {post.blog_tags && post.blog_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {post.blog_tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-background rounded-md text-xs font-medium text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.blog_tags.length > 2 && (
                        <span className="px-2 py-1 bg-background rounded-md text-xs font-medium text-muted-foreground">
                          +{post.blog_tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Read More */}
                <div className="pt-4 sm:pt-6 border-t border-border mt-4 sm:mt-6">
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-accent font-medium hover:gap-2 transition-all duration-200 text-sm sm:text-base"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Blog posts will be displayed here once added to Contentstack.
            </p>
          </div>
        )}

        {/* View All Posts */}
        {posts.length > 3 && (
          <div className="text-center mt-12">
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-accent/90 transition-colors"
            >
              View All Posts
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;