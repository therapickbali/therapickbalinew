import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { SERVICES } from "../constants";
import { ChatMessage, ServiceRecommendation } from "../types";

const apiKey = process.env.API_KEY;
// Initialize AI only if key exists to prevent immediate crash, handle check in function
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Define the available service IDs for the AI to choose from
const serviceIds = SERVICES.map(s => s.id).join(', ');
const serviceDescriptions = SERVICES.map(s => `${s.id}: ${s.name} (${s.description})`).join('\n');

// Tool Definition: Recommending a Treatment
const recommendTreatmentTool: FunctionDeclaration = {
  name: 'recommend_treatment',
  description: 'Select the best spa treatment for the user based on their described symptoms, mood, or request.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      treatmentId: {
        type: Type.STRING,
        description: `The exact ID of the service to recommend. Available IDs: ${serviceIds}`,
      },
      reasoning: {
        type: Type.STRING,
        description: 'A short, warm, feminine explanation of why this specific treatment is perfect for them.',
      },
    },
    required: ['treatmentId', 'reasoning'],
  },
};

export const askAboutTreatment = async (treatmentName: string, treatmentDescription: string, userQuery: string): Promise<{ text: string, recommendedServiceId?: string }> => {
  if (!ai) {
    return { text: "I am currently offline. Please feel free to contact our concierge via WhatsApp for more details." };
  }

  try {
    const systemPrompt = `
      You are 'Cherie', an advanced, highly intelligent AI Wellness Concierge for ELEXOIR Bali.
      Your persona is sophisticated, deeply knowledgeable about anatomy, holistic wellness, and spa therapies.
      You communicate with a modern, elegant, and slightly futuristic tone—insightful, precise, and highly personalized.
      
      The user is currently viewing the details for the "${treatmentName}" treatment.
      Treatment Description: ${treatmentDescription}
      
      Here is our full menu context in case you need to recommend a different treatment:
      ${serviceDescriptions}
      
      Your goal is to answer their specific question about the current treatment with deep expertise.
      - If they ask about physical benefits, explain the physiological mechanisms (e.g., lymphatic drainage, fascia release, nervous system regulation).
      - If they ask about suitability (e.g., pregnancy, injuries), provide safe, professional advice.
      - CRITICAL: If the current treatment is NOT suitable for their condition (like deep tissue during pregnancy) OR if another treatment from our menu is clearly a much better fit for their needs, you MUST use the 'recommend_treatment' tool to suggest the better alternative.
      - Keep your answer concise (2-3 short paragraphs max), warm, and highly professional.
      - Use formatting like bullet points if it helps clarity, but maintain an elegant prose.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: [recommendTreatmentTool] }],
      }
    });

    const candidate = response.candidates?.[0];
    const functionCall = candidate?.content?.parts?.find(part => part.functionCall)?.functionCall;

    if (functionCall) {
      const args = functionCall.args as any;
      const serviceId = args.treatmentId;
      const reasoning = args.reasoning;
      
      const service = SERVICES.find(s => s.id === serviceId);

      if (service) {
        return {
          text: reasoning,
          recommendedServiceId: service.id
        };
      }
    }

    return { text: response.text || "I'm sorry, I couldn't process that request. Please contact our concierge." };
  } catch (error) {
    console.error("Error in askAboutTreatment:", error);
    return { text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us via WhatsApp." };
  }
};

export const getWellnessRecommendation = async (userQuery: string, currentPath: string = '/'): Promise<ChatMessage> => {
  // 1. Safety Check: API Key
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return {
      id: Date.now().toString(),
      role: 'model',
      text: "I am currently offline for system upgrades. Please feel free to browse our Price List or click 'Book Now' to chat with our reception team on WhatsApp directly."
    };
  }

  try {
    // Determine context based on current path
    let pageContextDescription = "The user is browsing the Home page.";
    if (currentPath.includes('prices')) {
        pageContextDescription = "The user is currently viewing the Price List (Mobile Spa Menu). They may be comparing treatments or prices.";
    } else if (currentPath.includes('contact')) {
        pageContextDescription = "The user is on the Contact/Booking page. They might need help with the form, location areas, or checking availability.";
    } else if (currentPath.includes('about')) {
        pageContextDescription = "The user is reading the 'About Us' section. They might be interested in therapist certification or hygiene.";
    } else if (currentPath.includes('gallery')) {
        pageContextDescription = "The user is viewing the Gallery. They are looking at visuals of treatments.";
    }

    const systemPrompt = `
      You are 'Cherie', the AI Wellness Concierge for ELEXOIR.
      Your tone is soft, feminine, elegant, and professional.
      
      User Context: ${pageContextDescription}
      
      Your goal is to understand how the client is feeling (stressed, muscle pain, tired, wants beauty) and recommend ONE specific treatment from our menu using the 'recommend_treatment' tool.
      
      Here is our menu context:
      ${serviceDescriptions}
      
      Instructions:
      1. If the user describes a physical issue (back pain, tension) or emotional state (stress), IMMEDIATELY use the 'recommend_treatment' tool to suggest the best fit.
      2. If the user is just saying hello, respond politely as a concierge, acknowledging their context (e.g., if on menu, ask if they need help choosing).
      3. Do not list multiple options in text. Pick the best one and use the tool.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: [recommendTreatmentTool] }],
      }
    });

    const candidate = response.candidates?.[0];
    const functionCall = candidate?.content?.parts?.find(part => part.functionCall)?.functionCall;

    // Handle Function Call (AI selected a service)
    if (functionCall) {
      const args = functionCall.args as any;
      const serviceId = args.treatmentId;
      const reasoning = args.reasoning;
      
      const service = SERVICES.find(s => s.id === serviceId);

      if (service) {
        return {
          id: Date.now().toString(),
          role: 'model',
          text: reasoning, // The text shown in the bubble
          recommendation: {
            serviceId: service.id,
            serviceName: service.name,
            reasoning: reasoning
          }
        };
      }
    }

    // Handle Standard Text Response (No specific recommendation)
    return {
      id: Date.now().toString(),
      role: 'model',
      text: response.text || "I'd love to help you relax. Could you tell me if you prefer a strong massage or something more gentle?"
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // 2. Specific Error Handling
    let errorMessage = "I am having a brief moment of meditation. Please check our Price List for the full menu, or contact us on WhatsApp.";

    if (error.message) {
        if (error.message.includes('429') || error.message.includes('Resource has been exhausted')) {
            // Quota/Rate Limit Error
            errorMessage = "I am currently assisting many guests at once. Please view our Price List manually or click the 'Book Now' button to speak with a human agent.";
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
            // Network Error
            errorMessage = "It seems we have a connection issue. Please check your internet signal. You can always book directly via WhatsApp.";
        } else if (error.message.includes('500') || error.message.includes('503')) {
            // Server Error
            errorMessage = "Our concierge system is momentarily unavailable. Please proceed to the Price List to view our treatments.";
        }
    }

    return {
      id: Date.now().toString(),
      role: 'model',
      text: errorMessage
    };
  }
};