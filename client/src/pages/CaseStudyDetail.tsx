import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageLoader } from "@/components/PageLoader";

export default function CaseStudyDetail() {
  const [, params] = useRoute("/case-studies/:slug");
  const slug = params?.slug || "";
  const { data: caseStudy, isLoading } = trpc.caseStudies.bySlug.useQuery(slug, { enabled: !!slug });

  if (isLoading) {
    return <PageLoader fullScreen size="lg" />;
  }

  if (!caseStudy) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
        <p className="text-gray-600 mb-8">The case study you're looking for doesn't exist.</p>
        <Link href="/case-studies">
          <Button>Back to Case Studies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{caseStudy.title}</h1>
          <p className="text-xl text-blue-100">Client: {caseStudy.clientName}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              {caseStudy.imageUrl && (
                <div className="w-full h-96 bg-gray-300 rounded-lg overflow-hidden mb-8">
                  <img src={caseStudy.imageUrl} alt={caseStudy.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-gray-50 p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Client</p>
                    <p className="text-lg font-semibold text-gray-900">{caseStudy.clientName}</p>
                  </div>
                  {caseStudy.industry && (
                    <div>
                      <p className="text-gray-600 text-sm">Industry</p>
                      <p className="text-lg font-semibold text-gray-900">{caseStudy.industry}</p>
                    </div>
                  )}
                  {caseStudy.serviceType && (
                    <div>
                      <p className="text-gray-600 text-sm">Service Type</p>
                      <p className="text-lg font-semibold text-gray-900">{caseStudy.serviceType}</p>
                    </div>
                  )}
                </div>
              </div>

              {caseStudy.challenge && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                  <p className="text-gray-700 text-lg">{caseStudy.challenge}</p>
                </div>
              )}

              {caseStudy.solution && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
                  <p className="text-gray-700 text-lg">{caseStudy.solution}</p>
                </div>
              )}

              {caseStudy.results && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Results</h2>
                  <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                    <p className="text-gray-700 text-lg">{caseStudy.results}</p>
                  </div>
                </div>
              )}

              {caseStudy.testimonial && (
                <div className="bg-blue-50 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">Client Testimonial</h2>
                  <blockquote className="text-lg text-gray-700 italic mb-4">
                    "{caseStudy.testimonial}"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900">{caseStudy.testimonialAuthor}</p>
                    {caseStudy.testimonialRole && (
                      <p className="text-gray-600">{caseStudy.testimonialRole}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Get Similar Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Interested in how we can help your business achieve similar success?
                  </p>
                  <Link href="/contact">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Request a Consultation
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="w-full">
                      View Our Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {caseStudy.clientLogo && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Client Logo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={caseStudy.clientLogo} alt={caseStudy.clientName} className="w-full h-auto" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* More Case Studies */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">More Success Stories</h2>
          <p className="text-gray-600 mb-8">Explore other projects we've completed</p>
          <Link href="/case-studies">
            <Button size="lg" variant="outline">
              View All Case Studies <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how Solupedia can help you achieve your localization goals.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
