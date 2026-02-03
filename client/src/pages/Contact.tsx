import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Image for Contact page
const contactImage = "/On3htFLwCrvj.jpg";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: "",
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
        message: "",
      });
    },
    onError: error => {
      toast.error("Failed to submit form. Please try again.");
      console.error(error);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({
      ...formData,
      source: "contact_form",
    });
  };

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
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-6">
              Contact Us
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Let's discuss how we can help your business go global. Our team is
              ready to answer all your questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative z-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Phone",
                content: "+1 (910) 626-8525",
                sub: "Mon-Fri, 9AM-5PM EST",
                link: "tel:+19106268525",
              },
              {
                icon: Mail,
                title: "Email",
                content: "info@solupedia.com",
                sub: "We respond within 24 hours",
                link: "mailto:info@solupedia.com",
              },
              {
                icon: MapPin,
                title: "Office",
                content: "Covent Garden, London",
                sub: "71-75 Shelton Street, WC2H 9JQ",
                link: null,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-md text-center">
                    <CardContent className="pt-8 pb-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">
                          {item.content}
                        </p>
                      )}
                      <p className="text-gray-500 mt-2">{item.sub}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group hidden lg:block"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[600px]">
                <img
                  src={contactImage}
                  alt="Contact Us"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Let's Connect
                  </h3>
                  <p className="text-blue-100 text-lg mb-6">
                    Ready to expand globally? Our team is here to help.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Phone, text: "+1 (910) 626-8525" },
                      { icon: Mail, text: "info@solupedia.com" },
                      { icon: MapPin, text: "London, UK" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full"
                      >
                        <item.icon className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Service Type
                  </label>
                  <div className="relative">
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none"
                    >
                      <option value="">Select a service</option>
                      <option value="document-localization">
                        Document Localization
                      </option>
                      <option value="elearning-localization">
                        eLearning Localization
                      </option>
                      <option value="audio-video-localization">
                        Audio/Video Localization
                      </option>
                      <option value="creation-solutions">
                        Creation Solutions
                      </option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 4.5L6 8L9.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-lg font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all"
                >
                  {submitLead.isPending ? "Sending..." : "Send Message"}{" "}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20 relative z-10 bg-blue-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Why Partner With Us?
              </h2>
              <p className="text-gray-600">
                Experience the Solupedia difference
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Expert Team",
                  desc: "Our team of experienced localization professionals brings deep expertise across industries and languages.",
                },
                {
                  title: "Quality Assured",
                  desc: "Rigorous quality control processes ensure culturally appropriate and accurate localization every time.",
                },
                {
                  title: "Fast Turnaround",
                  desc: "Efficient workflows and project management enable quick delivery without compromising quality.",
                },
                {
                  title: "Global Reach",
                  desc: "Support for 150+ languages with deep understanding of cultural nuances and local markets.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                    <CardContent className="p-6 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10"
            >
              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">Quick Response</h3>
                      <p className="text-blue-100 leading-relaxed">
                        We typically respond to inquiries within 24 hours. For
                        urgent matters, please call us directly at +1 (910)
                        626-8525.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50/50 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Common questions about our services and process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "How long does a typical localization project take?",
                a: "Project timelines vary based on scope and complexity. Most projects take 2-8 weeks. We'll provide a detailed timeline during the consultation.",
              },
              {
                q: "What languages do you support?",
                a: "We support 150+ languages and regional variants. If you need a less common language, please contact us to discuss options.",
              },
              {
                q: "Do you offer rush services?",
                a: "Yes, we can accommodate rush projects. Additional fees may apply. Contact us to discuss your timeline.",
              },
              {
                q: "How do you ensure quality?",
                a: "We use a rigorous QA process including native speaker review, cultural adaptation verification, and client feedback.",
              },
              {
                q: "What's your pricing structure?",
                a: "Pricing depends on project scope, language pairs, and complexity. We provide custom quotes after understanding your needs.",
              },
              {
                q: "Can you handle confidential content?",
                a: "Absolutely. We maintain strict confidentiality and can sign NDAs as needed.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex gap-3 items-start">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <CardTitle className="text-lg text-gray-900 leading-snug">
                        {item.q}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 ml-8 leading-relaxed">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
