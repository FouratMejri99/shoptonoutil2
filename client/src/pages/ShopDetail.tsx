import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation as useWouterLocation } from "wouter";

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

  // Login dialog state
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Message dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Get the item ID from the URL
  const itemId = location.split("/").pop();

  // Fetch current user
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
  const { data: itemsData, isLoading: isLoadingItems } =
    trpc.publish.list.useQuery();

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Annonce non trouvée
        </h1>
        <Link href="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Retour à la boutique
          </Button>
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
                  {item.price
                    ? `${Number(item.price).toFixed(2)}€`
                    : "Prix sur demande"}
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )}

            {/* Characteristics */}
            {item.characteristics && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Caractéristiques
                </h3>
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
                  <Dialog
                    open={messageDialogOpen}
                    onOpenChange={setMessageDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full h-14 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <MessageCircle className="mr-2" />
                        Envoyer un message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Envoyer un message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">
                          Vous allez envoyer un message à propos de:{" "}
                          <strong>{item?.name}</strong>
                        </p>
                        <textarea
                          value={messageText}
                          onChange={e => setMessageText(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setMessageDialogOpen(false);
                              setMessageText("");
                            }}
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={async () => {
                              if (!messageText.trim()) {
                                toast.error("Veuillez entrer un message");
                                return;
                              }
                              if (!user || !item?.user_id) {
                                toast.error("Impossible d'envoyer le message");
                                return;
                              }

                              // Prevent sending message to yourself
                              if (user.id === item.user_id) {
                                toast.error(
                                  "Vous ne pouvez pas vous envoyer un message à vous-même"
                                );
                                return;
                              }

                              setSendingMessage(true);
                              try {
                                // Check if conversation already exists
                                const {
                                  data: existingConv,
                                  error: checkError,
                                } = await supabase
                                  .from("conversations")
                                  .select("id")
                                  .or(
                                    `and(participant1_id.eq.${user.id},participant2_id.eq.${item.user_id}),and(participant1_id.eq.${item.user_id},participant2_id.eq.${user.id})`
                                  )
                                  .eq("tool_id", item.id)
                                  .maybeSingle();

                                if (checkError) {
                                  console.error(
                                    "Check conversation error:",
                                    checkError
                                  );
                                }

                                let conversationId;

                                if (existingConv) {
                                  conversationId = existingConv.id;
                                } else {
                                  // Create new conversation
                                  const { data: newConv, error: convError } =
                                    await supabase
                                      .from("conversations")
                                      .insert([
                                        {
                                          participant1_id: user.id,
                                          participant2_id: item.user_id,
                                          tool_id: item.id,
                                        },
                                      ])
                                      .select("id")
                                      .single();

                                  if (convError) {
                                    console.error(
                                      "Conversation error:",
                                      convError
                                    );
                                    toast.error(
                                      convError.message ||
                                        "Erreur lors de la création de la conversation"
                                    );
                                    return;
                                  }
                                  conversationId = newConv.id;
                                }

                                // Send the message
                                const { error: msgError } = await supabase
                                  .from("messages")
                                  .insert([
                                    {
                                      conversation_id: conversationId,
                                      sender_id: user.id,
                                      content: messageText.trim(),
                                    },
                                  ]);

                                if (msgError) {
                                  console.error("Message error:", msgError);
                                  toast.error(
                                    "Erreur lors de l'envoi du message"
                                  );
                                  return;
                                }

                                // Update conversation timestamp
                                await supabase
                                  .from("conversations")
                                  .update({
                                    updated_at: new Date().toISOString(),
                                  })
                                  .eq("id", conversationId);

                                toast.success("Message envoyé !");
                                setMessageDialogOpen(false);
                                setMessageText("");
                                window.location.href = `/messages?conversation=${conversationId}`;
                              } catch (error: any) {
                                console.error("Error sending message:", error);
                                toast.error(
                                  "Erreur lors de l'envoi du message"
                                );
                              } finally {
                                setSendingMessage(false);
                              }
                            }}
                            disabled={sendingMessage || !messageText.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {sendingMessage ? "Envoi..." : "Envoyer"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

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
                // Not logged in - show login dialog
                <div className="text-center">
                  <p className="text-gray-600 mb-3">
                    Connectez-vous pour contacter le propriétaire ou réserver
                  </p>
                  <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-14 text-lg"
                      >
                        Se connecter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold">
                          {isRegistering
                            ? "Créer un compte"
                            : "Connexion à votre compte"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {!isRegistering ? (
                          // Login Form
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Email
                              </label>
                              <div className="relative">
                                <Mail
                                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  size={18}
                                />
                                <input
                                  type="email"
                                  placeholder="votre@email.com"
                                  value={loginEmail}
                                  onChange={e => setLoginEmail(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Mot de passe
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  value={loginPassword}
                                  onChange={e =>
                                    setLoginPassword(e.target.value)
                                  }
                                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <Button
                              onClick={async () => {
                                if (!loginEmail || !loginPassword) {
                                  toast.error(
                                    "Veuillez remplir tous les champs"
                                  );
                                  return;
                                }
                                setLoginLoading(true);
                                try {
                                  const { error } =
                                    await supabase.auth.signInWithPassword({
                                      email: loginEmail,
                                      password: loginPassword,
                                    });
                                  if (error) {
                                    toast.error(error.message);
                                  } else {
                                    toast.success("Connexion réussie!");
                                    setLoginOpen(false);
                                    window.location.reload();
                                  }
                                } catch (error: any) {
                                  toast.error(
                                    error.message || "Erreur de connexion"
                                  );
                                } finally {
                                  setLoginLoading(false);
                                }
                              }}
                              disabled={loginLoading}
                              className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12"
                            >
                              {loginLoading ? "Connexion..." : "Se connecter"}
                            </Button>
                            <div className="text-center">
                              <button
                                onClick={() => setIsRegistering(true)}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Pas encore de compte ? S'inscrire
                              </button>
                            </div>
                          </>
                        ) : (
                          // Registration Form
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Nom complet
                              </label>
                              <input
                                type="text"
                                placeholder="Votre nom"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Email
                              </label>
                              <input
                                type="email"
                                placeholder="votre@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Mot de passe
                              </label>
                              <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                              />
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">
                              Créer un compte
                            </Button>
                            <div className="text-center">
                              <button
                                onClick={() => setIsRegistering(false)}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Déjà un compte ? Se connecter
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
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
              Publié le{" "}
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
