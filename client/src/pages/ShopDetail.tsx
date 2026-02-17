import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Check, 
  CreditCard,
  MessageCircle,
  User,
  Phone,
  Mail
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation as useWouterLocation } from "wouter";
import { toast } from "sonner";

interface PublishItem {
  id: number;
  created_at: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  subcategory: string | null;
  characteristics: string | null;
  deposit: number | null;
  description: string | null;
  user_id: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
}

export default function ShopDetail() {
  const [location, setLocation] = useWouterLocation();
  const [item, setItem] = useState<PublishItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Get the item ID from the URL
  const itemId = location.split("/").pop();

  // Fetch current user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Check if current user is the owner
  useEffect(() => {
    if (user && item) {
      setIsOwner(user.id === item.user_id);
    }
  }, [user, item]);

  // Fetch the item details using publish service
  const { data: itemsData, isLoading: isLoadingItems } = trpc.publish.list.useQuery();

  useEffect(() => {
    if (itemsData && itemId) {
      const foundItem = itemsData.find((i: any) => i.id === parseInt(itemId));
      if (foundItem) {
        setItem(foundItem);
      }
    }
    setIsLoading(isLoadingItems);
  }, [itemsData, itemId, isLoadingItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Annonce non trouvée</h1>
        <Link href="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700">Retour à la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/shop">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft size={18} />
                Retour
              </Button>
            </Link>
            <h1 className="font-bold text-gray-900">{item.name}</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden rounded-3xl">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">📦</span>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Price and Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                {item.category}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">
                  {item.price ? `${Number(item.price).toFixed(2)}€` : "Prix sur demande"}
                </span>
                {item.price && <span className="text-gray-500">/jour</span>}
              </div>
              {item.deposit && (
                <p className="text-sm text-gray-500 mt-1">
                  Caution: {item.deposit}€
                </p>
              )}
            </div>

            {/* Location */}
            {item.city && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={20} className="text-gray-400" />
                <span>{item.city}</span>
                {item.address && <span>, {item.address}</span>}
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )}

            {/* Characteristics */}
            {item.characteristics && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {item.characteristics.split(",").map((char, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Check size={14} className="text-green-500" />
                      {char.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Subcategory */}
            {item.subcategory && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Type</h3>
                <p className="text-gray-600">{item.subcategory}</p>
              </div>
            )}

            {/* Reserve Button */}
            <div className="pt-4 border-t">
              {isOwner ? (
                // Owner sees a message that this is their item
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-blue-800 font-medium">
                    C'est votre annonce
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Vous êtes le propriétaire de cette annonce
                  </p>
                </div>
              ) : user ? (
                // Logged in user who is not the owner can send message
                <>
                  <Button
                    size="lg"
                    onClick={async () => {
                      if (!user || !item?.user_id) return;
                      
                      setSendingMessage(true);
                      try {
                        // Check if conversation already exists
                        const { data: existingConv } = await supabase
                          .from("conversations")
                          .select("id")
                          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${item.user_id}),and(participant1_id.eq.${item.user_id},participant2_id.eq.${user.id})`)
                          .eq("tool_id", item.id)
                          .maybeSingle();
                        
                        let conversationId;
                        
                        if (existingConv) {
                          conversationId = existingConv.id;
                        } else {
                          // Create new conversation
                          const { data: newConv, error: convError } = await supabase
                            .from("conversations")
                            .insert([
                              {
                                participant1_id: user.id,
                                participant2_id: item.user_id,
                                tool_id: item.id,
                                tool_name: item.name,
                              }
                            ])
                            .select("id")
                            .single();
                          
                          if (convError) {
                            console.error("Conversation error:", convError);
                            // If error, just go to messages page
                            window.location.href = "/messages";
                            return;
                          }
                          conversationId = newConv.id;
                        }
                        
                        window.location.href = `/messages?conversation=${conversationId}`;
                      } catch (error: any) {
                        console.error("Error starting conversation:", error);
                        // On error, go to messages page
                        window.location.href = "/messages";
                      } finally {
                        setSendingMessage(false);
                      }
                    }}
                    disabled={sendingMessage}
                    variant="outline"
                    className="w-full h-14 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <MessageCircle className="mr-2" />
                    {sendingMessage ? "Envoi..." : "Envoyer un message"}
                  </Button>
                  
                  <Link href={`/reservation?tool=${item.id}`}>
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-14 text-lg mt-3"
                    >
                      <CreditCard className="mr-2" />
                      Réserver maintenant
                    </Button>
                  </Link>
                </>
              ) : (
                // Not logged in - prompt to login
                <div className="text-center">
                  <p className="text-gray-600 mb-3">
                    Connectez-vous pour contacter le propriétaire ou réserver
                  </p>
                  <Link href="/profile">
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-14 text-lg"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </div>
              )}
              
              {user && !isOwner && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Paiement sécurisé par carte bancaire
                </p>
              )}
            </div>

            {/* Posted date */}
            <div className="text-sm text-gray-500">
              Publié le {item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric"
              }) : "N/A"}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
