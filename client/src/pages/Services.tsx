import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Video, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const servicesData = [
  {
    slug: "document-localization",
    title: "Document Localization",
    icon: BookOpen,
    image: "/Solupedia-document-localization.jpg",
    shortDesc: "Professional translation and desktop publishing",
    fullDesc: "Transform your documents for global audiences with our comprehensive document localization services. We handle everything from translation to formatting, ensuring your content maintains its impact across languages and cultures.",
    features: [
      "Professional translation by native speakers",
      "Desktop publishing and formatting",
      "Cultural adaptation and transcreation",
      "Quality assurance and proofreading",
      "Support for 150+ languages",
      "Fast turnaround times"
    ]
  },
  {
    slug: "elearning-localization",
    title: "eLearning Localization",
    icon: Zap,
    image: "/tQhhiaQyUpCd.jpg",
    shortDesc: "Course adaptation for global learners",
    fullDesc: "Create engaging learning experiences for international audiences. Our eLearning localization experts adapt your courses, ensuring cultural relevance and pedagogical effectiveness across different regions.",
    features: [
      "Course content translation and adaptation",
      "Multimedia asset localization",
      "Interactive element adaptation",
      "LMS integration and testing",
      "Voice-over and subtitle services",
      "Instructional design consultation"
    ]
  },
  {
    slug: "audio-video-localization",
    title: "Audio/Video Localization",
    icon: Video,
    image: "/Solupedia-video-editing-localization.jpg",
    shortDesc: "Dubbing, subtitles, and voice-over services",
    fullDesc: "Bring your video content to life in any language. From professional dubbing to accurate subtitles, we provide complete audio and video localization services that maintain the emotional impact of your original content.",
    features: [
      "Professional dubbing and voice-over",
      "Subtitle and caption creation",
      "Audio synchronization",
      "Cultural adaptation of visual elements",
      "Quality assurance and review",
      "Multi-language support"
    ]
  },
  {
    slug: "creation-solutions",
    title: "Creation Solutions",
    icon: Globe,
    image: "/Solupedia-creation-solutions.jpg",
    shortDesc: "Content creation optimized for localization",
    fullDesc: "Start your global journey with content designed for localization from the ground up. Our creation solutions help you develop materials that are inherently easier to translate and adapt.",
    features: [
      "Localization-friendly content creation",
      "Multilingual project planning",
      "Asset management and organization",
      "Terminology database development",
      "Style guide creation",
      "Ongoing localization support"
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Services() {
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
              Comprehensive localization solutions tailored to your industry and content type, helping you connect with audiences worldwide.
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
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
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
                        <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                      </div>
                      
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {service.fullDesc}
                      </p>

                      <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Key Features:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.features.map((feature, i) => (
                            <motion.div 
                              key={i} 
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: 0.3 + (i * 0.05) }}
                            >
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-600 text-sm">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <Link href={`/services/${service.slug}`}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Industries We Serve</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Specialized expertise across diverse sectors, ensuring accurate terminology and compliance.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { name: "Healthcare & Medical", desc: "Localization for medical devices, pharmaceuticals, and healthcare services" },
              { name: "Legal & Compliance", desc: "Precise localization for legal documents and regulatory content" },
              { name: "Technology", desc: "Software, SaaS, and tech product localization" },
              { name: "Finance & Banking", desc: "Secure localization for financial services and banking" },
              { name: "E-Learning & Education", desc: "Educational content and course localization" },
              { name: "Marketing & Media", desc: "Creative localization for marketing campaigns and media content" },
            ].map((industry, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-900">{industry.name}</CardTitle>
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
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Localization Process</h2>
            <p className="text-xl text-gray-600">A systematic approach to ensure quality and consistency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Analysis", desc: "We analyze your content and requirements to determine the best approach." },
              { step: "02", title: "Planning", desc: "Develop a customized localization strategy and select the right team." },
              { step: "03", title: "Execution", desc: "Professional translation, localization, and formatting by experts." },
              { step: "04", title: "QA & Delivery", desc: "Rigorous quality assurance, testing, and final delivery." },
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
                    <h3 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Localize Your Content?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Let's discuss which services are right for your project and how we can help you expand globally.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
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
