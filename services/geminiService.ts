
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapResponse, AuditResponse, SalaryResponse, ErrorAnalysisResponse } from "../types";

const apiKey = 'AIzaSyDrY_RRJHQi25wU6sHM01rdvXFV56w_Y1M';

const getClient = () => {
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- ROADMAP ENGINE ---
export const generateRoadmap = async (idea: string): Promise<RoadmapResponse> => {
  const ai = getClient();
  const prompt = `
    You are a ruthless Senior Staff Engineer. Reconstruct this idea into a roadmap.
    Idea: "${idea}"
    Output strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          critique: { type: Type.STRING },
          verdict: { type: Type.STRING, enum: ["APPROVED", "REJECTED", "NEEDS_REFINEMENT"] },
          techStack: {
            type: Type.OBJECT,
            properties: {
              frontend: { type: Type.ARRAY, items: { type: Type.STRING } },
              backend: { type: Type.ARRAY, items: { type: Type.STRING } },
              database: { type: Type.ARRAY, items: { type: Type.STRING } },
              devops: { type: Type.ARRAY, items: { type: Type.STRING } },
              ai: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["frontend", "backend", "database", "devops"]
          },
          architecture: {
            type: Type.OBJECT,
            properties: {
              pattern: { type: Type.STRING },
              description: { type: Type.STRING },
              keyComponents: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["pattern", "description", "keyComponents"]
          },
          implementationSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["phase", "tasks"]
            }
          },
          apiRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          securityConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["critique", "verdict", "techStack", "architecture", "implementationSteps", "apiRecommendations", "securityConsiderations"]
      }
    }
  });
  
  if(!response.text) throw new Error("No response");
  return JSON.parse(response.text) as RoadmapResponse;
};

// --- CODE AUDITOR ---
export const auditCode = async (code: string): Promise<AuditResponse> => {
  const ai = getClient();
  const prompt = `
    Act as a strict Security Researcher and Performance Engineer.
    Audit the following code snippet. 
    Analyze for security vulnerabilities (XSS, Injection, Memory leaks), performance bottlenecks (O(n^2), renders), and cleanliness.
    Provide a score from 0-100.
    
    Code:
    ${code}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "0-100 score" },
          securityIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          performanceIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          codeQuality: { type: Type.STRING, description: "Short summary of code quality" },
          refactoredSnippet: { type: Type.STRING, description: "Optional refactored version if needed" }
        },
        required: ["score", "securityIssues", "performanceIssues", "codeQuality"]
      }
    }
  });

  if(!response.text) throw new Error("No response");
  return JSON.parse(response.text) as AuditResponse;
};

// --- SALARY ESTIMATOR ---
export const estimateSalary = async (
  role: string, 
  location: string, 
  experience: number, 
  techStack: string,
  industry: string,
  education: string
): Promise<SalaryResponse> => {
  const ai = getClient();
  const prompt = `
    Act as a Technical Recruiter for FAANG and high-growth startups.
    Estimate the MONTHLY salary for the following profile.
    
    Role: ${role}
    Location: ${location}
    Experience: ${experience} years
    Tech Stack: ${techStack}
    Industry/Sector: ${industry}
    Education/Certifications: ${education}
    
    IMPORTANT: 
    1. Calculate the estimated MONTHLY salary rate.
    2. Use the local currency of the specified location (e.g., GBP for London, JPY for Tokyo, INR for Bangalore).
    3. Provide the Market Outlook for this specific role in that location.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          monthlyRate: { type: Type.STRING, description: "e.g. £6,500/mo" },
          annualTotal: { type: Type.STRING, description: "e.g. £78,000/yr" },
          currency: { type: Type.STRING, description: "e.g. GBP, USD, EUR" },
          level: { type: Type.STRING, description: "e.g. Senior, Staff, Junior" },
          marketOutlook: { type: Type.STRING, description: "Demand analysis" },
          topTierCompanies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Companies hiring for this role" }
        },
        required: ["monthlyRate", "currency", "annualTotal", "level", "marketOutlook", "topTierCompanies"]
      }
    }
  });

  if(!response.text) throw new Error("No response");
  return JSON.parse(response.text) as SalaryResponse;
};

// --- ERROR DECODER ---
export const decodeError = async (code: string): Promise<ErrorAnalysisResponse> => {
  const ai = getClient();
  const prompt = `
    You are a Debugging Expert. Analyze this code.
    1. Identify the bug, error, or logical flaw.
    2. Explain the root cause.
    3. Provide the CORRECTED code snippet that fixes the issue.
    
    Code:
    ${code}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING, description: "Simple explanation of the crash" },
          rootCause: { type: Type.STRING, description: "Technical root cause" },
          correctedCode: { type: Type.STRING, description: "The fixed code snippet" },
          fixDescription: { type: Type.STRING, description: "Description of what was changed" }
        },
        required: ["explanation", "rootCause", "correctedCode", "fixDescription"]
      }
    }
  });

  if(!response.text) throw new Error("No response");
  return JSON.parse(response.text) as ErrorAnalysisResponse;
};
