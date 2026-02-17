import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Calendar, Check, Clock, MapPin, Package, Shield, Star, User, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

interface Tool {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  subcategory: string;
  characteristics: string;
  description: string;
  city: string;
  user_id: string;
  deposit: number;
}

interface Owner {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function Reservation() {
  const [location] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<Tool | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    message: "",
  });

  // Get tool ID from URL
  const toolIdParam = new URLSearchParams(location.split("?")[1] || "").get("tool");
  const toolId = toolIdParam ? parseInt(toolIdParam) : null;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // Fetch tool regardless of login status
      if (toolId) {
        await fetchTool();
      }
      setLoading(false);
    };
    checkUser();
  }, [toolId]);

  const fetchTool = async () => {
    if (!toolId) {
      console.log("No tool ID provided");
      return;
    }

    console.log("Fetching tool with ID:", toolId, "type:", typeof toolId);
    
    const { data, error } = await supabase
      .from("publish")
      .select("*")
      .eq("id", toolId)
      .single();

    console.log("Fetch result:", data, error);

    if (data) {
      setTool(data);
      // Fetch owner info
      const { data: ownerData } = await supabase.auth.getUser();
      if (ownerData.user) {
        // In a real app, we'd fetch owner from a profiles table
        setOwner({
          id: data.user_id,
          name: "Propriétaire",
          email: "",
          created_at: "",
        });
      }
    } else if (error) {
      console.error("Error fetching tool:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tool) return;

    setSubmitting(true);

    try {
      // Calculate total days and price
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalPrice = tool.price * days;

      // Create reservation
      const { error } = await supabase
        .from("reservations")
        .insert([
          {
            tool_id: tool.id,
            renter_id: user.id,
            owner_id: tool.user_id,
            start_date: formData.startDate,
            end_date: formData.endDate,
            total_price: totalPrice,
            deposit: tool.deposit || tool.price * 2,
            status: "pending",
            message: formData.message,
          },
        ]);

      if (error) {
        console.error("Error creating reservation:", error);
        toast.error("Erreur lors de la création de la réservation");
      } else {
        toast.success("Réservation envoyée ! Le propriétaire va recevoir votre demande.");
        window.location.href = "/messages";
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour effectuer une réservation.
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

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Outil non trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Cet outil n'existe plus ou a été supprimé.
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Voir les outils disponibles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate price preview
  const getPricePreview = () => {
    if (!formData.startDate || !formData.endDate || !tool) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (days < 1) return null;
    return {
      days,
      pricePerDay: tool.price,
      total: tool.price * days,
      deposit: tool.deposit || tool.price * 2,
    };
  };

  const pricePreview = getPricePreview();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/shop" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux outils
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Tool Info */}
          <div>
            {/* Tool Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              {tool.image_url ? (
                <img
                  src={tool.image_url}
                  alt={tool.name}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>

            {/* Tool Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {tool.name}
              </h1>
              
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {tool.price}€ <span className="text-lg font-normal text-gray-500">/ jour</span>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Propriétaire</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-500">(23 avis)</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Vérifié
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {tool.description && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                </div>
              )}

              {/* Characteristics */}
              {tool.characteristics && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Caractéristiques</h3>
                  <p className="text-gray-600 text-sm">{tool.characteristics}</p>
                </div>
              )}

              {tool.city && (
                <div className="flex items-center gap-2 text-gray-500 mt-4">
                  <MapPin className="w-4 h-4" />
                  {tool.city}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Reservation Form */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Réserver cet outil
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                        min={formData.startDate || new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Price Summary */}
                  {pricePreview && (
                    <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {pricePreview.days} jour{pricePreview.days > 1 ? 's' : ''} × {pricePreview.pricePerDay}€
                        </span>
                        <span className="font-medium">{pricePreview.total}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Caution</span>
                        <span className="font-medium">{pricePreview.deposit}€</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">{pricePreview.total}€</span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting || !pricePreview}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 text-lg"
                  >
                    {submitting ? "Envoi en cours..." : "Réserver"}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Paiement sécurisé sur la plateforme Shoptonoutil avec caution</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
