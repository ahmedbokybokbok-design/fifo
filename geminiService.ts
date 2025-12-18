
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      tradeName: { type: Type.STRING },
      discount: { type: Type.NUMBER },
      price: { type: Type.NUMBER },
      bonus: { type: Type.STRING },
    }
  }
};

/**
 * Parses raw text input from a warehouse (e.g. copied from a message)
 */
export const parsePriceList = async (rawText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the drug data from this text. The text contains drug names, discounts, and potentially prices. 
      Context: This is a pharmaceutical price list in Egypt/Middle East. 
      Return a JSON array where each object has 'tradeName', 'discount' (number), 'price' (number or null), 'bonus' (string or null).
      
      Text to parse:
      ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    throw new Error("Failed to parse price list");
  }
};

/**
 * Parses a file (PDF or Image) encoded in base64
 */
export const parseDocumentPriceList = async (base64Data: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: "Extract drug data (Trade Name, Price, Discount, Bonus) from this price list document. Return a JSON array."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini File Parse Error:", error);
    throw new Error("Failed to parse document");
  }
}

/**
 * Intelligent Search Helper
 */
export const suggestDrugCorrections = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User is searching for a drug but might have typos or used a generic name. Suggest up to 3 correct trade names commonly found in Egyptian pharmacies.
      Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
