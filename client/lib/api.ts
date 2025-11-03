// API configuration and helper functions
// This is your single source of truth for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  },

  // Home endpoint
  getHome: async () => {
    const response = await fetch(`${API_BASE_URL}/api/home`);
    return response.json();
  },

  // Model prediction with JSON data
  predict: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Model prediction with file upload
  predictWithFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },
};

export default api;
