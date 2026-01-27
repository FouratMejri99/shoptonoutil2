import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";

const serviceDetails: Record<string, any> = {
  "document-localization": {
    title: "Document Localization",
    description: "Professional translation and desktop publishing services",
    image: "/Solupedia-document-localization.jpg",
    fullContent: "Our document localization services transform your content for global audiences. We handle everything from translation to formatting, ensuring your documents maintain their professional appearance and impact across languages and cultures. Whether you need to localize technical manuals, marketing materials, legal documents, or user guides, our expert team ensures every word resonates with your target audience while maintaining your brand voice and visual identity.",
    benefits: [
      "Accurate translation by native speakers with subject matter expertise in your industry",
      "Professional desktop publishing maintaining original design and formatting",
      "Cultural adaptation ensuring content resonates authentically with target audiences",
      "Comprehensive quality assurance and proofreading by experienced linguists",
      "Support for 150+ languages and regional variants worldwide",
      "Fast turnaround times without compromising quality or accuracy",
      "Terminology management ensuring consistency across all documents",
      "Compliance with industry standards and regulatory requirements"
    ],
    process: [
      "Content analysis and terminology development",
      "Translation by specialized translators with industry expertise",
      "Desktop publishing and formatting to match original layout",
      "Quality assurance and proofreading by independent reviewers",
      "Cultural review and adaptation",
      "Final review and delivery with comprehensive documentation"
    ]
  },
  "elearning-localization": {
    title: "eLearning Localization",
    description: "Course adaptation for global learners",
    image: "/tQhhiaQyUpCd.jpg",
    fullContent: "Create engaging learning experiences for international audiences. Our eLearning localization experts adapt your courses, ensuring cultural relevance and pedagogical effectiveness across different regions. We work with all major LMS platforms and understand the unique challenges of localizing interactive content, assessments, and multimedia elements. From SCORM packages to modern xAPI implementations, we ensure your courses deliver consistent learning outcomes globally.",
    benefits: [
      "Course content translation and cultural adaptation for maximum engagement",
      "Multimedia asset localization including videos, animations, and interactive elements",
      "Interactive element adaptation for different learning platforms and devices",
      "LMS integration and comprehensive testing across all major platforms",
      "Professional voice-over and subtitle services by native speakers",
      "Instructional design consultation for global learner success",
      "Assessment and quiz adaptation for cultural relevance",
      "Accessibility compliance ensuring inclusive learning for all users"
    ],
    process: [
      "Learning objectives analysis and course structure review",
      "Content translation and pedagogical adaptation",
      "Multimedia localization and cultural review",
      "LMS testing and integration verification",
      "Quality assurance and learner feedback collection",
      "Performance optimization and final deployment"
    ]
  },
  "audio-video-localization": {
    title: "Audio/Video Localization",
    description: "Dubbing, subtitles, and voice-over services",
    image: "/Solupedia-video-editing-localization.jpg",
    fullContent: "Bring your video content to life in any language. From professional dubbing to accurate subtitles, we provide complete audio and video localization services that maintain the emotional impact of your original content. Our state-of-the-art recording facilities and experienced voice talent network ensure your videos resonate with audiences worldwide. Whether you are localizing corporate training videos, marketing content, or entertainment material, we deliver broadcast-quality results.",
    benefits: [
      "Professional dubbing by native voice actors with broadcast experience",
      "Accurate subtitle and caption creation with proper timing and formatting",
      "Audio synchronization and sound design maintaining original emotional impact",
      "Cultural adaptation of visual elements and on-screen text",
      "Quality assurance and professional review by native speakers",
      "Multi-language support for global distribution and streaming",
      "Closed captioning and accessibility compliance",
      "Support for multiple video formats and delivery platforms"
    ],
    process: [
      "Script adaptation and localization for natural speech patterns",
      "Voice talent casting and professional recording sessions",
      "Audio editing, mixing, and synchronization",
      "Subtitle creation, timing, and formatting",
      "Visual element adaptation and on-screen text localization",
      "Final quality assurance and delivery in multiple formats"
    ]
  },
  "creation-solutions": {
    title: "Creation Solutions",
    description: "Innovative content creation and transformation services",
    image: "/Solupedia-creation-solutions.jpg",
    fullContent: "Welcome to Solupedia's creation solutions, where innovation meets expertise. Our team of experts understands the importance of creating high-quality materials that are ready for localization. From documents to eLearning courses and videos, we work with you to create content that is engaging, informative, and optimized for a global audience. Let us help you unleash the full potential of your content and drive results for your business.",
    benefits: [
      "Accessibility Compliance - Ensuring all materials meet accessibility standards for inclusive global audiences",
      "File Conversions - Converting files between different formats to optimize for localization workflows",
      "Forms and Interactive PDFs - Creating intelligent, interactive forms and ePDFs ready for multilingual deployment",
      "Transcription Services - Converting audio and video content to accurate text transcripts",
      "Subtitling with Timecodes - Creating properly timed subtitles for video content in multiple languages",
      "AI-Powered Content Creation - Leveraging advanced AI technology to create, enhance, and manipulate various content types",
      "eLearning Course Creation - Developing engaging, interactive courses optimized for global learners",
      "Document Creation and Preparation - Professional document creation ready for translation and localization",
      "Web-Based Content Development - Creating web-optimized content and documentation for digital platforms",
      "Video and Audio Production - Professional video and audio creation with localization in mind"
    ],
    process: [
      "Localization strategy development and roadmap creation",
      "Content creation with localization best practices",
      "Asset organization and management system setup",
      "Terminology database creation and maintenance",
      "Style guide development and documentation",
      "Team training and ongoing support",
      "Performance monitoring and continuous improvement"
    ]
  }
};

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:slug");
  const slug = params?.slug || "";
  const service = serviceDetails[slug];

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-8">The service you are looking for does not exist.</p>
        <Link href="/services">
          <Button>Back to Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl text-blue-100">{service.description}</p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <p className="text-lg text-gray-700 mb-8">{service.fullContent}</p>

              <h2 className="text-3xl font-bold mb-6">Key Benefits</h2>
              <div className="space-y-4 mb-12">
                {service.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-3xl font-bold mb-6">Our Process</h2>
              <div className="space-y-4">
                {service.process.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Ready to localize your {service.title.toLowerCase()}?
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Request a Quote
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
                  <CardTitle className="text-lg">Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>18+ years of industry experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>7,000+ successful projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>150+ languages supported</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Quality assurance guaranteed</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us discuss how our {service.title.toLowerCase()} services can help your business reach new markets.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Schedule a Consultation <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
