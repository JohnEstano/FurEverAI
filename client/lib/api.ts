// API configuration and helper functions
// This is your single source of truth for backend communication

// Support both NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_BASE for flexibility
const ENV = (globalThis as any)?.process?.env || {};
const API_BASE_URL =
  ENV.NEXT_PUBLIC_API_URL ||
  ENV.NEXT_PUBLIC_API_BASE ||
  'http://127.0.0.1:5000';

// Common fetch options to disable caching in the browser
const noCache: RequestInit = {
  cache: 'no-store',
  headers: { 'Cache-Control': 'no-cache' },
};

export const api = {
  // Health check
  healthCheck: async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`, { ...noCache });
    return response.json();
  },

  // Home endpoint
  getHome: async () => {
  const response = await fetch(`${API_BASE_URL}/api/home`, { ...noCache });
    return response.json();
  },

  // 1) Pawsonality (Decision Tree)
  predictPawsonality: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return response.json();
  },

  // 2) Match (SVM)
  matchScore: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return response.json();
  },

  // 3) Auto Tags (Naive Bayes)
  autoTags: async (data: { description: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return response.json();
  },

  // 4) Recommendations (KNN)
  recommend: async (data: { Pet_ID?: string; n_recommendations?: number } & Record<string, any>) => {
    const response = await fetch(`${API_BASE_URL}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return response.json();
  },

  // 5) Deep Match (ANN)
  deepMatch: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/deep-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return response.json();
  },

  // 6) Adoption Prediction (Linear Regression)
  adoptionPrediction: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/adoption-prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    return response.json();
  },
};

export default api;
