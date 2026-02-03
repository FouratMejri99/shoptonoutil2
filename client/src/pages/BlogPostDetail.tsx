import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Share2, User } from "lucide-react";
import { Link, useParams } from "wouter";

// Blog post data with full content
const blogPostsData: Record<string, any> = {
  "articulate-storyline-adobe-captivate": {
    id: 1,
    title: "Articulate Storyline or Adobe Captivate",
    slug: "articulate-storyline-adobe-captivate",
    category: "eLearning Localization",
    author: "Solupedia",
    publishedAt: new Date("2023-02-16"),
    featuredImage: "/blog-articulate-captivate.webp",
    excerpt:
      "Which eLearning authoring tool is the better choice for localization: Articulate Storyline or Adobe Captivate?",
    content: `
<h2>Which eLearning authoring tool is the better choice for localization: Articulate Storyline or Adobe Captivate?</h2>

<p>When it comes to e-learning authoring tools, Articulate Storyline and Adobe Captivate are two of the most popular options available. If you're looking for an e-learning authoring tool with robust localization capabilities, both tools offer a range of features to help you create content that can be easily translated and adapted to different languages and cultures.</p>

<h3>Articulate Storyline</h3>

<p>Articulate Storyline is known for its intuitive interface and ease of use, making it a popular choice for instructional designers and e-learning developers. Its built-in translation features allow you to export your content for translation, create localized versions of your courses, and manage translations with ease. Additionally, Storyline supports right-to-left languages and has a feature that automatically detects and adjusts the text direction based on the language being used.</p>

<h3>Adobe Captivate</h3>

<p>Adobe Captivate is another popular e-learning authoring tool that is known for its powerful multimedia capabilities. Captivate also offers robust localization features, including the ability to export content for translation and import translated content back into your course. Captivate also includes a text-to-speech feature that supports over 25 languages.</p>

<h3>Key Differences</h3>

<p><strong>Deployment Model:</strong> Articulate Storyline is a cloud-based tool, which means that you can access your content from anywhere with an internet connection. This can be helpful if you have team members or stakeholders in different locations who need to review or work on your content. On the other hand, Adobe Captivate is a desktop-based tool, which may be more suitable if you need to work offline or if you have specific security or privacy concerns.</p>

<p><strong>Cost Structure:</strong> Articulate Storyline has a one-time fee, while Adobe Captivate is subscription-based. Depending on your budget and how often you plan to use the tool, this could be a deciding factor.</p>

<p><strong>Localization Features:</strong> In terms of which tool to choose from a localization standpoint, both Articulate Storyline and Adobe Captivate have similar localization features, so it ultimately comes down to personal preference and the specific needs of your project.</p>

<h3>Conclusion</h3>

<p>Overall, both Articulate Storyline and Adobe Captivate are great options if you're looking for an e-learning authoring tool with robust localization capabilities. It's worth taking the time to compare the features and costs of each tool to determine which one is the best fit for your needs.</p>

<p>Looking for advice on your case? We would be pleased to help you decide which e-Learning authoring tool you select for your project!</p>
    `,
  },
  "madcap-flare-localization": {
    id: 2,
    title: "MadCap Flare Localization",
    slug: "madcap-flare-localization",
    category: "Documents Localization",
    author: "Solupedia",
    publishedAt: new Date("2022-08-29"),
    featuredImage: "/blog-madcap-flare.webp",
    excerpt:
      "MadCap Flare is a popular software tool used for creating and publishing technical documentation, help files, and online help systems.",
    content: `
<h2>MadCap Flare Localization</h2>

<p>MadCap Flare is a popular software tool used for creating and publishing technical documentation, help files, and online help systems. With its powerful features and easy-to-use interface, MadCap Flare has become a favorite among technical writers and documentation teams.</p>

<p>One of the key benefits of using MadCap Flare is its ability to localize content efficiently. Whether you're creating documentation for a global audience or need to translate your content into multiple languages, MadCap Flare provides robust localization capabilities that streamline the translation process.</p>

<h3>Localization Features in MadCap Flare</h3>

<p><strong>Conditional Text and Variables:</strong> MadCap Flare allows you to use conditional text and variables to manage content variations across different languages and regions. This feature enables you to maintain a single source document while creating multiple localized versions, reducing the time and effort required for translation and maintenance.</p>

<p><strong>Translation Memory Integration:</strong> MadCap Flare integrates with translation memory (TM) systems, which helps maintain consistency across translated documents and reduces translation costs by reusing previously translated segments.</p>

<p><strong>Multi-Language Support:</strong> The tool supports multiple languages and character sets, including right-to-left languages, making it suitable for global documentation projects.</p>

<p><strong>Automated Workflows:</strong> MadCap Flare's automation capabilities allow you to streamline the localization workflow, from content creation to translation and publishing. This helps reduce manual errors and ensures consistency across all localized versions.</p>

<p><strong>Version Control:</strong> The built-in version control system helps manage different versions of your documentation, making it easier to track changes and maintain consistency across localized content.</p>

<h3>Benefits for Localization</h3>

<ul>
<li><strong>Cost Efficiency:</strong> By managing content variations within a single source file, MadCap Flare reduces the overall cost of localization projects.</li>
<li><strong>Time Savings:</strong> Automated workflows and conditional content management significantly reduce the time required to create and maintain localized documentation.</li>
<li><strong>Quality Assurance:</strong> The tool's features help ensure consistency and accuracy across all localized versions of your documentation.</li>
<li><strong>Scalability:</strong> MadCap Flare can handle large-scale documentation projects with multiple languages and complex content structures.</li>
</ul>

<h3>Conclusion</h3>

<p>MadCap Flare is an excellent choice for organizations that need to create and maintain technical documentation in multiple languages. Its robust localization features, combined with its powerful content management capabilities, make it an ideal solution for global documentation projects.</p>

<p>Need help with your MadCap Flare localization project? Contact Solupedia for expert guidance and support!</p>
    `,
  },
  "video-localization-considerations": {
    id: 3,
    title: "Video Localization Considerations",
    slug: "video-localization-considerations",
    category: "Video Localization",
    author: "Solupedia",
    publishedAt: new Date("2022-08-24"),
    featuredImage: "/blog-video-localization.webp",
    excerpt:
      "As the world becomes increasingly connected, more and more video content is being shared across borders and languages.",
    content: `
<h2>Video Localization Considerations</h2>

<p>As the world becomes increasingly connected, more and more video content is being shared across borders and languages. In order to reach a global audience, video editors and content creators must often localize their content. Localization involves adapting a video for a particular region or language, and it can be a complex process.</p>

<p>When localizing video content, there are several important considerations to keep in mind to ensure that your message resonates with your target audience and maintains the intended impact across different cultures and languages.</p>

<h3>Key Considerations for Video Localization</h3>

<p><strong>Language and Subtitles:</strong> One of the most obvious aspects of video localization is translating the spoken dialogue and adding subtitles in the target language. However, it's important to ensure that the translation is not just accurate, but also culturally appropriate and maintains the tone and style of the original content.</p>

<p><strong>Cultural Adaptation:</strong> Different cultures have different values, customs, and sensitivities. What works in one culture may not work in another. It's important to consider cultural differences when localizing video content, such as:</p>

<ul>
<li>Color symbolism and meanings</li>
<li>Gestures and body language</li>
<li>References to local events, holidays, or cultural phenomena</li>
<li>Humor and idioms that may not translate directly</li>
</ul>

<p><strong>Audio and Voiceover:</strong> If your video includes voiceover narration, you'll need to consider whether to use dubbing (replacing the original audio with a translated version) or subtitles. Each approach has its pros and cons, and the choice depends on your target audience and budget.</p>

<p><strong>On-Screen Text:</strong> Any text that appears on screen, such as titles, captions, or graphics, will need to be translated and potentially redesigned to accommodate text length differences in different languages.</p>

<p><strong>Timing and Pacing:</strong> Different languages have different speech rates. When translating dialogue, you may need to adjust the timing and pacing of the video to ensure that the translated audio fits naturally with the video content.</p>

<p><strong>Visual Elements:</strong> Some visual elements may need to be adapted for different regions. For example, you may need to change currency symbols, measurement units, or date formats to match the target region.</p>

<p><strong>Technical Considerations:</strong> When localizing video content, you'll also need to consider technical aspects such as video format and codec compatibility, subtitle file formats and encoding, audio track management, and quality assurance and testing.</p>

<h3>Best Practices for Video Localization</h3>

<ol>
<li><strong>Plan Ahead:</strong> Consider localization from the beginning of your video production process, not as an afterthought. This will help you avoid costly revisions later.</li>
<li><strong>Work with Native Speakers:</strong> Hire native speakers and cultural consultants to ensure that your localized content is accurate and culturally appropriate.</li>
<li><strong>Use Professional Translation Services:</strong> Avoid relying on machine translation for video content. Professional translators who understand the nuances of your industry and target culture are essential.</li>
<li><strong>Test Your Content:</strong> Always test your localized video content with members of your target audience to ensure that it resonates with them and achieves your intended goals.</li>
<li><strong>Maintain Consistency:</strong> If you're localizing multiple videos or a video series, maintain consistency in terminology, style, and tone across all localized versions.</li>
<li><strong>Consider Accessibility:</strong> Don't forget about accessibility features such as captions for the deaf and hard of hearing (SDH), which can also aid in localization efforts.</li>
</ol>

<h3>Conclusion</h3>

<p>Video localization is a complex process that requires careful planning, attention to detail, and cultural sensitivity. By considering these key factors and following best practices, you can create video content that effectively reaches and engages your global audience.</p>

<p>Ready to localize your video content? Solupedia offers professional video localization services to help you reach audiences worldwide. Contact us today to learn more!</p>
    `,
  },
};

export default function BlogPostDetail() {
  const params = useParams();
  const slug = params.slug as string;

  // First check if it's a static post
  const staticPost = blogPostsData[slug];

  // Then try to fetch from database
  const { data: dbPost, isLoading } = trpc.blog.bySlug.useQuery(slug, {
    enabled: !staticPost, // Only fetch if not a static post
  });

  // Use static post if found, otherwise use database post
  const post = staticPost || dbPost;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
        <PageLoader />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
        {/* Background Blobs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, the blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Blog Post Content */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <Link href="/blog">
              <Button
                variant="ghost"
                className="gap-2 mb-8 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Post Content */}
              <article className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="w-full h-64 md:h-80 relative overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}

                <div className="p-8 md:p-12">
                  {/* Category Badge */}
                  <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 text-gray-600 mb-10 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <span>By {post.author}</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div
                    className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Share Section */}
                  <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-gray-900 font-semibold text-lg">
                      Share this post:
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-10 md:p-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Need Expert Localization Services?
                  </h3>
                  <p className="text-blue-100 text-lg max-w-xl">
                    Solupedia specializes in professional localization solutions
                    across all industries.
                  </p>
                </div>
                <Link href="/contact">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8 rounded-full text-lg font-semibold shadow-lg transition-all whitespace-nowrap">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Related Posts */}
            <div className="mt-24">
              <h3 className="text-3xl font-bold text-gray-900 mb-10">
                More Blog Posts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.values(blogPostsData)
                  .filter((p: any) => p.slug !== slug)
                  .slice(0, 2)
                  .map((relatedPost: any, idx) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Card className="h-full hover:shadow-xl transition-all cursor-pointer flex flex-col border-none shadow-lg bg-white/80 backdrop-blur-sm group overflow-hidden rounded-3xl">
                          {relatedPost.featuredImage && (
                            <div className="w-full h-52 bg-gray-200 overflow-hidden relative">
                              <img
                                src={relatedPost.featuredImage}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                          )}
                          <CardContent className="flex-1 p-8">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                              {relatedPost.category}
                            </span>
                            <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-gray-600 line-clamp-3 leading-relaxed">
                              {relatedPost.excerpt}
                            </p>
                            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                              Read Article{" "}
                              <ArrowRight size={16} className="ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
