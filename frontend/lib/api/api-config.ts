// API endpoint configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/api/tasks`,
    GET_ALL: `${API_BASE_URL}/api/tasks`,
    CREATE: `${API_BASE_URL}/api/tasks`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    TOGGLE_COMPLETION: (id: string) => `${API_BASE_URL}/api/tasks/${id}/complete`,
  },
  HEALTH: `${API_BASE_URL}/health`,
};

// Environment-specific configuration
export const CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000, // 10 seconds
  },
  auth: {
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes in milliseconds
  },
  cache: {
    taskList: 5 * 60 * 1000, // 5 minutes
    taskDetail: 10 * 60 * 1000, // 10 minutes
  },
};

// Default headers configuration
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Export base URL separately for direct use
export { API_BASE_URL };