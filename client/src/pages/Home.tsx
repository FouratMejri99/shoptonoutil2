import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoriesData, outilsData } from "@/lib/outils";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  // Fetch tools from Supabase for the Boutique section
  const [featuredTools, setFeaturedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      const { data, error } = await supabase
        .from("publish")
        .select("*")
        .limit(8);

      if (data) {
        setFeaturedTools(data);
      } else if (error) {
        console.error("Error fetching tools:", error);
        // Fallback to local data if fetch fails
        setFeaturedTools(outilsData);
      }
      setLoading(false);
    };

    fetchTools();
  }, []);
  const categories = categoriesData;

  const advantages = [
    {
      id: 1,
      title: "Livraison rapide",
      description: "Livraison gratuite dès 50€ d'achat",
      icon: Truck,
    },
    {
      id: 2,
      title: "Qualité professionnelle",
      description: "Sélection des meilleures marques",
      icon: Award,
    },
    {
      id: 3,
      title: "Prix avantageux",
      description: "Les meilleurs prix du marché",
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "Service client",
      description: "Conseils personnalisés",
      icon: Package,
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white min-h-[90vh] flex items-center overflow-hidden">
        {/* Abstract shapes for modern feel */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 backdrop-blur-sm text-blue-100 text-sm font-medium mb-6 border border-blue-400/30">
                🛠️ Votre shop Bricolor
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                Tous vos outils en un seul endroit,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                  livrés chez vous
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                Qualité professionnelle pour tous vos projets de bricolage.
                Livraison rapide et meilleurs prix garantis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 text-lg shadow-lg shadow-blue-900/20 rounded-full"
                  >
                    Commander maintenant{" "}
                    <ShoppingCart className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-lg rounded-full backdrop-blur-sm"
                  >
                    Découvrir nos produits
                  </Button>
                </Link>
              </div>

              {/* Trust indicators in Hero */}
              <div className="mt-12 pt-8 border-t border-blue-400/30 flex items-center gap-8 text-blue-200">
                <div>
                  <p className="text-3xl font-bold text-white">5000+</p>
                  <p className="text-sm">Produits</p>
                </div>
                <div className="w-px h-10 bg-blue-400/30"></div>
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-sm">Marques</p>
                </div>
                <div className="w-px h-10 bg-blue-400/30"></div>
                <div>
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-sm">Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/50 border-4 border-white/10">
                <img
                  src="/welcom.png"
                  alt="Outils de bricolage"
                  loading="lazy"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-xl shadow-xl max-w-xs">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Stock important</p>
                    <p className="text-sm text-gray-500">
                      Disponibilité immédiate
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Marque professionnelle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
              Nos catégories
            </span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">
              Tout pour le bricolage
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Découvrez notre large gamme de produits pour tous vos projets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <Link key={category.id} href={`/contact`}>
                <div className="group cursor-pointer">
                  <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src="/outil.png"
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                        Voir les produits{" "}
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-full">
                Voir toutes les catégories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
              Boutique
            </span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">
              Nos outils disponibles
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
              Découvrez notre sélection d'outils professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={i}
                    className="h-full overflow-hidden border-none shadow-lg"
                  >
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))
              : featuredTools.map(tool => (
                  <div key={tool.id}>
                    <Link href={`/shop/${tool.id}`}>
                      <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="h-48 overflow-hidden relative bg-gray-100">
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={e => {
                              // Fallback to placeholder if image fails
                              (e.target as HTMLImageElement).src = "/outil.png";
                            }}
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {tool.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-blue-600">
                                {tool.price}€ /jour
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 rounded-full"
                            >
                              <ShoppingCart size={14} className="mr-1" />
                              Louer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full bg-blue-600 hover:bg-blue-700"
              >
                Voir tous les outils
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map(advantage => (
              <div key={advantage.id} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <advantage.icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à démarrer vos projets ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour bénéficier de conseils personnalisés et d'un
              devis gratuit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 text-lg rounded-full"
                >
                  Demander un devis <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-white/50 text-white hover:bg-white/10 transition-all duration-300 text-lg rounded-full"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
