import { auth } from '@/lib/auth';

export interface User {
  id: string;
  email: string;
  name?: string;
}

class AuthService {
  // Login user
  async login(email: string, password: string): Promise<{ user: User; token?: string }> {
    try {
      const response = await auth.signIn.email({
        email,
        password,
      });

      if (response?.error) {
        throw new Error(response.error.message || 'Login failed');
      }

      const session = await auth.getSession();
      if (!session) {
        throw new Error('Failed to get session after login');
      }

      return { user: session.user as User };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Signup user
  async signup(name: string, email: string, password: string): Promise<{ user: User; token?: string }> {
    try {
      const response = await auth.signUp.email({
        email,
        password,
        name,
      });

      if (response?.error) {
        throw new Error(response.error.message || 'Signup failed');
      }

      const session = await auth.getSession();
      if (!session) {
        throw new Error('Failed to get session after signup');
      }

      return { user: session.user as User };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear any local storage as fallback
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await auth.getSession();
      if (!session) {
        return null;
      }
      return session.user as User;
    } catch (error) {
      // If the request fails, the user is not authenticated
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // Check for session in localStorage (simulating Better Auth session)
    try {
      return typeof window !== 'undefined' && !!localStorage.getItem('access_token') && !!localStorage.getItem('user');
    } catch {
      return false;
    }
  }

  // Get token
  getToken(): string | null {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default AuthService;