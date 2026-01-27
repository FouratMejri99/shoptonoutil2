import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageLoader, PageSkeleton } from "@/components/PageLoader";
import { motion } from "framer-motion";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  // Static blog posts from Solupedia.com
  const staticPosts = [
    {
      id: 1,
      title: "Articulate Storyline or Adobe Captivate",
      slug: "articulate-storyline-adobe-captivate",
      category: "eLearning Localization",
      author: "Solupedia",
      publishedAt: new Date("2023-02-16"),
      featuredImage: "/blog-articulate-captivate.webp",
      excerpt: "Which eLearning authoring tool is the better choice for localization: Articulate Storyline or Adobe Captivate? When it comes to e-learning authoring tools, both tools offer a range of features to support robust localization capabilities."
    },
    {
      id: 2,
      title: "MadCap Flare Localization",
      slug: "madcap-flare-localization",
      category: "Documents Localization",
      author: "Solupedia",
      publishedAt: new Date("2022-08-29"),
      featuredImage: "/blog-madcap-flare.webp",
      excerpt: "MadCap Flare is a popular software tool used for creating and publishing technical documentation, help files, and online help systems. One of the key benefits of using MadCap Flare is its ability to localize content efficiently."
    },
    {
      id: 3,
      title: "Video Localization Considerations",
      slug: "video-localization-considerations",
      category: "Video Localization",
      author: "Solupedia",
      publishedAt: new Date("2022-08-24"),
      featuredImage: "/blog-video-localization.webp",
      excerpt: "As the world becomes increasingly connected, more and more video content is being shared across borders and languages. Localizing video content involves adapting it for a particular region or language, which can be a complex process."
    }
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-4"
          >
            Localization Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100"
          >
            Industry trends, best practices, and expert insights on localization
          </motion.p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <PageSkeleton />
          ) : (posts && posts.length > 0 ? posts : staticPosts).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(posts && posts.length > 0 ? posts : staticPosts).map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all cursor-pointer flex flex-col overflow-hidden">
                      {post.featuredImage && (
                        <motion.div 
                          className="w-full h-48 bg-gray-300 rounded-t-lg overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                        </motion.div>
                      )}
                      <CardHeader className="flex-1">
                        {post.category && (
                          <motion.div 
                            className="text-xs font-semibold text-blue-600 mb-2 uppercase"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + 0.2 }}
                          >
                            {post.category}
                          </motion.div>
                        )}
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {post.author && (
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{post.author}</span>
                            </div>
                          )}
                          {post.publishedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No blog posts available yet.</p>
              <p className="text-gray-600">Check back soon for our latest insights on localization.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter for the latest localization insights and industry trends.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
              required
            />
            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Expand Globally?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how our localization expertise can help your business reach new markets.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started Today <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
