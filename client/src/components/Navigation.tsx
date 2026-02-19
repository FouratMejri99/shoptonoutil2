import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Plus,
  Shield,
  User,
  X,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    address: "",
    profileType: "bricoleur",
  });

  // Check auth state on mount
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Déconnexion réussie");
  };

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
            <span className="text-2xl font-bold text-blue-600">
              Shoptonoutil
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Accueil
              </a>
            </Link>
            <Link href="/shop">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/shop" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                Boutique
              </a>
            </Link>

            <Link href="/about">
              <a
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location === "/about" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
              >
                À propos
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
            {user ? (
              // User is logged in - show menu
              <div className="flex items-center gap-3">
                <Link href="/publier-outil">
                  <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Publier un outil
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/map">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                  >
                    <MapPin className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full font-medium hover:bg-blue-50 hover:text-blue-600"
                  >
                    Connexion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                      Connexion à votre compte
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginData.email}
                        onChange={e =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={e =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loginLoading}
                      onClick={async () => {
                        if (!loginData.email || !loginData.password) {
                          toast.error("Veuillez remplir tous les champs");
                          return;
                        }
                        setLoginLoading(true);
                        try {
                          const { data, error } =
                            await supabase.auth.signInWithPassword({
                              email: loginData.email,
                              password: loginData.password,
                            });
                          if (error) {
                            toast.error(error.message);
                          } else {
                            toast.success("Connexion réussie!");
                            setLoginOpen(false);
                            setLoginData({ email: "", password: "" });
                          }
                        } catch (err) {
                          toast.error("Erreur de connexion");
                        } finally {
                          setLoginLoading(false);
                        }
                      }}
                    >
                      {loginLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                    <div className="text-center text-sm text-gray-500 space-y-2">
                      <div>
                        <span
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={() => setRegisterOpen(true)}
                        >
                          Créer un compte
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          Mot de passe oublié ?
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Registration Dialog */}
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-bold">
                    Rejoindre Shoptonoutil
                  </DialogTitle>
                  <p className="text-center text-gray-500 text-sm">
                    Louez ou proposez vos outils facilement
                  </p>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex justify-center gap-4 mb-4">
                  <div
                    className={`flex items-center gap-2 ${registerStep >= 1 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${registerStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      1
                    </div>
                    <span className="text-sm">Informations</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${registerStep >= 2 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${registerStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      2
                    </div>
                    <span className="text-sm">Vérification</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${registerStep >= 3 ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${registerStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      3
                    </div>
                    <span className="text-sm">Identité</span>
                  </div>
                </div>

                <div className="space-y-4 py-4">
                  {registerStep === 1 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="reg-name">Nom complet</Label>
                        <Input
                          id="reg-name"
                          placeholder="Votre nom"
                          value={registerData.name}
                          onChange={e =>
                            setRegisterData({
                              ...registerData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={registerData.email}
                          onChange={e =>
                            setRegisterData({
                              ...registerData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Mot de passe</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Minimum 6 caractères"
                          value={registerData.password}
                          onChange={e =>
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-gray-500">
                          Le mot de passe doit contenir au moins 6 caractères
                        </p>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={
                          !registerData.name ||
                          !registerData.email ||
                          registerData.password.length < 6
                        }
                        onClick={() => setRegisterStep(2)}
                      >
                        Continuer
                      </Button>
                    </>
                  )}

                  {registerStep === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="reg-city">Ville</Label>
                        <Input
                          id="reg-city"
                          placeholder="Reims"
                          value={registerData.city}
                          onChange={e =>
                            setRegisterData({
                              ...registerData,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Localisation capturée</Label>
                        <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600">
                          (49.2583, 4.0317)
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-address">Rue</Label>
                        <Input
                          id="reg-address"
                          placeholder="Tapez le nom de votre rue..."
                          value={registerData.address}
                          onChange={e =>
                            setRegisterData({
                              ...registerData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type de profil</Label>
                        <div
                          className={`p-3 rounded-lg border-2 cursor-pointer ${registerData.profileType === "bricoleur" ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                          onClick={() =>
                            setRegisterData({
                              ...registerData,
                              profileType: "bricoleur",
                            })
                          }
                        >
                          🔧 Bricoleur (je cherche des outils)
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setRegisterStep(1)}
                        >
                          Retour
                        </Button>
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => setRegisterStep(3)}
                        >
                          Continuer
                        </Button>
                      </div>
                      <p className="text-center text-xs text-gray-500">
                        Aucune carte bancaire requise • Gratuit
                      </p>
                    </>
                  )}

                  {registerStep === 3 && (
                    <>
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-lg">
                          Vérification d'identité
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pour sécuriser les transactions, nous devons vérifier
                          votre identité
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                          📧 Vérification par email : Nous vous enverrons un
                          email pour vérifier votre carte d'identité après votre
                          inscription.
                        </div>

                        <div className="space-y-2">
                          <Label>Carte d'identité - Recto (face avant) *</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="id-front"
                            />
                            <label
                              htmlFor="id-front"
                              className="cursor-pointer"
                            >
                              <p className="text-gray-600">
                                Choisir un fichier
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Prendre une photo
                              </p>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>
                            Carte d'identité - Verso (face arrière) *
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="id-back"
                            />
                            <label htmlFor="id-back" className="cursor-pointer">
                              <p className="text-gray-600">
                                Choisir un fichier
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Prendre une photo
                              </p>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            Format accepté : JPG, PNG (max 10MB). Les deux faces
                            sont obligatoires.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reg-iban">IBAN (optionnel)</Label>
                          <Input
                            id="reg-iban"
                            placeholder="FR76 1234 5678 9012 3456 7890 123"
                          />
                          <p className="text-xs text-gray-500">
                            Format : FR suivi de 23 chiffres. Espaces
                            automatiques tous les 4 caractères.
                          </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setRegisterStep(2)}
                          >
                            Retour
                          </Button>
                          <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={registerLoading}
                            onClick={async () => {
                              if (
                                !registerData.email ||
                                !registerData.password ||
                                !registerData.name
                              ) {
                                toast.error(
                                  "Veuillez remplir tous les champs obligatoires"
                                );
                                return;
                              }
                              setRegisterLoading(true);
                              try {
                                const { data, error } =
                                  await supabase.auth.signUp({
                                    email: registerData.email,
                                    password: registerData.password,
                                    options: {
                                      data: {
                                        name: registerData.name,
                                        city: registerData.city,
                                        address: registerData.address,
                                        profile_type: registerData.profileType,
                                      },
                                    },
                                  });
                                if (error) {
                                  toast.error(error.message);
                                } else {
                                  toast.success(
                                    "Compte créé avec succès! Veuillez vérifier votre email."
                                  );
                                  setRegisterOpen(false);
                                  setRegisterStep(1);
                                  setRegisterData({
                                    name: "",
                                    email: "",
                                    password: "",
                                    city: "",
                                    address: "",
                                    profileType: "bricoleur",
                                  });
                                  setLoginOpen(true);
                                }
                              } catch (err) {
                                toast.error("Erreur lors de l'inscription");
                              } finally {
                                setRegisterLoading(false);
                              }
                            }}
                          >
                            {registerLoading
                              ? "Inscription..."
                              : "S'inscrire gratuitement"}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Link href="/contact">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all px-6">
                Nous contacter
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
                    Accueil
                  </a>
                </Link>
                <Link href="/shop">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/shop" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Shop
                  </a>
                </Link>
                <Link href="/publier-outil">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/publier-outil" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Publier un outil
                  </a>
                </Link>
                <Link href="/about">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/about" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    À propos
                  </a>
                </Link>
                <Link href="/contact">
                  <a
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${location === "/contact" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Contact
                  </a>
                </Link>

                {/* Login Link */}
                <div className="px-4 py-2 pt-4 mt-2 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Accès Portal
                  </div>
                  <div className="space-y-2">
                    <Link href="/shoptonoutil-admin">
                      <a className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Connexion
                          </div>
                          <p className="text-xs text-gray-500">
                            Se connecter à votre compte
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3 px-4">
                  <Link href="/contact">
                    <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 rounded-full">
                      Nous contacter
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
