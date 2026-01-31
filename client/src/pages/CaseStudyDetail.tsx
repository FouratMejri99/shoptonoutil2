import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award, CheckCircle2, Quote, Building2, Globe, Wrench, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageLoader } from "@/components/PageLoader";
import { motion } from "framer-motion";

export default function CaseStudyDetail() {
  const [, params] = useRoute("/case-studies/:slug");
  const slug = params?.slug || "";
  const { data: caseStudy, isLoading } = trpc.caseStudies.bySlug.useQuery(slug, { enabled: !!slug });

  if (isLoading) {
    return <PageLoader fullScreen size="lg" />;
  }

  if (!caseStudy) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 p-8 bg-white/50 backdrop-blur-lg rounded-3xl border border-gray-100 shadow-xl"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Case Study Not Found</h1>
          <p className="text-gray-600 mb-8">The case study you're looking for doesn't exist.</p>
          <Link href="/case-studies">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 h-12 px-8">Back to Case Studies</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50 backdrop-blur-3xl -z-10"></div>
        <div className="container mx-auto px-4">
          <Link href="/case-studies">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 cursor-pointer group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Case Studies
            </motion.div>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-6">
              Client Success Story
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              {caseStudy.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 flex items-center gap-2">
              <span className="font-semibold text-blue-600">Client:</span> {caseStudy.clientName}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {caseStudy.imageUrl && (
                <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl relative group">
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  <img 
                    src={caseStudy.imageUrl} 
                    alt={caseStudy.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/20 shadow-lg mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Project Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Building2 size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wider">Industry</span>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{caseStudy.industry || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Globe size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wider">Region</span>
                    </div>
                    <p className="text-lg font-medium text-gray-900">Global</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Wrench size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wider">Service</span>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{caseStudy.serviceType || "Localization"}</p>
                  </div>
                </div>
              </div>

              {caseStudy.challenge && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">The Challenge</h2>
                  <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed">
                    <p>{caseStudy.challenge}</p>
                  </div>
                </div>
              )}

              {caseStudy.solution && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Solution</h2>
                  <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed">
                    <p>{caseStudy.solution}</p>
                  </div>
                </div>
              )}

              {caseStudy.results && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="mb-12 bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-8 md:p-10 rounded-3xl shadow-sm"
                >
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                    <Award className="text-blue-600" /> Key Results
                  </h2>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={24} />
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">{caseStudy.results}</p>
                  </div>
                </motion.div>
              )}

              {caseStudy.testimonial && (
                <div className="relative p-10 md:p-12 rounded-3xl bg-blue-900 text-white overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-20"></div>
                  
                  <Quote className="text-blue-400 mb-6 w-12 h-12 opacity-50" />
                  <blockquote className="text-2xl font-light italic mb-8 relative z-10 leading-relaxed">
                    "{caseStudy.testimonial}"
                  </blockquote>
                  <div className="relative z-10 border-t border-blue-800 pt-6">
                    <p className="font-bold text-xl">{caseStudy.testimonialAuthor}</p>
                    {caseStudy.testimonialRole && (
                      <p className="text-blue-200">{caseStudy.testimonialRole}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="sticky top-32 space-y-8">
                <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl rounded-3xl overflow-hidden border-none">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
                    <CardTitle className="text-white text-xl">Get Similar Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      Interested in how we can help your business achieve similar success? Let's discuss your project.
                    </p>
                    <Link href="/contact">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-full text-base font-semibold shadow-lg transition-all hover:shadow-xl">
                        Request a Consultation
                      </Button>
                    </Link>
                    <Link href="/services">
                      <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold border-2 hover:bg-gray-50">
                        View Our Services
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {caseStudy.clientLogo && (
                  <div className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-lg flex items-center justify-center">
                    <img src={caseStudy.clientLogo} alt={caseStudy.clientName} className="max-w-full h-auto max-h-24 opacity-80 grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* More Case Studies */}
      <section className="py-24 relative z-10 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">More Success Stories</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">Explore other projects where we've helped clients achieve their global goals.</p>
          <Link href="/case-studies">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-10 border-2 text-blue-600 border-blue-100 hover:border-blue-600 hover:bg-blue-50 text-lg font-semibold">
                View All Case Studies <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-900 to-blue-800 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Start Your Project?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Let's discuss how Solupedia can help you achieve your localization goals with our expert solutions.
              </p>
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 h-14 px-10 rounded-full text-lg font-bold shadow-lg">
                    Get Started <ArrowRight className="ml-2" size={20} />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
