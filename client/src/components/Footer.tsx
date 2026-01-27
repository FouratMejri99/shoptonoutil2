import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { memo } from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <img src="/logo-white-full.png" alt="Solupedia" className="h-12 mb-4" />
            <p className="text-gray-400 text-sm">
              Professional localization solutions for global businesses. Bridging language gaps since 2006.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/services/document-localization" className="hover:text-white transition">
                  Document Localization
                </Link>
              </li>
              <li>
                <Link href="/services/elearning-localization" className="hover:text-white transition">
                  eLearning Localization
                </Link>
              </li>
              <li>
                <Link href="/services/audio-video-localization" className="hover:text-white transition">
                  Audio/Video Localization
                </Link>
              </li>
              <li>
                <Link href="/services/creation-solutions" className="hover:text-white transition">
                  Creation Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/case-studies" className="hover:text-white transition">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/lead-magnet" className="hover:text-white transition">
                  Free Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+1910626852" className="hover:text-white transition">
                  +1 (910) 626-8525
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:info@solupedia.com" className="hover:text-white transition">
                  info@solupedia.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>71-75 Shelton Street<br />Covent Garden, London<br />WC2H 9JQ, UK</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2026 Solupedia LTD. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://www.facebook.com/solupediadotcom/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="https://wa.me/201555335577" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <MessageCircle size={20} />
              </a>
              <a href="https://twitter.com/solupedia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/company/solupedia" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
