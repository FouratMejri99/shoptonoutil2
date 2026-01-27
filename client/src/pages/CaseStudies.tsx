import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageLoader, PageSkeleton } from "@/components/PageLoader";

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = trpc.caseStudies.list.useQuery();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-blue-100">
            See how we've helped businesses achieve their global expansion goals
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <PageSkeleton />
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study) => (
                <Link key={study.id} href={`/case-studies/${study.slug}`}>
                  <Card className="h-full hover:shadow-lg transition cursor-pointer">
                    {study.imageUrl && (
                      <div className="w-full h-48 bg-gray-300 rounded-t-lg overflow-hidden">
                        <img src={study.imageUrl} alt={study.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{study.title}</CardTitle>
                      <div className="text-sm text-gray-600 mt-2">
                        <p className="font-semibold">{study.clientName}</p>
                        {study.industry && <p>{study.industry}</p>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {study.solution && (
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">{study.solution}</p>
                      )}
                      {study.results && (
                        <p className="text-blue-600 text-sm font-semibold">Results: {study.results}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No case studies available yet.</p>
              <p className="text-gray-600">Check back soon for our latest success stories.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Be Our Next Success Story?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how Solupedia can help your business achieve its global expansion goals.
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
