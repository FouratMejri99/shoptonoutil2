import { PageSkeleton } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  FileText,
  Globe,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: services, isLoading: servicesLoading } =
    trpc.services.list.useQuery();
  const { data: testimonials, isLoading: testimonialsLoading } =
    trpc.testimonials.list.useQuery();
  const { data: caseStudies, isLoading: caseStudiesLoading } =
    trpc.caseStudies.list.useQuery();

  const isLoading =
    servicesLoading || testimonialsLoading || caseStudiesLoading;

  // Show skeleton while loading, but only for initial load
  if (isLoading) {
    return <PageSkeleton />;
  }

  // Static fallback data if database queries fail or return empty
  const staticServices = [
    {
      id: 1,
      name: "eLearning Engineering",
      slug: "elearning-engineering",
      shortDescription:
        "Storyline development and deep technical localization for interactive training.",
      icon: "BookOpen",
    },
    {
      id: 2,
      name: "Media Localization",
      slug: "media-localization",
      shortDescription:
        "OST, subtitling, voiceover, and AI-assisted services for multimedia.",
      icon: "Video",
    },
    {
      id: 3,
      name: "Accessibility",
      slug: "accessibility",
      shortDescription:
        "EAA enforcement, remediation, and standards compliance for all content.",
      icon: "Zap",
    },
    {
      id: 4,
      name: "Document & DTP",
      slug: "document-dtp",
      shortDescription:
        "RTL expertise, graphics localization, and template management.",
      icon: "Globe",
    },
    {
      id: 5,
      name: "Content Creation",
      slug: "content-creation",
      shortDescription:
        "Build once, localize efficiently - 40-60% cost savings with our methodology.",
      icon: "FileText",
    },
    {
      id: 6,
      name: "AI Workflows",
      slug: "ai-workflows",
      shortDescription:
        "AI at every pipeline stage with intelligent tiering for maximum efficiency.",
      icon: "Users",
    },
  ];

  const staticTestimonials = [
    {
      id: 1,
      clientName: "John Smith",
      clientRole: "CEO",
      content:
        "Solupedia transformed our global outreach with their exceptional localization services. The team was professional, responsive, and delivered beyond our expectations.",
      company: "TechCorp",
      avatar: "/avatar1.png",
    },
    {
      id: 2,
      clientName: "Maria Garcia",
      clientRole: "Training Director",
      content:
        "Exceptional localization quality and turnaround time. Solupedia helped us reach learners across 20+ countries with perfectly adapted content.",
      company: "EduLearn",
      avatar: "/avatar2.png",
    },
    {
      id: 3,
      clientName: "Sarah Johnson",
      clientRole: "Marketing Director",
      content:
        "The attention to detail and cultural adaptation was impressive. Our video content resonated perfectly with international audiences.",
      company: "Global Media",
      avatar: "/avatar3.jpg",
    },
  ];

  const staticCaseStudies = [
    {
      id: 1,
      title: "TechCorp Global Expansion",
      clientName: "TechCorp",
      serviceType: "Document Localization",
    },
    {
      id: 2,
      title: "EduLearn Platform",
      clientName: "EduLearn",
      serviceType: "eLearning Localization",
    },
  ];

  // Use static data if API data is empty or missing
  const displayServices =
    services && services.length > 0 ? services : staticServices;
  const displayTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : staticTestimonials;
  const displayCaseStudies =
    caseStudies && caseStudies.length > 0 ? caseStudies : staticCaseStudies;
  const displaySuccessStories =
    caseStudies && caseStudies.length > 0 ? caseStudies : staticCaseStudies;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white min-h-[90vh] flex items-center overflow-hidden">
        {/* Abstract shapes/blobs for modern feel */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 backdrop-blur-sm text-blue-100 text-sm font-medium mb-6 border border-blue-400/30">
                🚀 Professional Localization Services
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                Break Language Barriers, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                  Expand Globally
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                Connect with audiences worldwide through professional,
                culturally-adapted localization solutions. From documents to
                eLearning, we speak your language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 text-lg shadow-lg shadow-blue-900/20 rounded-full"
                  >
                    Get Started <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/lead-magnet">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-lg rounded-full backdrop-blur-sm"
                  >
                    Download Free Guide
                  </Button>
                </Link>
              </div>

              {/* Trust indicators in Hero */}
              <div className="mt-12 pt-8 border-t border-blue-400/30 flex items-center gap-8 text-blue-200">
                <div>
                  <p className="text-3xl font-bold text-white">7k+</p>
                  <p className="text-sm">Projects</p>
                </div>
                <div className="w-px h-10 bg-blue-400/30"></div>
                <div>
                  <p className="text-3xl font-bold text-white">150+</p>
                  <p className="text-sm">Languages</p>
                </div>
                <div className="w-px h-10 bg-blue-400/30"></div>
                <div>
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-sm">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/50 border-4 border-white/10">
                <img
                  src="/QRRik675gBAy.webp"
                  alt="Global Business Languages"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
              {/* Floating element */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-xl shadow-xl max-w-xs"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Global Reach</p>
                    <p className="text-sm text-gray-500">Connecting cultures</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500"
                    >
                      {i === 4 ? "+" : ""}
                    </div>
                  ))}
                  <span className="ml-4 text-sm text-gray-600 self-center">
                    Trusted by leaders
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By - New Design */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted By Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Solupedia partners with global organizations and adheres to the
              highest industry standards
            </p>
          </div>

          {/* Featured Partnership */}
          <div className="mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-6 text-center">
              Featured
            </p>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                FEATURED PARTNERSHIP
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The Ken Blanchard Companies
              </h3>
              <p className="text-gray-600">
                Primary localization engineering partner from 2018–2025. Managed
                trademark transition, eLearning re-engineering, media
                localization, and accessibility compliance across 21 languages
                and thousands of assets including SLII®, Self Leadership, and
                more.
              </p>
            </div>
          </div>

          {/* Technology Partners */}
          <div className="mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-8 text-center">
              Technology Partners
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
              {/* Microsoft */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Microsoft
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  Storyline & Office Ecosystem
                </span>
              </div>

              {/* Adobe */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425h-3.71zm-8.122 0H1v-19h4.844l-2.5 19zM16.136 3.5H22v19h-5.864l-2.223-19zM9.706 3.5L8.128 10.24l1.578 12.257h4.662l2.226-8.996-1.58-6.001H9.706z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Adobe
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  Creative Suite & Content Tools
                </span>
              </div>

              {/* Google */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Google
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  Cloud Services & Accessibility
                </span>
              </div>

              {/* MadCap Software */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">MadCap</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  MadCap Software
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  Flare & Lingo Specialization
                </span>
              </div>

              {/* Articulate */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Articulate
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  Storyline & Rise
                </span>
              </div>

              {/* DominKnow */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  DominKnow
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  eLearning Authoring
                </span>
              </div>

              {/* Clip Studio Paint */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xs">CSP</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Clip Studio Paint
                </span>
                <span className="text-xs text-gray-500 text-center mt-1">
                  Digital Content Creation
                </span>
              </div>
            </div>
          </div>

          {/* Industry Standards & Certifications */}
          <div className="mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-8 text-center">
              Industry Standards & Certifications
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* WCAG 2.1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  WCAG 2.1
                </h4>
                <p className="text-sm text-gray-600">
                  Web Content Accessibility Guidelines
                </p>
              </div>

              {/* EAA Compliance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22,4 12,14.01 9,11.01" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  EAA Compliance
                </h4>
                <p className="text-sm text-gray-600">
                  European Accessibility Act
                </p>
              </div>

              {/* Section 508 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Section 508
                </h4>
                <p className="text-sm text-gray-600">
                  US Accessibility Standards
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-6">
              Join leading organizations that trust Solupedia for their
              technical localization needs
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Project <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview - Modern Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
              What We Do
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-gray-900">
              Comprehensive Localization Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Tailored strategies to help your business thrive in any market.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BookOpen,
                title: "eLearning Engineering",
                desc: "Storyline development and deep technical localization for interactive training.",
                image: "/Solupedia-document-localization.jpg",
              },
              {
                icon: Video,
                title: "Media Localization",
                desc: "OST, subtitling, voiceover, and AI-assisted services for multimedia.",
                image: "/Solupedia-video-editing-localization.jpg",
              },
              {
                icon: Zap,
                title: "Accessibility",
                desc: "EAA enforcement, remediation, and standards compliance for all content.",
                image: "/tQhhiaQyUpCd.jpg",
              },
              {
                icon: Globe,
                title: "Document & DTP",
                desc: "RTL expertise, graphics localization, and template management.",
                image: "/Solupedia-creation-solutions.jpg",
              },
              {
                icon: FileText,
                title: "Content Creation",
                desc: "Build once, localize efficiently - 40-60% cost savings with our methodology.",
                image: "/Solupedia-document-localization.jpg",
              },
              {
                icon: Users,
                title: "AI Workflows",
                desc: "AI at every pipeline stage with intelligent tiering for maximum efficiency.",
                image: "/Solupedia-creation-solutions.jpg",
              },
            ].map((service, idx) => (
              <motion.div variants={itemVariants} key={idx} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                      <service.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                      {service.desc}
                    </p>
                    <Link
                      href={`/services/${service.title.toLowerCase().replace(/[\s/]+/g, "-")}`}
                    >
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-2 transition-transform"
                      >
                        Learn More <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-16">
            <Link href="/services">
              <Button
                size="lg"
                className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Feature Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
                Why Solupedia
              </span>
              <h2 className="text-4xl font-bold mt-2 mb-6">
                Experience the Difference
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We combine human expertise with cutting-edge technology to
                deliver translations that are not just accurate, but culturally
                resonant.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Expert Linguists",
                    desc: "Native speakers with deep industry knowledge.",
                  },
                  {
                    title: "Rigorous QA",
                    desc: "ISO-certified quality assurance processes.",
                  },
                  {
                    title: "Scalable Solutions",
                    desc: "Workflows that grow with your business needs.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="space-y-6 mt-12"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl">
                  <Users className="w-10 h-10 mb-4 opacity-80" />
                  <h3 className="text-4xl font-bold mb-1">18+</h3>
                  <p className="text-blue-100">Years Experience</p>
                </div>
                <div className="bg-gray-100 p-8 rounded-3xl shadow-lg">
                  <Award className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="text-4xl font-bold mb-1 text-gray-900">
                    200+
                  </h3>
                  <p className="text-gray-600">Happy Clients</p>
                </div>
              </motion.div>
              <motion.div
                className="space-y-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-gray-100 p-8 rounded-3xl shadow-lg">
                  <Zap className="w-10 h-10 mb-4 text-blue-600" />
                  <h3 className="text-4xl font-bold mb-1 text-gray-900">
                    Fast
                  </h3>
                  <p className="text-gray-600">Turnaround</p>
                </div>
                <div className="bg-blue-800 p-8 rounded-3xl text-white shadow-xl">
                  <Globe className="w-10 h-10 mb-4 opacity-80" />
                  <h3 className="text-4xl font-bold mb-1">150+</h3>
                  <p className="text-blue-100">Languages</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Success Stories - Using Testimonials */}
      {displayTestimonials && displayTestimonials.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Client Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Real results from our valued clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayTestimonials
                .slice(0, 3)
                .map((testimonial: any, idx: number) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="pt-8 px-8 pb-8 flex flex-col h-full">
                        <div className="flex items-center gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 mb-8 italic text-lg leading-relaxed flex-1">
                          "
                          {testimonial.content ||
                            testimonial.clientCompany ||
                            "Excellent service!"}
                          "
                        </p>
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                            {(testimonial.clientName || "C").charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {testimonial.clientName || "Client"}
                            </p>
                            <p className="text-sm text-blue-600 font-medium">
                              {testimonial.company ||
                                testimonial.clientRole ||
                                ""}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies Preview */}
      {displayCaseStudies && displayCaseStudies.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
                  Portfolio
                </span>
                <h2 className="text-4xl font-bold mt-2">Featured Projects</h2>
              </div>
              <Link href="/case-studies">
                <Button variant="outline" className="rounded-full">
                  View All Projects
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
              {(displayCaseStudies as any[])
                .slice(0, 2)
                .map((study: any, idx: number) => (
                  <Link key={study.id} href={`/case-studies/${study.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl">
                        <div className="p-8 md:p-10">
                          <div className="flex justify-between items-start mb-6">
                            <div className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                              {study.industry}
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-700 transition-colors">
                            {study.title}
                          </h3>
                          <p className="text-gray-600 mb-6 line-clamp-3">
                            {study.solution}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                Challenge
                              </p>
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {study.challenge}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                Result
                              </p>
                              <p className="text-sm font-bold text-blue-600 line-clamp-2">
                                {study.results}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Modernized */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Go Global?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let us help you reach new markets with professional localization
            solutions tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 hover:scale-105 transition-transform"
              >
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/lead-magnet">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white rounded-full transition-all"
              >
                Download Our Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
