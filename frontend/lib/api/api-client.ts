import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '@/lib/auth';

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable sending cookies with requests for authentication
      withCredentials: true,
    });

    // Add request interceptor to include JWT token from localStorage
    this.client.interceptors.request.use(
      async (config) => {
        // Get token from localStorage and add to Authorization header
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          // Clear local storage to prevent redirect loops
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
          }
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Method to set token manually (useful after login) - kept for compatibility
  public setToken(token: string): void {
    // With Better Auth, we rely on cookie-based auth instead of JWT tokens
    // This method is kept for backward compatibility if needed
  }

  // Method to remove token (useful for logout) - kept for compatibility
  public removeToken(): void {
    // With Better Auth, logout is handled by the auth service
  }
}

export const apiClient = new ApiClient();

export default ApiClient;