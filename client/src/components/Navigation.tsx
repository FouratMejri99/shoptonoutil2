import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import { useState, memo } from "react";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/logo-blue-full.png" alt="Solupedia" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-4 space-y-2">
                      <Link href="/services/document-localization" className="block p-2 hover:bg-gray-100 rounded">
                        Document Localization
                      </Link>
                      <Link href="/services/elearning-localization" className="block p-2 hover:bg-gray-100 rounded">
                        eLearning Localization
                      </Link>
                      <Link href="/services/audio-video-localization" className="block p-2 hover:bg-gray-100 rounded">
                        Audio/Video Localization
                      </Link>
                      <Link href="/services/creation-solutions" className="block p-2 hover:bg-gray-100 rounded">
                        Creation Solutions
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/case-studies" className="text-gray-700 hover:text-blue-600 transition">
              Case Studies
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/employee/login" className="text-sm text-gray-600 hover:text-blue-600 transition font-medium">
              Employee Portal
            </Link>
            <Link href="/lead-magnet">
              <Button variant="outline">Get Free Guide</Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link href="/" className="block text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/services" className="block text-gray-700 hover:text-blue-600">
              Services
            </Link>
            <Link href="/case-studies" className="block text-gray-700 hover:text-blue-600">
              Case Studies
            </Link>
            <Link href="/blog" className="block text-gray-700 hover:text-blue-600">
              Blog
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600">
              Contact
            </Link>
            <Link href="/employee/login" className="block text-gray-700 hover:text-blue-600">
              Employee Portal
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/lead-magnet" className="flex-1">
                <Button variant="outline" className="w-full">Get Free Guide</Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Quote</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default memo(Navigation);
