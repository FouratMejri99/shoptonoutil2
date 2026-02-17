import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { MapPin, Search, Filter, Lock, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom blue marker icon for tools
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Tool {
  id: number;
  name: string;
  price: number;
  category: string;
  city: string;
  image_url: string;
  description?: string;
  lat?: number;
  lng?: number;
}

// Generate random coordinates around Reims for demo
const reimsCenter = { lat: 49.2583, lng: 4.0317 };

function generateRandomPosition(baseLat: number, baseLng: number, radiusKm: number = 5) {
  const radiusInDegrees = radiusKm / 111;
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return {
    lat: baseLat + y,
    lng: baseLng + x / Math.cos(baseLat * (Math.PI / 180)),
  };
}

export default function Map() {
  const [user, setUser] = useState<any>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("publish")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      // Add random coordinates around Reims for each tool (for demo)
      const toolsWithCoords = data.map((tool, index) => {
        const pos = generateRandomPosition(reimsCenter.lat, reimsCenter.lng, 3 + index * 0.5);
        return {
          ...tool,
          lat: pos.lat,
          lng: pos.lng,
        };
      });
      setTools(toolsWithCoords as any);
    }
    setLoading(false);
  };

  const categories = [
    "Tous",
    "Outils électroportatifs",
    "Chantier & gros œuvre",
    "Plomberie",
    "Menuiserie & travail du bois",
    "Peinture & revêtements",
    "Jardinage",
    "Sécurité & EPI",
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "Tous" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Show login required if not authenticated
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour voir la carte des outils.
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-blue-600" />
            Carte des outils disponibles - Reims
          </h1>
          
          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-blue-600" : ""}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Carte
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-blue-600" : ""}
            >
              <Search className="w-4 h-4 mr-2" />
              Liste
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un outil ou une ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="text-gray-400 w-5 h-5" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat || (!selectedCategory && cat === "Tous")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <div className="max-w-6xl mx-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: "600px" }}>
              <MapContainer
                center={[reimsCenter.lat, reimsCenter.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredTools.map((tool) => (
                  <Marker
                    key={tool.id}
                    position={[tool.lat || reimsCenter.lat, tool.lng || reimsCenter.lng]}
                    icon={blueIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        {tool.image_url && (
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className="w-full h-24 object-cover rounded-t-md mb-2"
                          />
                        )}
                        <h3 className="font-bold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-500">{tool.category}</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">{tool.price}€/jour</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {tool.city || "Reims"}
                        </p>
                        <Link href={`/shop/${tool.id}`}>
                          <Button size="sm" className="w-full mt-2 bg-blue-600">
                            Voir l'annonce
                          </Button>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
          
          {/* Tool count */}
          <div className="mt-4 bg-blue-50 rounded-xl p-4 flex items-center gap-3">
            <Wrench className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Outils disponibles à Reims</p>
              <p className="text-2xl font-bold text-blue-600">{filteredTools.length}</p>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="max-w-6xl mx-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun outil trouvé
              </h2>
              <p className="text-gray-500">
                Essayez de modifier votre recherche ou vos filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {tool.image_url ? (
                      <img
                        src={tool.image_url}
                        alt={tool.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {tool.price}€/jour
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{tool.category}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {tool.city || "Reims"}
                    </div>
                    <Link href={`/shop/${tool.id}`}>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                        Voir l'annonce
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-xl p-4 z-10">
        <p className="text-sm text-gray-500">Outils disponibles</p>
        <p className="text-2xl font-bold text-blue-600">{filteredTools.length}</p>
      </div>
    </div>
  );
}
