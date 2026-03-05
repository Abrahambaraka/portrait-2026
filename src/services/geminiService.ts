import { GoogleGenAI, Type } from "@google/genai";
import { QuestionnaireData, PORTRAIT_SCHEMA } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generatePortraitContent(data: QuestionnaireData) {
  const prompt = `
    En tant qu'expert en rédaction de portraits académiques pour l'Agence des Portraits, rédige un portrait inspirant pour l'étudiant suivant :
    
    Nom: ${data.fullName}
    Université: ${data.university}
    Faculté: ${data.faculty}
    Domaine: ${data.major}
    Année de remise des diplômes: ${data.graduationYear}
    Parcours: ${data.background}
    Moments clés: ${data.keyMoments}
    Aspirations futures: ${data.futureAspirations}
    Devise: ${data.motto}
    
    Le ton doit être professionnel, élégant et tourné vers l'avenir. Ce portrait sera conservé dans le "Livre d'Or" de l'université.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", // Using a stable model for text generation
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: PORTRAIT_SCHEMA,
    },
  });

  return JSON.parse(response.text || "{}");
}
