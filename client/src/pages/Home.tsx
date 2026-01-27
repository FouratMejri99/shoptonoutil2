import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Globe, BookOpen, Video, Zap, Users, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageLoader, PageSkeleton } from "@/components/PageLoader";

export default function Home() {
  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const { data: testimonials, isLoading: testimonialsLoading } = trpc.testimonials.featured.useQuery();
  const { data: caseStudies, isLoading: caseStudiesLoading } = trpc.caseStudies.featured.useQuery();

  const isLoading = servicesLoading || testimonialsLoading || caseStudiesLoading;

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Break Language Barriers, Expand Your Global Reach
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Professional localization solutions that help your content resonate with audiences worldwide. From documents to eLearning, we have got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/lead-magnet">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-800 w-full sm:w-auto">
                    Download Free Guide
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="/QRRik675gBAy.webp" 
                alt="Global Business Languages"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">18+</div>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">7,000+</div>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <p className="text-gray-600">Satisfied Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <p className="text-gray-600">Languages Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive localization solutions tailored to your industry and content type
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: BookOpen, title: "Document Localization", desc: "Professional translation and desktop publishing", image: "/Solupedia-document-localization.jpg" },
              { icon: Video, title: "Audio/Video Localization", desc: "Dubbing, subtitles, and voice-over services", image: "/Solupedia-video-editing-localization.jpg" },
              { icon: Zap, title: "eLearning Localization", desc: "Course adaptation for global learners", image: "/tQhhiaQyUpCd.jpg" },
              { icon: Globe, title: "Creation Solutions", desc: "Content creation optimized for localization", image: "/Solupedia-creation-solutions.jpg" },
            ].map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition overflow-hidden">
                <div className="h-32 bg-gray-200 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
                <CardHeader>
                  <service.icon className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                  <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="link" className="p-0">Learn More <ArrowRight size={16} className="ml-2" /></Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button size="lg" variant="outline">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Solupedia?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Expert Team", desc: "Localization engineers, translators, and content specialists with deep industry expertise" },
              { icon: Award, title: "Quality Assured", desc: "Rigorous quality control processes ensuring culturally appropriate and accurate localization" },
              { icon: Zap, title: "Fast Turnaround", desc: "Efficient workflows and project management for timely delivery without compromising quality" },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <item.icon className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">{testimonial.content}</p>
                    <p className="font-semibold text-gray-900">{testimonial.clientName}</p>
                    <p className="text-sm text-gray-600">{testimonial.clientCompany}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies Preview */}
      {caseStudies && caseStudies.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Case Studies</h2>
              <p className="text-xl text-gray-600">See how we have helped businesses expand globally</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {caseStudies.slice(0, 2).map((study) => (
                <Card key={study.id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle>{study.title}</CardTitle>
                    <CardDescription>{study.industry}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{study.solution}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Challenge</p>
                        <p className="font-semibold text-gray-900">{study.challenge}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Result</p>
                        <p className="font-semibold text-blue-600">{study.results}</p>
                      </div>
                    </div>
                    <Link href={`/case-studies/${study.id}`}>
                      <Button variant="link" className="p-0">Read Full Case Study <ArrowRight size={16} className="ml-2" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/case-studies">
                <Button size="lg" variant="outline">View All Case Studies</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Global?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us help you reach new markets with professional localization solutions tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/lead-magnet">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Download Our Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
