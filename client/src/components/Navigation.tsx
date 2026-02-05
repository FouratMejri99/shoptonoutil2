import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Shield, User, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100 py-3"
          : "bg-white border-b border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-blue-full.png"
              alt="Solupedia"
              className="h-10 md:h-12 transition-all"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Home
              </a>
            </Link>
            <Link href="/about">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/about" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                About
              </a>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`bg-transparent hover:bg-gray-50 rounded-full px-4 text-sm font-medium ${location.startsWith("/services") ? "text-blue-600" : "text-gray-600"}`}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 gap-3 grid grid-cols-1">
                      <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-900">
                          Our Services
                        </span>
                        <Link
                          href="/services"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View All
                        </Link>
                      </div>
                      <Link href="/services/document-localization">
                        <a className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <span className="text-xs font-bold">DL</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                              Document Localization
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              Expert translation for all document types
                            </p>
                          </div>
                        </a>
                      </Link>
                      <Link href="/services/elearning-localization">
                        <a className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <span className="text-xs font-bold">EL</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                              eLearning Localization
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              Adapt training content for global teams
                            </p>
                          </div>
                        </a>
                      </Link>
                      <Link href="/services/audio-video-localization">
                        <a className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0 mt-0.5 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                            <span className="text-xs font-bold">AV</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-pink-700">
                              Audio/Video Localization
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              Dubbing, voiceover and subtitling
                            </p>
                          </div>
                        </a>
                      </Link>
                      <Link href="/services/creation-solutions">
                        <a className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <span className="text-xs font-bold">CS</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                              Creation Solutions
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              Content creation and design services
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/case-studies">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/case-studies" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Case Studies
              </a>
            </Link>
            <Link href="/blog">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/blog" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Blog
              </a>
            </Link>
            <Link href="/contact">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/contact" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Contact
              </a>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex gap-3 items-center">
            {/* Login Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-full px-4 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[220px] p-3 gap-2">
                      <Link href="/solupedia-admin">
                        <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                              Admin Portal
                            </div>
                            <p className="text-xs text-gray-500">
                              Manage your content
                            </p>
                          </div>
                        </a>
                      </Link>
                      <Link href="/employee/login">
                        <a className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                              Employee Portal
                            </div>
                            <p className="text-xs text-gray-500">
                              Access your workspace
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/lead-magnet">
              <Button
                variant="ghost"
                className="rounded-full font-medium hover:bg-blue-50 hover:text-blue-600"
              >
                Free Guide
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all px-6">
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 mt-4"
            >
              <div className="py-4 space-y-1">
                <Link href="/">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Home
                  </a>
                </Link>
                <Link href="/about">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/about" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    About
                  </a>
                </Link>
                <div className="px-4 py-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Services
                  </div>
                  <div className="space-y-1 pl-2 border-l-2 border-gray-100">
                    <Link href="/services/document-localization">
                      <a className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                        Document Localization
                      </a>
                    </Link>
                    <Link href="/services/elearning-localization">
                      <a className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                        eLearning Localization
                      </a>
                    </Link>
                    <Link href="/services/audio-video-localization">
                      <a className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                        Audio/Video Localization
                      </a>
                    </Link>
                    <Link href="/services/creation-solutions">
                      <a className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                        Creation Solutions
                      </a>
                    </Link>
                  </div>
                </div>
                <Link href="/case-studies">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/case-studies" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Case Studies
                  </a>
                </Link>
                <Link href="/blog">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/blog" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Blog
                  </a>
                </Link>
                <Link href="/contact">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/contact" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Contact
                  </a>
                </Link>

                {/* Login Links */}
                <div className="px-4 py-2 pt-4 mt-2 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Portal Login
                  </div>
                  <div className="space-y-2">
                    <Link href="/admin/login">
                      <a className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                        <Shield className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Admin Portal
                          </div>
                          <p className="text-xs text-gray-500">
                            Manage your content
                          </p>
                        </div>
                      </a>
                    </Link>
                    <Link href="/employee/login">
                      <a className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Employee Portal
                          </div>
                          <p className="text-xs text-gray-500">
                            Access your workspace
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3 px-4">
                  <Link href="/lead-magnet">
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-full"
                    >
                      Get Free Guide
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 rounded-full">
                      Get Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default memo(Navigation);
