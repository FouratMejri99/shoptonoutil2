// Static outil data with local images for fast loading
// Use these images instead of external URLs for better performance
// Replace with actual tool images when available

export interface Outil {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

export const outilsData: Outil[] = [
  {
    id: 1,
    name: "Perceuse-visseuse sans fil 18V",
    description: "Performance professionnelle avec 2 batteries",
    price: 149.99,
    image: "/S.png",
    rating: 4.8,
    reviews: 245,
    category: "Outils électriques",
  },
  {
    id: 2,
    name: "Kit d'outils à main 100 pièces",
    description: "Complet pour tous vos travaux",
    price: 79.99,
    image: "/logo-blue-short.png",
    rating: 4.6,
    reviews: 189,
    category: "Outils à main",
  },
  {
    id: 3,
    name: "Scie circulaire 1400W",
    description: "Précision et puissance",
    price: 119.99,
    image: "/ShortLogo.png",
    rating: 4.7,
    reviews: 156,
    category: "Outils électriques",
  },
  {
    id: 4,
    name: "Boîte à outils professionnelle",
    description: "Rangement modulable",
    price: 59.99,
    image: "/avatar1.png",
    rating: 4.5,
    reviews: 98,
    category: "Rangement",
  },
  {
    id: 5,
    name: "Meuleuse d'angle 2300W",
    description: "Puissance extrême pour le meulage",
    price: 89.99,
    image: "/avatar2.png",
    rating: 4.9,
    reviews: 312,
    category: "Outils électriques",
  },
  {
    id: 6,
    name: "Marteau de charpentier professionnel",
    description: "Ergo grip anti-vibration",
    price: 34.99,
    image: "/avatar3.jpg",
    rating: 4.7,
    reviews: 87,
    category: "Outils à main",
  },
  {
    id: 7,
    name: "Station de peinture professionnelle",
    description: "Pulvérisation fine et uniforme",
    price: 249.99,
    image: "/logo-white-short.png",
    rating: 4.6,
    reviews: 145,
    category: "Peintures",
  },
  {
    id: 8,
    name: "Étau de table robuste",
    description: "Fixation sécurisée",
    price: 45.99,
    image: "/logo-blue-full.png",
    rating: 4.4,
    reviews: 76,
    category: "Outils à main",
  },
];

export const categoriesData = [
  {
    id: 1,
    name: "Outils à main",
    slug: "outils-a-main",
    description: "Marteaux, tournevis, clés...",
    image: "/S.png",
    icon: "Package",
  },
  {
    id: 2,
    name: "Outils électriques",
    slug: "outils-electriques",
    description: "Perceuses, scies, ponceuses...",
    image: "/ShortLogo.png",
    icon: "CheckCircle",
  },
  {
    id: 3,
    name: "Quincaillerie",
    slug: "quincaillerie",
    description: "Vis, écrous, boulons...",
    image: "/logo-blue-short.png",
    icon: "Package",
  },
  {
    id: 4,
    name: "Peintures & revêtements",
    slug: "peintures",
    description: "Peintures, vernis, revêtements...",
    image: "/logo-white-short.png",
    icon: "CheckCircle",
  },
  {
    id: 5,
    name: "Électricité",
    slug: "electricite",
    description: "Câbles, prises, interrupteurs...",
    image: "/logo-blue-full.png",
    icon: "CheckCircle",
  },
  {
    id: 6,
    name: "Plomberie",
    slug: "plomberie",
    description: "Tuyaux, robinets, raccords...",
    image: "/avatar1.png",
    icon: "CheckCircle",
  },
];
