/**
 * AI integration using Google Gemini API
 * Uses @google/generative-ai SDK for generating tool descriptions and images
 * Note: Requires VITE_GEMINI_API_KEY in .env file
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Fallback templates for when API is not available
const descriptionTemplates = {
  "Outils électroportatifs": (name: string, condition: string) =>
    `Cette ${name} est un outil professionnel de haute qualité, parfait pour tous vos travaux de bricolage et rénovation. 
     
Équipement en ${condition}, entretenu régulièrement et pleinement fonctionnel. Livré avec tous ses accessoires d'origine (chargeur, batteries si applicable, boîte de rangement).

Ideal pour les professionnels et particuliers exigeants. Disponible immédiatement pour location.`,

  "Chantier & gros œuvre": (name: string, condition: string) =>
    `Cette ${name} est un équipement professionnel robuste et performant, adapté aux travaux de chantier et gros œuvre.

État : ${condition}. Machine révisée et prête à l'emploi. Parfaitement entretenue pour garantir fiabilité et sécurité sur vos chants.

Disponible pour location avec livraison possible.`,

  Plomberie: (name: string, condition: string) =>
    `Cette ${name} est un outil professionnel de plomberie, idéal pour tous vos travaux d'installation et de réparation.

Équipement en ${condition}, récemment entretenu et parfaitement fonctionnel. Accessoires inclus.

Parfait pour les professionnels et particuliers. Disponible pour location.`,

  "Jardinage & extérieur": (name: string, condition: string) =>
    `Cette ${name} est un outil de jardinage performant, idéal pour l'entretien de votre espace extérieur.

Équipement en ${condition}, révisé et fonctionnel. Facile à utiliser et maniable.

Parfait pour les particuliers et professionnels du paysage. Disponible pour location.`,

  "Peinture & revêtements": (name: string, condition: string) =>
    `Cette ${name} est un équipement professionnel de peinture, parfait pour vos travaux de rénovation.

Équipement en ${condition}, nettoyé et parfaitement fonctionnel. Accessoires inclus.

Résultat professionnel garanti. Disponible pour location.`,

  "Transport & manutention": (name: string, condition: string) =>
    `Cet équipement de transport ${name} est robuste et fiable pour toutes vos besoins de manutention.

État : ${condition}. Vérifié et fonctionnel. Parfait pour les professionnels du bâtiment et de la logistique.`,

  "Sécurité et équipement": (name: string, condition: string) =>
    `Cet équipement de sécurité ${name} est conforme aux normes en vigueur.

${condition}, cet équipement a été vérifié et est prêt à l'utilisation.`,
};

/**
 * Get Gemini AI instance
 */
function getGenAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Generate a tool description using Google Gemini API
 * @param toolName - The name of the tool
 * @param category - The category of the tool
 * @param condition - The condition of the tool
 * @returns Generated description text
 */
export async function generateToolDescription(
  toolName: string,
  category: string,
  condition: string = "bon état"
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // Use fallback template if no API key
    const templateFn =
      descriptionTemplates[category as keyof typeof descriptionTemplates];
    if (templateFn) {
      return templateFn(toolName, condition);
    }
    return descriptionTemplates["Outils électroportatifs"](toolName, condition);
  }

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a prompt in French for generating tool descriptions
    const prompt = `Génère une description professionnelle en français pour la location d'un outil de bricolage. Sois concis mais informatif.

Outil : ${toolName}
Catégorie : ${category}
État : ${condition}

Description (2-3 phrases) :`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (text) {
      return text;
    }

    throw new Error("No text generated from Gemini API");
  } catch (error: any) {
    console.error("Error generating description with Gemini:", error);
    // Fallback to template on error
    const templateFn =
      descriptionTemplates[category as keyof typeof descriptionTemplates];
    if (templateFn) {
      return templateFn(toolName, condition);
    }
    return descriptionTemplates["Outils électroportatifs"](toolName, condition);
  }
}

/**
 * Check if AI description generation is configured
 */
export function isHuggingFaceConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}

/**
 * Generate an image for a tool using Google Gemini API
 * @param toolName - The name of the tool
 * @returns Data URL of the generated image
 */
export async function generateToolImage(toolName: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API key not configured. Please add VITE_GEMINI_API_KEY to your .env file"
    );
  }

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
    });

    // Create a prompt in English for image generation (works better)
    const prompt = `Professional product photo of a ${toolName} for e-commerce, white background, studio lighting, high quality, clean design, centered, no text`;

    const result = await model.generateContent(prompt);

    // Extract the image from the response
    const response = result.response;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          // Determine mime type, default to png
          const mimeType = part.inlineData.mimeType || "image/png";
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated from Gemini API");
  } catch (error: any) {
    console.error("Error generating image with Gemini:", error);
    throw new Error(error.message || "Failed to generate image");
  }
}
