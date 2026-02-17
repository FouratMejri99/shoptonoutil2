import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

function Footer() {
  const [email, setEmail] = useState("");

  const subscribeNewsletter = trpc.leads.subscribeNewsletter.useMutation as any;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeNewsletter.mutate(
        { email, type: "newsletter" },
        {
          onSuccess: () => {
            toast.success("Successfully subscribed to newsletter!");
            setEmail("");
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to subscribe. Please try again.");
          },
        }
      );
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-16 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Company Info - spans 2 columns */}
          <div className="lg:col-span-2">
            <Link href="/">
              <span className="text-2xl font-bold text-white cursor-pointer">
                Shoptonoutil
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              Votre shop de confiance pour tous vos outils Bricolor. 
              Qualité professionnelle et livraison rapide.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">
              Navigation
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Accueil
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    À propos
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contact
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/lead-magnet">
                  <a className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Guide Gratuit
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">Contact</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <Phone size={12} />
                </div>
                <a
                  href="tel:+33123456789"
                  className="hover:text-white transition py-1"
                >
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <Mail size={12} />
                </div>
                <a
                  href="mailto:contact@shoptonoutil2.com"
                  className="hover:text-white transition py-1"
                >
                  contact@shoptonoutil2.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <MapPin size={12} />
                </div>
                <span className="py-1">
                  Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 pt-4 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              © 2026 shoptonoutil2. Tous droits réservés.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/solupediadotcom/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://wa.me/201555335577"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                <MessageCircle size={14} />
              </a>
              <a
                href="https://twitter.com/solupedia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all duration-300"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://linkedin.com/company/solupedia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
