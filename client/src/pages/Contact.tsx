import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  Package,
  Phone,
  Send,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Image for Contact page
const contactImage = "/S.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Submit to leads table
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            subject: formData.subject,
          },
        ]);

      if (error) {
        console.error("Error submitting lead:", error);
        toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
      } else {
        toast.success("Merci ! Nous vous contacterons bientôt.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error(
        "Échec de l'envoi. Veuillez réessayer ou nous contacter à contact@shoptonoutil.fr"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-white">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-blue-50/50 backdrop-blur-3xl -z-10"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-6">
              Nous contacter
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Vous avez des questions sur la location d'outils ? Notre équipe est là pour vous aider.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative z-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Téléphone",
                content: "+33 1 23 45 67 89",
                sub: "Lun-Ven, 9h-18h",
                link: "tel:+33123456789",
              },
              {
                icon: Mail,
                title: "Email",
                content: "contact@shoptonoutil.fr",
                sub: "Nous répondons sous 24h",
                link: "mailto:contact@shoptonoutil.fr",
              },
              {
                icon: MapPin,
                title: "Bureaux",
                content: "Paris, France",
                sub: "Nous proposons des rendez-vous",
                link: null,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-md text-center">
                    <CardContent className="pt-8 pb-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-blue-600 hover:underline block"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-900">{item.content}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-2">{item.sub}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative z-10 py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ShopTonOutil est votre partenaire de confiance pour la location d'outils de bricolage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Paiement sécurisé",
                description: "Vos transactions sont protégées et sécurisées",
              },
              {
                icon: Package,
                title: "Outils de qualité",
                description: "Tous nos outils sont vérifiés et entretenus",
              },
              {
                icon: Clock,
                title: "Disponibilité 24/7",
                description: "Réservez à tout moment depuis chez vous",
              },
              {
                icon: Users,
                title: "Support réactif",
                description: "Une équipe disponible pour vous accompagner",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-none shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sujet
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner un sujet</option>
                          <option value="question">Question générale</option>
                          <option value="location">Demande de location</option>
                          <option value="publication">Publier un outil</option>
                          <option value="support">Support technique</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-lg"
                    >
                      {isSending ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                          Envoi en cours...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Envoyer le message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Comment publier un outil ?",
                a: "Cliquez sur 'Publier un outil' dans le menu, remplissez les informations et ajoutez une photo. C'est simple et rapide !",
              },
              {
                q: "Comment louer un outil ?",
                a: "Parcourez les outils disponibles, contactez le propriétaire via notre système de messagerie et convenez des modalités de location.",
              },
              {
                q: "Comment la caution fonctionne-t-elle ?",
                a: "La caution est bloquée sur votre carte mais jamais débitée. Elle est libérée automatiquement après la restitution de l工具 en bon état.",
              },
              {
                q: "Puis-je annuler une réservation ?",
                a: "Oui, vous pouvez annuler jusqu'à 24h avant la date de location.Contactez le propriétaire pour arranged les détails.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 ml-8">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
