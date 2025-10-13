import { createDirectus, authentication, rest } from '@directus/sdk';

// Create Directus client
const directus = createDirectus(import.meta.env.PUBLIC_DIRECTUS_URL || 'https://your-directus-url.com')
  .with(rest())
  .with(authentication());

export type DirectusUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  role?: {
    id: string;
    name: string;
  };
  roles?: Array<{
    id: string;
    name: string;
  }>;
};

export type AuthState = {
  user: DirectusUser | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
};

class DirectusAuth {
  private static instance: DirectusAuth;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: DirectusUser | null = null;

  private constructor() {}

  static getInstance(): DirectusAuth {
    if (!DirectusAuth.instance) {
      DirectusAuth.instance = new DirectusAuth();
    }
    return DirectusAuth.instance;
  }

  async login(email: string, password: string): Promise<DirectusUser> {
    try {
      const response = await directus.login(email, password, {
        mode: 'json'
      });

      if (!response.access_token) {
        throw new Error('No access token received');
      }

      this.token = response.access_token;
      this.refreshToken = response.refresh_token || null;

      // Set token for Directus client
      if (this.token) {
        directus.setToken(this.token);
      }

      // Store tokens securely (in a real app, use httpOnly cookies)
      if (typeof window !== 'undefined') {
        localStorage.setItem('directus_token', this.token);
        if (this.refreshToken) {
          localStorage.setItem('directus_refresh_token', this.refreshToken);
        }
      }

      // Get user data
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Authentication failed');
    }
  }

  async loginWithToken(token: string): Promise<void> {
    this.token = token;
    directus.setToken(token);
  }

  async loginWithPhone(phone: string, password: string): Promise<DirectusUser> {
    // For phone login, we'll query the user by phone first
    try {
      // Find user by phone number
      const users = await directus.request(
        rest.readItems('directus_users', {
          filter: {
            phone: { _eq: phone }
          },
          fields: ['email']
        })
      ) as Array<{ email: string }>;

      if (users.length === 0) {
        throw new Error('User not found with this phone number');
      }

      // Login with the found email
      return await this.login(users[0].email, password);
    } catch (error) {
      console.error('Phone login failed:', error);
      throw new Error('Authentication failed');
    }
  }

  async getCurrentUser(): Promise<DirectusUser> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const user = await directus.request(
        rest.readItems('directus_users', {
          fields: ['*', 'role.*', 'roles.*']
        })
      ) as DirectusUser[];

      if (!user || user.length === 0) {
        throw new Error('User not found');
      }

      this.user = user[0];
      return this.user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error('Failed to get user data');
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await directus.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await directus.refresh();
      if (response.access_token) {
        this.token = response.access_token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('directus_token', this.token);
        }
        return this.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
    }

    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getUser(): DirectusUser | null {
    return this.user;
  }

  async initAuth(): Promise<DirectusUser | null> {
    // Try to restore auth state from storage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('directus_token');
      this.refreshToken = localStorage.getItem('directus_refresh_token');
    }

    if (this.token) {
      try {
        // Validate token by getting current user
        const user = await this.getCurrentUser();
        return user;
      } catch (error) {
        console.error('Invalid token, clearing auth state:', error);
        this.clearTokens();
      }
    }

    return null;
  }

  private clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('directus_token');
      localStorage.removeItem('directus_refresh_token');
    }
  }
}

export const directusAuth = DirectusAuth.getInstance();
export default directusAuth;