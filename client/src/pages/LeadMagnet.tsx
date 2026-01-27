import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, BookOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function LeadMagnet() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Check your email for the guide.");
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", company: "" });
        setSubmitted(false);
      }, 3000);
    },
    onError: (error) => {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({
      ...formData,
      source: "lead_magnet"
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">The Ultimate Guide to eLearning Localization</h1>
          <p className="text-xl text-blue-100">
            Master the essentials of localizing educational content for global audiences
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
                <h2 className="text-3xl font-bold">What You'll Learn</h2>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "The fundamentals of eLearning localization",
                  "Cultural adaptation strategies for educational content",
                  "Best practices for multimedia localization",
                  "Technical considerations for LMS integration",
                  "Quality assurance processes for learning content",
                  "Common pitfalls and how to avoid them",
                  "ROI calculation for localization projects",
                  "Future trends in global learning"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Guide Includes:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ 40+ pages of expert insights</li>
                  <li>✓ Real-world case studies</li>
                  <li>✓ Practical checklists</li>
                  <li>✓ Industry best practices</li>
                  <li>✓ Resource recommendations</li>
                </ul>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Download size={24} />
                    Download Your Free Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                      <p className="text-gray-700">
                        Check your email for the guide. It should arrive in a few moments.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                          placeholder="john@company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                          placeholder="Your Company"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitLead.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                        size="lg"
                      >
                        <Download className="mr-2" size={20} />
                        {submitLead.isPending ? "Sending..." : "Get Free Guide"}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        We respect your privacy. Unsubscribe anytime.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Limited Time:</strong> Get instant access to the guide plus exclusive tips and resources delivered to your inbox.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Guide */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why This Guide?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              eLearning localization is complex. This guide cuts through the confusion and provides actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Save Time",
                desc: "Learn from our 18 years of experience. Avoid common mistakes and accelerate your localization timeline."
              },
              {
                title: "Reduce Costs",
                desc: "Understand best practices that help you optimize your localization budget and maximize ROI."
              },
              {
                title: "Expand Globally",
                desc: "Get the knowledge you need to successfully launch your eLearning content in new markets."
              }
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About the Author */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">About the Author</h2>
            <div className="bg-blue-50 p-8 rounded-lg">
              <p className="text-gray-700 mb-4">
                This guide was created by the Solupedia team, industry leaders with nearly two decades of experience in localization. We've worked with hundreds of organizations to successfully localize their eLearning content for global audiences.
              </p>
              <p className="text-gray-700">
                Our expertise spans multiple industries including technology, healthcare, finance, and education. We've learned what works, what doesn't, and how to navigate the complexities of global learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Localize Your eLearning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            After reading the guide, let's discuss how Solupedia can help you bring your courses to global audiences.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = "/contact"}
          >
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}
