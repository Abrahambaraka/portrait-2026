import { Type } from "@google/genai";

export interface Portrait {
  id: string;
  studentName: string;
  university: 'UPL' | 'UNH' | 'UDBL' | 'ECOPO';
  faculty: string;
  graduationYear: number;
  biography: string;
  achievements: string[];
  vision: string;
  photoUrl?: string;
  status: 'draft' | 'submitted' | 'published';
  createdAt: string;
}

export interface QuestionnaireData {
  fullName: string;
  university: string;
  faculty: string;
  major: string;
  graduationYear: string;
  background: string;
  keyMoments: string;
  futureAspirations: string;
  motto: string;
}

export const PORTRAIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    biography: {
      type: Type.STRING,
      description: "A professional and inspiring narrative biography of the student.",
    },
    achievements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key academic and personal achievements.",
    },
    vision: {
      type: Type.STRING,
      description: "The student's vision for their future and their impact on society.",
    },
  },
  required: ["biography", "achievements", "vision"],
};
