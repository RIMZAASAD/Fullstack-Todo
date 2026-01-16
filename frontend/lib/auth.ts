// JWT-based authentication client for the existing backend
export const auth = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store the JWT token in localStorage or cookies
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          return { data, error: null };
        } else {
          return { data: null, error: { message: data.detail || 'Login failed' } };
        }
      } catch (error) {
        return { data: null, error: { message: (error as Error).message || 'Network error' } };
      }
    },
  },
  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store the JWT token in localStorage or cookies
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          return { data, error: null };
        } else {
          return { data: null, error: { message: data.detail || 'Registration failed' } };
        }
      } catch (error) {
        return { data: null, error: { message: (error as Error).message || 'Network error' } };
      }
    },
  },
  signOut: async () => {
    // Remove the stored JWT token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }

    // Call the logout endpoint
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  getSession: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          return { user, token };
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  },
};

// Type definitions
type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

type Session = {
  user: User;
  token: string;
};

type SignInResult = {
  data: Session | null;
  error: { message: string } | null;
};

type SignUpResult = {
  data: Session | null;
  error: { message: string } | null;
};