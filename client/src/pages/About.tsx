import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  Package,
  Shield,
  Star,
  Users,
} from "lucide-react";

// Images for About page
const aboutImages = {
  hero: "/S.png",
  story: "/S.png",
  team: "/S.png",
  values: "/S.png",
};

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 backdrop-blur-sm text-blue-100 text-sm font-medium mb-6 border border-blue-400/30">
              À propos de nous
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Votre partenaire de confiance pour <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                tous vos projets de bricolage
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Leader dans la vente d'outils et accessoires Bricolor.
              Qualité professionnelle et service personnalisé.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Notre histoire
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Depuis 2020, shoptonoutil2 est votre partenaire de confiance
                  pour tous vos projets de bricolage. Nous proposons une large
                  gamme d'outils et accessoires de qualité professionnelle
                  pour les particuliers et les professionnels.
                </p>
                <p>
                  Notre engagement est de vous offrir les meilleurs produits
                  aux prix les plus compétitifs, avec un service client
                  personnalisé pour répondre à tous vos besoins.
                </p>
                <p>
                  Nous sélectionnons soigneusement chaque produit pour garantir
                  qualité et durabilité. Faites confiance à notre expertise
                  pour vos projets.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutImages.story}
                  alt="Notre boutique"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-100 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
              Pourquoi nous choisir
            </span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">
              Nos engagements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="text-blue-600" size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Large gamme de produits
                  </h3>
                  <p className="text-gray-600">
                    Plus de 5000 produits disponibles pour tous vos besoins
                    de bricolage et de construction.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="text-blue-600" size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Qualité garantie
                  </h3>
                  <p className="text-gray-600">
                    Tous nos produits sont sélectionnés avec soin pour garantir
                    qualité et durabilité.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="text-blue-600" size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Service client réactif
                  </h3>
                  <p className="text-gray-600">
                    Notre équipe est disponible pour vous conseiller et vous
                    accompagner dans vos projets.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "5000+", label: "Produits", icon: Package },
              { number: "50+", label: "Marques partenaires", icon: Award },
              { number: "98%", label: "Satisfaction client", icon: Star },
              { number: "24h", label: "Livraison rapide", icon: Clock },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon className="mx-auto mb-4 text-blue-600" size={32} />
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Prêt à démarrer vos projets ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
             Contactez-nous pour bénéficier de conseils personnalisés
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Nous contacter
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
