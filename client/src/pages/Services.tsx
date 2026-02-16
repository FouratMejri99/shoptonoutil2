import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

// Static fallback data for services
const staticServicesData = [
  {
    slug: "elearning-engineering",
    title: "eLearning Engineering",
    icon: BookOpen,
    image: "/tQhhiaQyUpCd.jpg",
    shortDesc:
      "Storyline development and deep technical localization for interactive training",
    fullDesc:
      "Our eLearning Engineering service provides comprehensive solutions for developing and localizing interactive training content. From Storyline development to deep technical localization, we ensure your training materials engage learners across all languages and cultures.",
    features: [
      "Storyline development and customization",
      "Deep technical localization",
      "Interactive element adaptation",
      "SCORM compliance and LMS integration",
      "Accessibility compliance (WCAG)",
      "Multi-language asset management",
    ],
  },
  {
    slug: "media-localization",
    title: "Media Localization",
    icon: Video,
    image: "/Solupedia-video-editing-localization.jpg",
    shortDesc:
      "OST, subtitling, voiceover, and AI-assisted services for multimedia",
    fullDesc:
      "Our Media Localization service covers all aspects of multimedia content adaptation. From original sound track (OST) production to subtitling, voiceover, and AI-assisted services, we bring your video content to life in any language.",
    features: [
      "Original Sound Track (OST) production",
      "Professional subtitling",
      "Voice-over and dubbing",
      "AI-assisted translation",
      "Audio synchronization",
      "Cultural adaptation of visual elements",
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    icon: Zap,
    image: "/Solupedia-document-localization.jpg",
    shortDesc:
      "EAA enforcement, remediation, and standards compliance for all content",
    fullDesc:
      "Our Accessibility service ensures your content meets all major accessibility standards including EAA (European Accessibility Act), WCAG, and Section 508. We provide comprehensive remediation services to make your content accessible to everyone.",
    features: [
      "EAA compliance",
      "WCAG 2.1 remediation",
      "Section 508 compliance",
      "PDF accessibility",
      "Video captioning and audio description",
      "Accessibility testing and auditing",
    ],
  },
  {
    slug: "document-dtp",
    title: "Document & DTP",
    icon: Globe,
    image: "/0.jpg",
    shortDesc: "RTL expertise, graphics localization, and template management",
    fullDesc:
      "Our Document & DTP service handles all aspects of document localization including RTL (right-to-left) language support, graphics localization, and professional template management. We ensure your documents look perfect in every language.",
    features: [
      "RTL language support (Arabic, Hebrew, etc.)",
      "Graphics localization",
      "Template management",
      "Desktop publishing",
      "Multi-format output (PDF, Word, etc.)",
      "Format preservation",
    ],
  },
  {
    slug: "content-creation",
    title: "Content Creation",
    icon: FileText,
    image: "/Solupedia-document-localization.jpg",
    shortDesc:
      "Build once, localize efficiently - 40-60% cost savings with our methodology",
    fullDesc:
      "Our Content Creation service is designed from the ground up for efficient localization. By following our proven methodology, you can achieve 40-60% cost savings while maintaining high quality across all languages.",
    features: [
      "Localization-friendly authoring",
      "Internationalization consulting",
      "Terminology management",
      "Style guide development",
      "Translation memory optimization",
      "Continuous localization workflow",
    ],
  },
  {
    slug: "ai-workflows",
    title: "AI Workflows",
    icon: Users,
    image: "/AIWorkflows.jpg",
    shortDesc:
      "AI at every pipeline stage with intelligent tiering for maximum efficiency",
    fullDesc:
      "Our AI Workflows service integrates artificial intelligence at every stage of the localization pipeline. With intelligent tiering, we optimize the balance between AI efficiency and human quality for the best results.",
    features: [
      "AI-powered translation",
      "Intelligent content tiering",
      "Machine translation post-editing",
      "AI-assisted quality assurance",
      "Predictive terminology",
      "Automated workflow orchestration",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Merge database services with static data for additional fields
export default function Services() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch services from database with refresh key
  const queryResult = trpc.services.list.useQuery({ _t: refreshKey } as any) as any;
  const dbServices = queryResult?.data;
  
  // If there are database services, use them primarily
  let servicesData: any[] = [];
  
  if (dbServices && dbServices.length > 0) {
    // Use database services as the source of truth
    servicesData = dbServices.map((dbService: any) => {
      // Find matching static service for features and icon
      const staticMatch = staticServicesData.find((s: any) => s.slug === dbService.slug);
      return {
        slug: dbService.slug,
        title: dbService.name,
        shortDesc: dbService.shortDescription || dbService.shortdescription,
        fullDesc: dbService.description,
        image: dbService.image || staticMatch?.image || "/placeholder-service.jpg",
        icon: staticMatch?.icon || BookOpen,
        features: staticMatch?.features || [],
        orderIndex: dbService.orderindex || dbService.orderIndex || 0,
      };
    });
    
    // Sort by orderindex
    servicesData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  } else {
    // Fallback to static data
    servicesData = staticServicesData;
  }

  // Refresh data when page becomes visible (e.g., after admin update)
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        setRefreshKey(k => k + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50 backdrop-blur-3xl -z-10"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-6">
              Our Expertise
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Comprehensive localization solutions tailored to your industry and
              content type, helping you connect with audiences worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {servicesData.map((service, idx) => {
              const Icon = service.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
                >
                  <div className="flex-1 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                          <Icon className="w-7 h-7" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {service.title}
                        </h2>
                      </div>

                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {service.fullDesc}
                      </p>

                      <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">
                          Key Features:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(service.features || []).map((feature: string, i: number) => (
                            <motion.div
                              key={i}
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + i * 0.05,
                              }}
                            >
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 text-xs font-bold">
                                  ✓
                                </span>
                              </div>
                              <span className="text-gray-600 text-sm">
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <Link href={`/services/${service.slug}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base">
                            Learn More <ArrowRight className="ml-2" size={18} />
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>

                  <motion.div
                    className="flex-1 w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-60"></div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 relative z-10 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized expertise across diverse sectors, ensuring accurate
              terminology and compliance.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Healthcare & Medical",
                desc: "Localization for medical devices, pharmaceuticals, and healthcare services",
              },
              {
                name: "Legal & Compliance",
                desc: "Precise localization for legal documents and regulatory content",
              },
              {
                name: "Technology",
                desc: "Software, SaaS, and tech product localization",
              },
              {
                name: "Finance & Banking",
                desc: "Secure localization for financial services and banking",
              },
              {
                name: "E-Learning & Education",
                desc: "Educational content and course localization",
              },
              {
                name: "Marketing & Media",
                desc: "Creative localization for marketing campaigns and media content",
              },
            ].map((industry, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900">
                      {industry.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{industry.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Our Localization Process
            </h2>
            <p className="text-xl text-gray-600">
              A systematic approach to ensure quality and consistency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Analysis",
                desc: "We analyze your content and requirements to determine the best approach.",
              },
              {
                step: "02",
                title: "Planning",
                desc: "Develop a customized localization strategy and select the right team.",
              },
              {
                step: "03",
                title: "Execution",
                desc: "Professional translation, localization, and formatting by experts.",
              },
              {
                step: "04",
                title: "QA & Delivery",
                desc: "Rigorous quality assurance, testing, and final delivery.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow relative z-10">
                  <div className="text-6xl font-bold text-blue-50 mb-6 absolute top-4 right-4 z-0 select-none">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-lg shadow-blue-600/30">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[3rem] overflow-hidden bg-blue-600 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

            <div className="relative z-10 p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Localize Your Content?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Let's discuss which services are right for your project and how
                we can help you expand globally.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get a Free Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
