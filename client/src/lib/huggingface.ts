/**
 * Hugging Face API integration for text generation
 * Uses the free gpt2 model for generating tool descriptions
 * Note: Requires VITE_HUGGING_FACE_API_KEY in .env file
 */

const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2";
const HF_IMAGE_API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

// Fallback templates for when API is not available
const descriptionTemplates = {
  "Outils électroportatifs": (name: string, condition: string) =>
    `Cette ${name} est un outil professionnel de haute qualité, parfait pour tous vos travaux de bricolage et rénovation. 
    
Équipement en ${condition}, entretenu régulièrement et pleinement fonctionnel. Livré avec tous ses accessoires d'origine (chargeur, batteries si applicable, boîte de rangement).

Idéal pour les professionnels et particuliers exigeants. Disponible immédiatement pour location.`,

  "Chantier & gros œuvre": (name: string, condition: string) =>
    `Cette ${name} est un équipement professionnel robuste et performant, adapté aux travaux de chantier et gros œuvre.

État : ${condition}. Machine révisée et prête à l'emploi. Parfaitement entretenue pour garantir fiabilité et sécurité sur vos chantiers.

Disponible pour location avec livraison possible.`,

  Plomberie: (name: string, condition: string) =>
    `Cette ${name} est un outil professionnel de plomberie, idéal pour tous vos travaux d'installation et de réparation.

Équipement en ${condition}, récemment entretenu et parfaitement fonctionnel. Accessoires inclus.

Parfait pour les plombiers professionnels et les particuliers.`,

  "Menuiserie & travail du bois": (name: string, condition: string) =>
    `Cette ${name} est un outil professionnel de menuiserie, conçu pour un travail précis du bois.

${condition}, cette machine est parfaitement entretenue et prête à l'emploi. Livrée avec les accessoires nécessaires.

Idéal pour les menuisiers et ébénistes.`,

  "Peinture & rénovation": (name: string, condition: string) =>
    `Cette ${name} est un équipement professionnel de peinture et rénovation, idéal pour vos projets de transformation.

État : ${condition}. Équipement nettoyé et révisé après chaque utilisation.

Parfait pour les professionnels et particuliers exigeants.`,

  "Jardinage & extérieur": (name: string, condition: string) =>
    `Cette ${name} est un outil de jardinage professionnel, adapté à l'entretien de vos espaces verts.

${condition}, cet équipement est pleinement fonctionnel et prêt à l'utilisation. Entretien régulier effectué.

Idéal pour les jardiniers professionnels et particuliers.`,

  "Transport, manutention & levage": (name: string, condition: string) =>
    `Cette ${name} est un équipement professionnel de manutention, idéal pour vos travaux de levage et transport.

État : ${condition}. Révisé et sécurisé. Conforme aux normes de sécurité en vigueur.

Parfait pour les professionnels du bâtiment et de la logistique.`,

  "Sécurité et équipement": (name: string, condition: string) =>
    `Cet équipement de sécurité ${name} est conforme aux normes en vigueur.

${condition}, cet équipement a été vérifié et est prêt à l'utilisation.`,
};

/**
 * Generate a description for a tool using Hugging Face API
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
  const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;

  if (!apiKey) {
    // Use fallback template if no API key
    const templateFn =
      descriptionTemplates[category as keyof typeof descriptionTemplates];
    if (templateFn) {
      return templateFn(toolName, condition);
    }
    return descriptionTemplates["Outils électroportatifs"](toolName, condition);
  }

  // Create a prompt in French for generating tool descriptions
  const prompt = `Génère une description professionnelle pour la location d'un outil de bricolage :

Outil : ${toolName}
Catégorie : ${category}
État : ${condition}

Description professionnelle :`;

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", errorText);
      // Fallback to template on error
      const templateFn =
        descriptionTemplates[category as keyof typeof descriptionTemplates];
      if (templateFn) {
        return templateFn(toolName, condition);
      }
      throw new Error("Erreur lors de la génération du texte");
    }

    const data = await response.json();

    // Extract the generated text from the response
    if (Array.isArray(data) && data[0]?.generated_text) {
      // Remove the prompt from the generated text
      const generatedText = data[0].generated_text.replace(prompt, "").trim();
      return generatedText;
    }

    // Fallback to template if format is unexpected
    const templateFn =
      descriptionTemplates[category as keyof typeof descriptionTemplates];
    if (templateFn) {
      return templateFn(toolName, condition);
    }
    throw new Error("Format de réponse inattendu");
  } catch (error) {
    console.error("Error generating description:", error);
    // Fallback to template on any error
    const templateFn =
      descriptionTemplates[category as keyof typeof descriptionTemplates];
    if (templateFn) {
      return templateFn(toolName, condition);
    }
    return descriptionTemplates["Outils électroportatifs"](toolName, condition);
  }
}

/**
 * Check if Hugging Face API is configured
 * @returns true if API key is set
 */
export function isHuggingFaceConfigured(): boolean {
  return !!import.meta.env.VITE_HUGGING_FACE_API_KEY;
}

/**
 * Generate an image for a tool using Hugging Face Stable Diffusion API (nscale provider)
 * @param toolName - The name of the tool
 * @param category - The category of the tool
 * @returns Base64 encoded image data URL
 */
export async function generateToolImage(
  toolName: string,
  category: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Clé API Hugging Face non configurée. Veuillez configurer VITE_HUGGING_FACE_API_KEY dans le fichier .env"
    );
  }

  console.log(
    "Using API key (first 10 chars):",
    apiKey.substring(0, 10) + "..."
  );

  // Create a detailed prompt in English for generating tool images
  const prompt = `Professional product photography of a ${toolName}, ${category}, clean white background, studio lighting, high quality, detailed, realistic, e-commerce product image, sharp focus, professional photography`;

  try {
    console.log("Fetching from:", HF_IMAGE_API_URL);
    const response = await fetch(HF_IMAGE_API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face Image API error:", errorText);
      throw new Error("Erreur lors de la génération de l'image: " + errorText);
    }

    // Get content type to determine how to handle response
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      console.log("JSON Response keys:", Object.keys(data));
      console.log("Full JSON Response:", data);
      // The nscale API returns base64 directly in the response
      if (data?.b64_json) {
        return `data:image/png;base64,${data.b64_json}`;
      }
      // Check for other possible fields
      if (data?.image) {
        return `data:image/png;base64,${data.image}`;
      }
      console.error("Unexpected JSON response:", data);
      throw new Error("Format de réponse JSON inattendu pour l'image");
    } else if (contentType.includes("image/")) {
      // Response is directly an image blob
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const mimeType = contentType.split(";")[0];
      return `data:${mimeType};base64,${base64}`;
    }

    throw new Error("Type de contenu inattendu: " + contentType);
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Erreur réseau: Impossible de contacter l'API Hugging Face. Vérifiez votre connexion internet."
      );
    }
    throw error;
  }
}
