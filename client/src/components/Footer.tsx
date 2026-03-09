import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Simple newsletter handler
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.info("Newsletter feature coming soon!");
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-16 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl translate2 -translate-x-y-1/-1/2"></div>

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
              Votre shop de confiance pour tous vos outils Bricolor. Qualité
              professionnelle et livraison rapide.
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
                <Link href="/shop">
                  <a className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Boutique
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
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">Contact</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span>Tunis, Tunisie</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500" />
                <span>+216 00 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <span>contact@shoptonoutil.tn</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={16} className="text-blue-500" />
                <span>Disponible 7j/7</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Inscrivez-vous pour recevoir nos offres spéciales
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Shoptonoutil. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
