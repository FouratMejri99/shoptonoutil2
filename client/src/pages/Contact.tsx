import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: ""
  });

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceType: "",
        message: ""
      });
    },
    onError: (error) => {
      toast.error("Failed to submit form. Please try again.");
      console.error(error);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({
      ...formData,
      source: "contact_form"
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100">
            Let's discuss how we can help your business go global
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Phone className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+1910626852" className="text-lg font-semibold text-blue-600 hover:underline">
                  +1 (910) 626-8525
                </a>
                <p className="text-gray-600 text-sm mt-2">Available Monday-Friday, 9AM-5PM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:info@solupedia.com" className="text-lg font-semibold text-blue-600 hover:underline">
                  info@solupedia.com
                </a>
                <p className="text-gray-600 text-sm mt-2">We respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Office</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-semibold">
                  71-75 Shelton Street<br />
                  Covent Garden, London<br />
                  WC2H 9JQ, UK
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Select a service</option>
                    <option value="document-localization">Document Localization</option>
                    <option value="elearning-localization">eLearning Localization</option>
                    <option value="audio-video-localization">Audio/Video Localization</option>
                    <option value="creation-solutions">Creation Solutions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {submitLead.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Info Section */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Solupedia?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Expert Team</h3>
                  <p className="text-gray-700">
                    Our team of experienced localization professionals brings deep expertise across industries and languages.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
                  <p className="text-gray-700">
                    Rigorous quality control processes ensure culturally appropriate and accurate localization every time.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Fast Turnaround</h3>
                  <p className="text-gray-700">
                    Efficient workflows and project management enable quick delivery without compromising quality.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Global Reach</h3>
                  <p className="text-gray-700">
                    Support for 150+ languages with deep understanding of cultural nuances and local markets.
                  </p>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <Clock className="w-8 h-8 text-blue-600 mb-2" />
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      We typically respond to inquiries within 24 hours. For urgent matters, please call us directly.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "How long does a typical localization project take?",
                a: "Project timelines vary based on scope and complexity. Most projects take 2-8 weeks. We'll provide a detailed timeline during the consultation."
              },
              {
                q: "What languages do you support?",
                a: "We support 150+ languages and regional variants. If you need a less common language, please contact us to discuss options."
              },
              {
                q: "Do you offer rush services?",
                a: "Yes, we can accommodate rush projects. Additional fees may apply. Contact us to discuss your timeline."
              },
              {
                q: "How do you ensure quality?",
                a: "We use a rigorous QA process including native speaker review, cultural adaptation verification, and client feedback."
              },
              {
                q: "What's your pricing structure?",
                a: "Pricing depends on project scope, language pairs, and complexity. We provide custom quotes after understanding your needs."
              },
              {
                q: "Can you handle confidential content?",
                a: "Absolutely. We maintain strict confidentiality and can sign NDAs as needed."
              }
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
