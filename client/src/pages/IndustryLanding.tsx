import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

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
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Industry Not Found</h1>
        <p className="text-gray-600 mb-8">The industry page you're looking for doesn't exist.</p>
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
          <h1 className="text-5xl font-bold mb-4">{data.name}</h1>
          <p className="text-xl text-blue-100">{data.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Industry Challenges</h2>
              <div className="space-y-4">
                {data.challenges.map((challenge: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 font-bold">!</span>
                    </div>
                    <p className="text-gray-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Our Solutions</h2>
              <div className="space-y-4">
                {data.solutions.map((solution: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industries We Serve */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Who We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.industries.map((ind: string, idx: number) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <p className="text-lg font-semibold text-gray-900">{ind}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Case Studies */}
          <div className="bg-gray-50 p-8 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-6">Success Stories</h2>
            <p className="text-gray-700 mb-6">
              We've successfully completed numerous {data.name.toLowerCase()} projects. View our case studies to see how we've helped similar organizations expand globally.
            </p>
            <Link href="/case-studies">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Case Studies <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Our Services for {data.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Document Localization", desc: "Professional translation and formatting for industry-specific documents" },
                { title: "eLearning Localization", desc: "Training and educational content adapted for global audiences" },
                { title: "Audio/Video Localization", desc: "Professional dubbing and subtitles for video content" },
                { title: "Creation Solutions", desc: "Content creation optimized for localization from the start" }
              ].map((service, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{service.desc}</p>
                    <Link href={`/services/${service.title.toLowerCase().replace(/\\s+/g, '-')}`}>
                      <Button variant="link" className="p-0">Learn More <ArrowRight size={16} className="ml-2" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Expand into New Markets?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how our industry-specific localization expertise can help your {data.name.toLowerCase()} business succeed globally.
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
