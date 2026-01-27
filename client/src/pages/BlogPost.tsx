import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { PageLoader } from "@/components/PageLoader";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading } = trpc.blog.bySlug.useQuery(slug, { enabled: !!slug });

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (isLoading) {
    return <PageLoader fullScreen size="lg" />;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            {post.author && (
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            )}
            {post.category && (
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">{post.category}</span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="w-full h-96 bg-gray-300 rounded-lg overflow-hidden">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="prose prose-lg max-w-none">
                <Streamdown>{post.content}</Streamdown>
              </div>

              {post.tags && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-bold mb-4">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(",").map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Need Localization Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Ready to apply these insights to your business?
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Get a Free Consultation
                    </Button>
                  </Link>
                  <Link href="/lead-magnet">
                    <Button variant="outline" className="w-full">
                      Download Free Guide
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Related Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/services/document-localization" className="text-blue-600 hover:underline">
                        Document Localization
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/elearning-localization" className="text-blue-600 hover:underline">
                        eLearning Localization
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/audio-video-localization" className="text-blue-600 hover:underline">
                        Audio/Video Localization
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* More Posts */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">More Insights</h2>
          <p className="text-gray-600 mb-8">Explore more articles on localization</p>
          <Link href="/blog">
            <Button size="lg" variant="outline">
              View All Articles <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Expand Globally?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how Solupedia can help you reach new markets with professional localization.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Your Project <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
