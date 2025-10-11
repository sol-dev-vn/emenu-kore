// Directus API Client Configuration
// Handles API communication with Directus backend

interface DirectusConfig {
  url: string;
  token: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  description?: string;
  display_name?: string;
  external_id?: string;
  is_active: boolean;
  address?: string;
  phone?: string;
  email?: string;
  opening_hours?: Record<string, unknown>;
  timezone: string;
  currency: string;
  tax_rate: number;
  service_rate: number;
  has_vat: boolean;
  has_service: boolean;
  vat_rate: number;
  created_at: string;
  updated_at: string;
}

class DirectusClient {
  private config: DirectusConfig;

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'https://sol-kore.alphabits.team',
      token: process.env.DIRECTUS_TOKEN || ''
    };

    if (!this.config.token) {
      console.warn('Directus token not configured. Please set DIRECTUS_TOKEN in environment variables.');
    }
  }

  // Allow setting access token dynamically (e.g., from cookies in API routes)
  public setAccessToken(token: string) {
    this.config.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.url}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        interface DirectusErrorResponse { errors?: Array<{ message?: string }> }
        const errorData: DirectusErrorResponse = await response.json().catch(() => ({} as DirectusErrorResponse));
        throw new Error(
          `Directus API Error: ${response.status} ${response.statusText} - ${
            errorData.errors?.[0]?.message || 'Unknown error'
          }`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Directus API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ data: { access_token: string; refresh_token: string; expires: number } }> {
    return this.request<{ data: { access_token: string; refresh_token: string; expires: number } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async logout(refresh_token: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    });
  }

  async refresh(refresh_token: string): Promise<{ data: { access_token: string; expires: number } }> {
    return this.request<{ data: { access_token: string; expires: number } }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refresh_token }),
      }
    );
  }

  // Branch management methods
  async getBranches(): Promise<{ data: Branch[][] }> {
    return this.request<{ data: Branch[][] }>('/items/branches?limit=-1');
  }

  async getBranch(id: string): Promise<{ data: Branch }> {
    return this.request<{ data: Branch }>(`/items/branches/${id}`);
  }

  async createBranch(branch: Partial<Branch>): Promise<{ data: Branch }> {
    return this.request<{ data: Branch }>('/items/branches', {
      method: 'POST',
      body: JSON.stringify(branch),
    });
  }

  async updateBranch(id: string, branch: Partial<Branch>): Promise<{ data: Branch }> {
    return this.request<{ data: Branch }>(`/items/branches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(branch),
    });
  }

  async deleteBranch(id: string): Promise<void> {
    await this.request(`/items/branches/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      await this.request('/health');
      return { status: 'healthy', message: 'Directus API is accessible' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get server info
  async getServerInfo(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/server/info');
  }

  // Generic items count using aggregate
  async count(collection: string): Promise<number> {
    const res = await this.request<{ data: Array<{ count: number }> }>(`/items/${collection}?aggregate[count]=*`);
    const first = res.data?.[0];
    return typeof first?.count === 'number' ? first.count : 0;
  }

  // Generic items read with simple query params
  async getItems(collection: string, options?: { sort?: string[]; limit?: number; fields?: string[] }): Promise<{ data: unknown[] }> {
    const params: string[] = [];
    if (options?.sort && options.sort.length) params.push(`sort=${encodeURIComponent(options.sort.join(','))}`);
    if (typeof options?.limit === 'number') params.push(`limit=${options.limit}`);
    if (options?.fields && options.fields.length) params.push(`fields=${encodeURIComponent(options.fields.join(','))}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.request<{ data: unknown[] }>(`/items/${collection}${qs}`);
  }
}

// Create singleton instance
export const directusClient = new DirectusClient();

// Export types
export type { Branch, DirectusConfig };
export { DirectusClient };