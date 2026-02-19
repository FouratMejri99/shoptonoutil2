import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateToolDescription,
  isHuggingFaceConfigured,
} from "@/lib/huggingface";
import { productsService, supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  Globe,
  Loader2,
  Lock,
  Package,
  Sparkles,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const toolCategories = [
  {
    category: "Outils électroportatifs",
    tools: [
      "Perceuse filaire / sans fil",
      "Visseuse à choc",
      "Perforateur burineur",
      "Marteau-piqueur portatif",
      "Visseuse plaquiste",
      "Mélangeur / malaxeur électrique",
      "Scie sauteuse",
      "Scie circulaire",
      "Scie sabre",
      "Scie plongeante",
      "Scie à onglet / radiale",
      "Scie multifonction oscillante",
      "Scie à chaîne électrique",
      "Ponceuse orbitale",
      "Ponceuse excentrique",
      "Ponceuse à bande",
      "Ponceuse triangulaire",
      "Polisseuse / lustreuse",
      "Défonceuse",
      "Lamelleuse",
      "Rabot électrique",
      "Affleureuse",
      "Scie à carrelage",
      "Coupe-carrelage électrique",
      "Meuleuse d'angle",
      "Découpeur plasma",
      "Découpeur thermique",
      "Décapeur thermique",
      "Fer à souder",
    ],
  },
  {
    category: "Chantier & gros œuvre",
    tools: [
      "Marteau-piqueur (électrique ou thermique)",
      "Plaque vibrante / pilonneuse",
      "Bétonnière",
      "Scie à sol",
      "Laser de chantier (rotatif)",
      "Niveleuse laser",
      "Échafaudage fixe ou roulant",
      "Etançons / étais",
      "Déshumidificateur de chantier",
      "Chauffage de chantier",
      "Aspirateur de chantier haut débit",
      "Groupes électrogènes",
      "Compresseur d'air",
      "Cintreuse à béton",
    ],
  },
  {
    category: "Plomberie",
    tools: [
      "Furet électrique / déboucheur électrique",
      "Caméra d'inspection de canalisations",
      "Pince à sertir",
      "Clef à griffe",
      "Pompe vide-cave",
      "Coupe-tuyau PVC",
      "Soudure cuivre",
      "Kit de recherche de fuite",
      "Gel de congélation de tuyaux",
      "Nettoyeur haute pression pour canalisations",
    ],
  },
  {
    category: "Menuiserie & travail du bois",
    tools: [
      "Scie sur table",
      "Raboteuse / dégauchisseuse",
      "Tour à bois",
      "Presse / serre-joints pro",
      "Pistolet à clous pneumatique",
      "Agrafeuse électrique",
      "Affûteuse",
      "Aspiration pour copeaux",
      "Gabarits de perçage",
    ],
  },
  {
    category: "Peinture & rénovation",
    tools: [
      "Ponceuses murales girafes",
      "Lève-plaque de plâtre",
      "Pulvérisateur / pistola à peinture",
      "Nettoyeur vapeur",
      "Machine à enduire",
      "Mélangeur de peinture",
      "Shampouineuse moquette",
      "Décolleuse de papier peint",
    ],
  },
  {
    category: "Jardinage & extérieur",
    tools: [
      "Taille-haies",
      "Tondeuse à gazon",
      "Débroussailleuse",
      "Broyeur de végétaux",
      "Motobineuse",
      "Scarificateur",
      "Tronçonneuse",
      "Nettoyeur haute pression",
      "Aérateur / rouleau de gazon",
      "Aspirateur/souffleur de feuilles",
      "Coupe-bordure",
      "Tarière thermique",
    ],
  },
  {
    category: "Transport, manutention & levage",
    tools: [
      "Diable / chariot de transport",
      "Chariot élévateur",
      "Nacelle, échelle",
      "Palan électrique",
      "Treuils",
      "Transpalette",
      "Cric hydraulique",
      "Mini-dumper",
      "Camion type utilitaire",
    ],
  },
  {
    category: "Sécurité et équipement",
    tools: [
      "Équipements de protection",
      "Bâches de protection",
      "Systèmes d'aspiration de poussières",
      "Générateur de lumière / projecteurs LED",
      "Barrières de sécurité chantier",
      "Coffres sécurisés pour matériels",
    ],
  },
];

export default function PublierOutil() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check current user
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    characteristics: "",
    condition: "",
    city: "",
    address: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiMode, setAIMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hfConfigured, setHfConfigured] = useState(false);

  useEffect(() => {
    setHfConfigured(isHuggingFaceConfigured());
  }, []);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show restricted popup if not logged in
  if (!user) {
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
              Vous devez être connecté pour publier un outil sur ShopTonOutil.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={loginData.email}
                  onChange={e =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Votre mot de passe"
                  value={loginData.password}
                  onChange={e =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loginLoading ? "Connexion..." : "Se connecter"}
              </button>
              <div className="text-sm text-gray-500">
                Pas encore de compte?{" "}
                <span className="text-blue-600 font-medium">
                  Contactez-nous
                </span>{" "}
                pour créer un compte
              </div>
            </div>

            <Link href="/">
              <button className="mt-6 text-gray-500 hover:text-gray-700">
                ← Retour à l'accueil
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Veuillez d'abord sélectionner un outil et une catégorie");
      return;
    }

    setIsGenerating(true);
    try {
      const description = await generateToolDescription(
        formData.name,
        formData.category,
        formData.condition || "bon état"
      );
      setFormData(prev => ({ ...prev, description }));
      toast.success("Description générée avec succès!");
    } catch (error: any) {
      console.error("Error generating description:", error);
      toast.error(
        error.message || "Erreur lors de la génération de la description"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name) {
      toast.error("Veuillez entrer un nom pour l'outil");
      return;
    }
    if (!formData.category) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    if (!formData.description) {
      toast.error("Veuillez entrer une description");
      return;
    }
    if (!formData.price) {
      toast.error("Veuillez entrer un prix");
      return;
    }
    if (!formData.city) {
      toast.error("Veuillez entrer une ville");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Form data:", formData);
      console.log("Image file:", imageFile);

      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        try {
          console.log("Uploading image file:", imageFile.name);
          imageUrl = await productsService.uploadProductImage(imageFile);
          console.log("Image uploaded successfully:", imageUrl);
        } catch (storageError) {
          console.error("Storage error (bucket may not exist):", storageError);
          toast.error(
            "Erreur lors de l'upload de l'image. L'outil sera publié sans image."
          );
        }
      }

      // Insert into publish table
      const { data, error } = await supabase
        .from("publish")
        .insert([
          {
            user_id: user?.id,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            subcategory: formData.subcategory,
            characteristics: formData.characteristics,
            deposit: formData.condition || "Bon état",
            city: formData.city,
            address: formData.address,
            image_url: imageUrl,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting:", error);
        toast.error("Erreur lors de la publication. Veuillez réessayer.");
      } else {
        toast.success("Votre outil a été publié avec succès !");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          subcategory: "",
          characteristics: "",
          condition: "",
          city: "",
          address: "",
        });
        setImageFile(null);
        setCurrentStep(1);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate step 1 before proceeding
    if (currentStep === 1) {
      if (!formData.name) {
        toast.error("Veuillez entrer un nom pour l'outil");
        return;
      }
      if (!formData.category) {
        toast.error("Veuillez sélectionner une catégorie");
        return;
      }
      if (!formData.description) {
        toast.error("Veuillez entrer une description");
        return;
      }
    }
    // Validate step 3 before proceeding
    if (currentStep === 3) {
      if (!formData.price) {
        toast.error("Veuillez entrer un prix");
        return;
      }
      if (!formData.city) {
        toast.error("Veuillez entrer une ville");
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      icon: Package,
      title: "Catégorie",
      description: "Sélectionnez votre outil",
    },
    { icon: Upload, title: "Photos", description: "Ajoutez des images" },
    { icon: DollarSign, title: "Prix", description: "Fixez votre tarif" },
    { icon: Globe, title: "Publication", description: "Finalisez" },
  ];

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
              Publier un outil
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Louez vos outils de bricolage à des milliers de clients
              potentiels. Simple, rapide et efficace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep > idx + 1
                        ? "bg-green-500"
                        : currentStep === idx + 1
                          ? "bg-blue-600"
                          : "bg-gray-300"
                    }`}
                  >
                    {currentStep > idx + 1 ? (
                      <span className="text-white">✓</span>
                    ) : (
                      <step.icon className="text-white" size={20} />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= idx + 1
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-2 ${
                      currentStep > idx + 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publish Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {currentStep === 1 &&
                    "Sélectionnez la catégorie de votre outil"}
                  {currentStep === 2 && "Photos de l'outil"}
                  {currentStep === 3 && "Prix et localisation"}
                  {currentStep === 4 && "Confirmation"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Category */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom pour l'outil *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Perceuse Makita 18V"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie principale *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {toolCategories.map(cat => (
                            <option key={cat.category} value={cat.category}>
                              {cat.category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.category && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Outil spécifique *
                          </label>
                          <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner un outil</option>
                            {toolCategories
                              .find(c => c.category === formData.category)
                              ?.tools.map(tool => (
                                <option key={tool} value={tool}>
                                  {tool}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description de l'outil *
                        </label>
                        <div className="relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Décrivez l'état, les caractéristiques, les accessoires inclus..."
                          />
                          <Button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={
                              isGenerating ||
                              !formData.name ||
                              !formData.category
                            }
                            className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md"
                            title={
                              hfConfigured
                                ? "Générer une description avec l'IA"
                                : "Générer une description (modèle simple)"
                            }
                          >
                            {isGenerating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            {isGenerating ? "Génération..." : "IA"}
                          </Button>
                        </div>
                        {!hfConfigured && (
                          <p className="text-xs text-amber-600 mt-1">
                            💡 Configurez VITE_HUGGING_FACE_API_KEY dans .env
                            pour une génération IA avancée
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          État de l'outil *
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner l'état</option>
                          <option value="neuf">Neuf</option>
                          <option value="comme-neuf">Comme neuf</option>
                          <option value="bon-etat">Bon état</option>
                          <option value="etat-correct">État correct</option>
                        </select>
                      </div>

                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={
                          !formData.category ||
                          !formData.subcategory ||
                          !formData.description ||
                          !formData.condition
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-lg"
                      >
                        Suivant
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Image */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photo principale de l'outil
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-gray-600">
                              {imageFile
                                ? imageFile.name
                                : "Cliquez pour télécharger une photo"}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              PNG, JPG jusqu'à 5MB
                            </p>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex-1 h-12 text-lg rounded-lg"
                        >
                          <ArrowLeft className="mr-2" size={20} />
                          Retour
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-lg"
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Price & Location */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix par jour (€) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 25.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Reims"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse complète
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Adresse complète"
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex-1 h-12 text-lg rounded-lg"
                        >
                          <ArrowLeft className="mr-2" size={20} />
                          Retour
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!formData.price}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-lg"
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                        <p>
                          <strong>Catégorie:</strong> {formData.category}
                        </p>
                        <p>
                          <strong>Outil:</strong> {formData.subcategory}
                        </p>
                        <p>
                          <strong>État:</strong> {formData.condition}
                        </p>
                        <p>
                          <strong>Prix:</strong> {formData.price}€ / jour
                        </p>
                        {formData.city && (
                          <p>
                            <strong>Ville:</strong> {formData.city}
                          </p>
                        )}
                        {imageFile && (
                          <p>
                            <strong>Image:</strong> {imageFile.name}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="flex-1 h-12 text-lg rounded-lg"
                        >
                          <ArrowLeft className="mr-2" size={20} />
                          Retour
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-lg"
                        >
                          {isSubmitting ? "Publication..." : "Publier l'outil"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
