import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageLoader, PageSkeleton } from "@/components/PageLoader";
import { motion } from "framer-motion";

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = trpc.caseStudies.list.useQuery();

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
              Success Stories
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">
              Case Studies
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover how we've helped leading organizations overcome complex localization challenges and achieve global success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-gray-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : caseStudies && caseStudies.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {caseStudies.map((study) => (
                <motion.div key={study.id} variants={itemVariants}>
                  <Link href={`/case-studies/${study.slug}`}>
                    <Card className="group h-full bg-white/80 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden cursor-pointer border">
                      {study.imageUrl && (
                        <div className="w-full h-56 overflow-hidden relative">
                          <img 
                            src={study.imageUrl} 
                            alt={study.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <span className="text-white flex items-center gap-2 font-medium">
                              View Details <ExternalLink size={16} />
                            </span>
                          </div>
                          {study.industry && (
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                {study.industry}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <CardHeader className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-semibold text-blue-600">{study.clientName}</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {study.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 space-y-4">
                        {study.solution && (
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {study.solution}
                          </p>
                        )}
                        {study.results && (
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 text-[10px] font-bold">✓</span>
                              </div>
                              <p className="text-blue-900 text-sm font-bold">
                                {study.results}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-gray-300"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Case Studies Yet</h3>
              <p className="text-gray-600">Our success stories are being prepared. Check back soon!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Be Our Next Success Story?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Let's discuss how Solupedia can help your business achieve its global expansion goals with precision and scale.
              </p>
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 rounded-full text-lg font-bold shadow-lg">
                    Start Your Project <ArrowRight className="ml-2" size={20} />
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
