
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartPackingList = async (destination: string, duration: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a packing list for a ${duration} day trip to ${destination}. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  category: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });
    // response.text is a property containing the generated string
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { items: [] };
  }
};
