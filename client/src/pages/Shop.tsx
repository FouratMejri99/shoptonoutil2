import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "wouter";

interface PublishItem {
  id: number;
  created_at: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  subcategory: string;
  characteristics: string;
  deposit: number;
  description: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

export default function Shop() {
  const [products, setProducts] = useState<PublishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("publish")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data || []);
          
          // Fetch image URLs for each product
          const urls: Record<number, string> = {};
          for (const product of data || []) {
            if (product.image_url) {
              const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(product.image_url);
              urls[product.id] = publicUrl;
            }
          }
          setImageUrls(urls);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: "all", name: "Tous les produits", count: products.length },
    { id: "Outils électroportatifs", name: "Outils électroportatifs", count: products.filter(p => p.category === "Outils électroportatifs").length },
    { id: "Chantier & gros œuvre", name: "Chantier & gros œuvre", count: products.filter(p => p.category === "Chantier & gros œuvre").length },
    { id: "Plomberie", name: "Plomberie", count: products.filter(p => p.category === "Plomberie").length },
    { id: "Menuiserie & travail du bois", name: "Menuiserie & travail du bois", count: products.filter(p => p.category === "Menuiserie & travail du bois").length },
    { id: "Peinture & revêtements", name: "Peinture & revêtements", count: products.filter(p => p.category === "Peinture & revêtements").length },
    { id: "Jardinage", name: "Jardinage", count: products.filter(p => p.category === "Jardinage").length },
    { id: "Sécurité & EPI", name: "Sécurité & EPI", count: products.filter(p => p.category === "Sécurité & EPI").length },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const minP = minPrice ? parseFloat(minPrice) : 0;
    const maxP = maxPrice ? parseFloat(maxPrice) : 1000;
    const matchesPrice = (p.price || 0) >= minP && (p.price || 0) <= maxP;
    return matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Notre Boutique</h1>
            <p className="text-xl text-blue-100">Chargement des produits...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Notre Boutique
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Découvrez tous nos outils et accessories pour le bricolage.
              {products.length > 0 ? ` ${products.length} produits disponibles.` : ' Qualité professionnelle aux meilleurs prix.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Catégories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-sm text-gray-400">
                        ({category.count})
                      </span>
                    </button>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-8">
                  Prix (€/jour)
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    variant="outline"
                    className="w-full text-sm"
                  >
                    Réinitialiser le prix
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> outil{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && <span className="text-blue-600"> dans {categories.find(c => c.id === selectedCategory)?.name}</span>}
                  {(minPrice || maxPrice) && <span className="text-blue-600"> ({minPrice || '0'}€ - {maxPrice || '500'}€)</span>}
                </p>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">
                    Aucun outil ne correspond à vos critères.
                  </p>
                  <Button 
                    onClick={() => {
                      setSelectedCategory("all");
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-full"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="h-48 overflow-hidden relative bg-gray-200 flex-shrink-0">
                          {imageUrls[product.id] ? (
                            <img
                              src={imageUrls[product.id]}
                              alt={product.name}
                              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                            />
                          ) : product.image_url ? (
                            <img
                              src={`https://rzucruakxcswuzerkdvq.supabase.co/storage/v1/object/public/products/${product.image_url}`}
                              alt={product.name}
                              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart size={48} />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 flex flex-col flex-grow">
                          <p className="text-xs text-blue-600 font-medium mb-1">
                            {product.category}
                          </p>
                          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {product.description || product.characteristics || "Aucune description"}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-lg font-bold text-blue-600">
                                {product.price ? `${Number(product.price).toFixed(2)}€` : "Prix sur demande"}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">/jour</span>
                            </div>
                            <Link href={`/reservation?tool=${product.id}`}>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 rounded-full"
                              >
                                Réserver
                              </Button>
                            </Link>
                          </div>
                          {product.city && (
                            <p className="text-xs text-gray-400 mt-2">
                              📍 {product.city}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vous avez un outil à vendre ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et reach des milliers de clients
            potentiels pour vos produits de bricolage.
          </p>
          <Link href="/publier-outil">
            <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
              Publier un outil
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
