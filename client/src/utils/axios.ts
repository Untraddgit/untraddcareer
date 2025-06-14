import axios from 'axios';

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS
});

// Debug log for API configuration
console.log('API Configuration:', {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
});

// Attach auth token before each request
api.interceptors.request.use(
  async (config) => {
    try {
      if (!window.Clerk?.session) {
        console.error('Clerk session not initialized');
        throw new Error('Authentication not initialized');
      }

      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No auth token available');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Redirect to login if authentication fails
      window.location.href = '/sign-in';
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Debug interceptor for responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Server Error:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data
      });
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        window.location.href = '/sign-in';
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 