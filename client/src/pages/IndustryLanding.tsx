import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const industryData: Record<string, any> = {
  medical: {
    name: "Healthcare & Medical Localization",
    description: "Specialized localization for medical devices, pharmaceuticals, and healthcare services",
    challenges: [
      "Complex medical terminology requiring precise translation",
      "Regulatory compliance across different regions",
      "Cultural sensitivity in healthcare communications",
      "Accuracy critical for patient safety"
    ],
    solutions: [
      "Expert medical translators with subject matter expertise",
      "Compliance with international medical standards (ISO 13485, etc.)",
      "Cultural adaptation of healthcare content",
      "Rigorous quality assurance and regulatory review"
    ],
    industries: [
      "Medical Device Manufacturers",
      "Pharmaceutical Companies",
      "Healthcare Providers",
      "Medical Software Companies"
    ]
  },
  legal: {
    name: "Legal & Compliance Localization",
    description: "Precise localization for legal documents and regulatory content",
    challenges: [
      "Legal terminology varies by jurisdiction",
      "Compliance with local regulations",
      "Maintaining legal accuracy across languages",
      "Document formatting and certification requirements"
    ],
    solutions: [
      "Certified legal translators with jurisdiction expertise",
      "Compliance verification with local regulations",
      "Legal document formatting and certification",
      "Comprehensive quality assurance"
    ],
    industries: [
      "Law Firms",
      "Financial Institutions",
      "Government Agencies",
      "Compliance Officers"
    ]
  },
  technology: {
    name: "Technology Localization",
    description: "Software, SaaS, and tech product localization",
    challenges: [
      "Technical terminology and user interface elements",
      "Maintaining consistency across platforms",
      "Cultural adaptation of tech content",
      "Rapid product updates and iterations"
    ],
    solutions: [
      "Tech-savvy translators with software expertise",
      "Terminology database management",
      "UI/UX localization for different markets",
      "Agile localization workflows"
    ],
    industries: [
      "Software Companies",
      "SaaS Providers",
      "Tech Startups",
      "Mobile App Developers"
    ]
  }
};

export default function IndustryLanding() {
  const [, params] = useRoute("/industries/:industry");
  const industry = params?.industry || "";
  const data = industryData[industry];

  if (!data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
        {/* Background Blobs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Industry Not Found</h1>
          <p className="text-gray-600 mb-8">The industry page you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              Industry Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">
              {data.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {data.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Industry Challenges</h2>
              <div className="space-y-6">
                {data.challenges.map((challenge: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <span className="text-red-600 font-bold text-sm">!</span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{challenge}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 text-white">Our Solutions</h2>
                <div className="space-y-6">
                  {data.solutions.map((solution: string, idx: number) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-blue-500/50 rounded-full flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-blue-50 text-lg leading-relaxed">{solution}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Industries We Serve */}
          <div className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Who We Serve</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Trusted by leading organizations in the {data.name.toLowerCase()} sector</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.industries.map((ind: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center justify-center h-full min-h-[120px] text-center">
                      <p className="text-lg font-bold text-blue-900">{ind}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Case Studies */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-8 md:p-12 rounded-3xl mb-20 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Success Stories</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We've successfully completed numerous {data.name.toLowerCase()} projects. View our case studies to see how we've helped similar organizations expand globally.
              </p>
              <Link href="/case-studies">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
                  View Case Studies <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Services */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Services for {data.name}</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Document Localization", desc: "Professional translation and formatting for industry-specific documents" },
                { title: "eLearning Localization", desc: "Training and educational content adapted for global audiences" },
                { title: "Audio/Video Localization", desc: "Professional dubbing and subtitles for video content" },
                { title: "Creation Solutions", desc: "Content creation optimized for localization from the start" }
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm group">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{service.desc}</p>
                      <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="link" className="p-0 text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-1 transition-transform">
                          Learn More <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden bg-blue-600 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Expand into New Markets?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Let's discuss how our industry-specific localization expertise can help your {data.name.toLowerCase()} business succeed globally.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
                  Get Started <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
