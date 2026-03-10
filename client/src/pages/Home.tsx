import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { outilsData } from "@/lib/outils";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  Bot,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  CreditCard,
  Handshake,
  Lock,
  Search,
  Shield,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [featuredTools, setFeaturedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchTools = async () => {
      const { data, error } = await supabase
        .from("publish")
        .select("*")
        .limit(6);

      if (data) {
        setFeaturedTools(data);
      } else if (error) {
        console.error("Error fetching tools:", error);
        setFeaturedTools(outilsData.slice(0, 6));
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchTools();
    fetchUser();
  }, []);

  const categories = [
    {
      id: 1,
      name: "Perceuses",
      icon: "🔩",
      description: "Perceuses visseuses",
    },
    {
      id: 2,
      name: "Scies",
      icon: "🪚",
      description: "Scies circulaires, sabres",
    },
    {
      id: 3,
      name: "Tondeuses",
      icon: "🌿",
      description: "Tondeuses, tondeuses роботи",
    },
    {
      id: 4,
      name: "Meuleuses",
      icon: "⚡",
      description: "Meuleuses angulaires",
    },
    {
      id: 5,
      name: "Ponceuses",
      icon: "✨",
      description: "Ponceuses vibrantes, orbitales",
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Recherchez",
      description: "Trouvez l'outil qu'il vous faut près de chez vous",
      icon: Search,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Réservez",
      description: "Choisissez vos dates et contact",
      icon: Calendar,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      title: "Récupérez",
      description: "Rencontrez le propriétaire pour récupérer l'outil",
      icon: Handshake,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      title: "Utilisez",
      description: "Bricolez en toute sérénité",
      icon: Wrench,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const features = [
    {
      id: 1,
      title: "Paiement sécurisé",
      description: "Votre argent est protégé jusqu'à la fin de la location",
      icon: CreditCard,
    },
    {
      id: 2,
      title: "Vérification des utilisateurs",
      description:
        "Tous les utilisateurs sont vérifiés avant de pouvoir publier",
      icon: UserCheck,
    },
    {
      id: 3,
      title: "Assurance incluse",
      description: "Chaque location est couverte par notre assurance",
      icon: Shield,
    },
  ];

  const faqs = [
    {
      question: "Quels frais vais-je payer ?",
      answer:
        "Des frais de service minimes sont prélevés sur chaque transaction. Pour les locataires, c'est seulement 0,50€ par location. Pour les loueurs, c'est 0% de commission.",
    },
    {
      question: "Comment fonctionne la caution ?",
      answer:
        "Une caution automatique est demandée lors de chaque location. Elle est débloquée automatiquement à la fin de la location si l'outil est restitué en bon état.",
    },
    {
      question: "Mon paiement est-il sécurisé ?",
      answer:
        "Oui, tous les paiements sont sécurisés via notre plateforme. L'argent est conservé en attente jusqu'à la fin de la location.",
    },
    {
      question: "L'IA m'aide à quoi ?",
      answer:
        "Notre IA vous aide à trouver rapidement l'outil qu'il vous faut, à estimer le prix de votre outil, et à gérer vos annonces.",
    },
    {
      question: "Mes données sont-elles protégées ?",
      answer:
        "Oui, nous respectons les normes RGPD et vos données personnelles sont strictement confidentielles.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* News/Banner Section - Loueurs & Locataires as Cards */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loueurs Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">🔧</span>
                      <h2 className="text-2xl font-bold">Loueurs</h2>
                    </div>
                    <p className="text-blue-200">
                      Gagnez jusqu'à 50€ par mois en louant vos outils
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={18} />
                    <span>0% de commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={18} />
                    <span>Caution automatique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={18} />
                    <span>Mise en avant des outils</span>
                  </div>
                </div>

                <div className="bg-yellow-400 text-yellow-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={20} />
                    <span className="font-bold">
                      🎁 Premium offert pendant 12 mois
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    pour les 50 premiers loueurs inscrits
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Locataires Card */}
            <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">🎁</span>
                      <h2 className="text-2xl font-bold">Locataires</h2>
                    </div>
                    <p className="text-green-200">
                      Louez les meilleurs outils près de chez vous
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={18} />
                    <span>Prix réduits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={18} />
                    <span>Outils de qualité</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={20} />
                    <span className="font-bold">
                      🎁 Frais de service à 0,50€ pendant 3 mois
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-4">
                    pour toute inscription avant l'ouverture
                  </p>
                  {!user && (
                    <Link href="/contact">
                      <Button className="bg-white text-green-600 hover:bg-green-50 font-bold rounded-full w-full">
                        S'inscrire maintenant
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Louez les meilleurs outils <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                près de chez vous
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Trouvez rapidement des outils de bricolage disponibles autour de
              vous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex : perceuse, scie, tondeuse..."
                  className="w-full md:w-96 h-14 pl-12 pr-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 shadow-sm"
                />
                <Bot
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-full text-lg"
                >
                  <Search className="mr-2" size={20} />
                  Trouver
                </Button>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <Link key={category.id} href="/shop">
                  <div className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Available Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Outils disponibles près de chez vous
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez notre sélection d'outils de qualité pour tous vos
              projets de bricolage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : featuredTools.length > 0 ? (
              featuredTools.slice(0, 6).map(tool => (
                <Card
                  key={tool.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-100 relative flex items-center justify-center">
                    {tool.image_url ? (
                      <img
                        src={tool.image_url}
                        alt={tool.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).src = "/outil.png";
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Wrench size={48} />
                        <p className="mt-2">Pas d'image</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {tool.category || "Outil"}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {tool.name || "Outil de bricolage"}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">
                      {tool.price || "25€"}/jour
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {tool.city || "Reims"}
                    </p>
                    <Link href={`/shop/${tool.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full">
                        Voir l'annonce
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucun outil disponible pour le moment.
                </p>
                <Link href="/publier-outil">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-full">
                    Publier un outil
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="rounded-full">
                Voir tous les outils <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Louez ou proposez des outils en quelques minutes seulement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => (
              <div key={step.id} className="text-center">
                <div
                  className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <step.icon className={step.iconColor} size={32} />
                </div>
                <div className="relative inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mb-4">
                  {step.id}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(feature => (
              <div
                key={feature.id}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earn Money Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vous avez un outil qui prend la poussière ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Gagnez jusqu'à 50€ par mois en le louant à vos voisins
            </p>
            <Link href="/publier-outil">
              <Button
                size="lg"
                className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 rounded-full text-lg font-bold"
              >
                Publier mon premier outil
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion UI */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              FAQ
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur Shoptonoutil
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <CreditCard className="text-blue-600" size={20} />
                    )}
                    {index === 1 && (
                      <Lock className="text-blue-600" size={20} />
                    )}
                    {index === 2 && (
                      <Shield className="text-blue-600" size={20} />
                    )}
                    {index === 3 && <Bot className="text-blue-600" size={20} />}
                    {index === 4 && (
                      <UserCheck className="text-blue-600" size={20} />
                    )}
                    <span className="font-bold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`}
                    size={20}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600 ml-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span>© 2025 Shoptonoutil — Tous droits réservés</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-blue-600">
                Mentions légales
              </a>
              <span>|</span>
              <a href="#" className="hover:text-blue-600">
                CGU
              </a>
              <span>|</span>
              <a href="#" className="hover:text-blue-600">
                Politique de confidentialité
              </a>
            </div>
            <a
              href="mailto:contact@shoptonoutil.fr"
              className="hover:text-blue-600"
            >
              contact@shoptonoutil.fr
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
