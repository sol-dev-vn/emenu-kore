// Directus API Client Configuration
// Handles API communication with Directus backend

import { createDirectus, rest, authentication } from '@directus/sdk';

interface DirectusConfig {
  url: string;
  token: string;
}

interface Brand {
  id: string;
  name: string;
  code: string;
  description?: string;
  display_name?: string;
  logo?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  brand_id?: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: { id: string; name?: string } | string | null;
  title?: string;
}

class DirectusClient {
  private config: DirectusConfig;

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'https://sol-kore.alphabits.team',
      token: process.env.DIRECTUS_TOKEN || ''
    };

    // Only warn about missing static token if we're not in a browser environment
    if (typeof window === 'undefined' && !this.config.token) {
      console.warn('Directus token not configured. Please set DIRECTUS_TOKEN in environment variables for server-side requests.');
    }
  }

  // Allow setting access token dynamically (e.g., from cookies in API routes)
  public setAccessToken(token: string) {
    this.config.token = token;
  }

  private getAccessToken(): string | null {
    // First check if we have a dynamically set token
    if (this.config.token) {
      return this.config.token;
    }

    // Then check cookies for browser environment
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )directus_access_token=([^;]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }

    return null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      // Debug: Log when token is used
      if (typeof window !== 'undefined') {
        console.debug('Directus: Using access token for API request');
      }
    } else {
      // Debug: Log when no token is available
      if (typeof window !== 'undefined') {
        console.warn('Directus: No access token available for API request');
      }
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, skipAuth: boolean = false): Promise<T> {
    const url = `${this.config.url}${endpoint}`;

    try {
      const baseHeaders: Record<string, string> = skipAuth
        ? { 'Content-Type': 'application/json' }
        : this.getHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...baseHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        interface DirectusErrorResponse { errors?: Array<{ message?: string }> }
        const errorData: DirectusErrorResponse = await response.json().catch(() => ({} as DirectusErrorResponse));

        // Special handling for permission errors
        if (response.status === 403) {
          console.warn(`Permission denied for ${endpoint}. User may lack required permissions in Directus.`);
        }

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

  // List configured OAuth providers
  async listAuthProviders(): Promise<{ data: string[] }> {
    // Try modern identity providers endpoint; fallback to empty list on 404
    try {
      return this.request<{ data: string[] }>("/auth/identity-providers", {}, true);
    } catch (e) {
      console.warn('Identity providers endpoint not available; OAuth disabled');
      return { data: [] };
    }
  }

  // Request password reset email
  async requestPasswordReset(email: string, reset_url?: string): Promise<void> {
    await this.request('/auth/password/request', {
      method: 'POST',
      body: JSON.stringify({ email, ...(reset_url ? { reset_url } : {}) }),
    });
  }

  // Reset password using token
  async resetPassword(token: string, password: string): Promise<void> {
    await this.request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
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
  async getBranches(): Promise<{ data: Branch[] }> {
    return this.request<{ data: Branch[] }>("/items/branches?limit=-1");
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

  // Fetch current authenticated user
  async getCurrentUser(): Promise<{ data: User }> {
    return this.request<{ data: User }>('/users/me');
  }

  // Generic items count using aggregate
  async count(collection: string): Promise<number> {
    const res = await this.request<{ data: Array<{ count: number }> }>(`/items/${collection}?aggregate[count]=*`);
    const first = res.data?.[0];
    return typeof first?.count === 'number' ? first.count : 0;
  }

  // Generic items read with simple query params
  async getItems<T = unknown>(
    collection: string,
    options?: { sort?: string[]; limit?: number; page?: number; fields?: string[]; filter?: Record<string, unknown>; groupBy?: string[] }
  ): Promise<{ data: T[]; meta?: Record<string, unknown> }> {
    const params: string[] = [];
    if (options?.sort && options.sort.length) params.push(`sort=${encodeURIComponent(options.sort.join(','))}`);
    if (typeof options?.limit === 'number') params.push(`limit=${options.limit}`);
    if (typeof options?.page === 'number') params.push(`page=${options.page}`);
    if (options?.fields && options.fields.length) params.push(`fields=${encodeURIComponent(options.fields.join(','))}`);
    if (options?.groupBy && options.groupBy.length) params.push(`groupBy=${encodeURIComponent(options.groupBy.join(','))}`);
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value as Record<string, unknown>).forEach(([operator, val]) => {
            params.push(`filter[${key}][${operator}]=${encodeURIComponent(String(val))}`);
          });
        } else {
          params.push(`filter[${key}][_eq]=${encodeURIComponent(String(value))}`);
        }
      });
    }
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.request<{ data: T[]; meta?: Record<string, unknown> }>(`/items/${collection}${qs}`);
  }

  // Generic item creation
  async createDirectusItem(collection: string, data: Record<string, unknown>): Promise<{ data: unknown }> {
    return this.request<{ data: unknown }>(`/items/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic item update
  async updateDirectusItem(collection: string, id: string, data: Record<string, unknown>): Promise<{ data: unknown }> {
    return this.request<{ data: unknown }>(`/items/${collection}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Generic item deletion
  async deleteDirectusItem(collection: string, id: string): Promise<void> {
    await this.request(`/items/${collection}/${id}`, {
      method: 'DELETE',
    });
  }

  // Sync Logs methods
  async getSyncLogs(options?: {
    page?: number;
    limit?: number;
    sort?: string[];
    filter?: Record<string, unknown>;
    fields?: string[];
  }): Promise<{ data: unknown[]; meta: { total_count: number; filter_count: number } }> {
    const params: string[] = [];
    if (options?.page) params.push(`page=${options.page}`);
    if (options?.limit) params.push(`limit=${options.limit}`);
    if (options?.sort && options.sort.length) params.push(`sort=${encodeURIComponent(options.sort.join(','))}`);
    if (options?.fields && options.fields.length) params.push(`fields=${encodeURIComponent(options.fields.join(','))}`);
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([operator, val]) => {
            params.push(`filter[${key}][${operator}]=${encodeURIComponent(String(val))}`);
          });
        } else {
          params.push(`filter[${key}][_eq]=${encodeURIComponent(String(value))}`);
        }
      });
    }
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.request<{ data: unknown[]; meta: { total_count: number; filter_count: number } }>(`/items/sync_logs${qs}`);
  }

  async getSyncLog(id: string): Promise<{ data: unknown }> {
    return this.request<{ data: unknown }>(`/items/sync_logs/${id}`);
  }

  async createSyncLog(syncLog: {
    sync_type: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    records_processed?: number;
    records_created?: number;
    records_updated?: number;
    records_failed?: number;
    duration_seconds?: number;
    last_error_message?: string;
    performance_metrics?: Record<string, unknown>;
    session_log?: string;
    log_file_path?: string;
  }): Promise<{ data: unknown }> {
    return this.request<{ data: unknown }>('/items/sync_logs', {
      method: 'POST',
      body: JSON.stringify(syncLog),
    });
  }

  async updateSyncLog(id: string, updates: Partial<{
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    records_processed: number;
    records_created: number;
    records_updated: number;
    records_failed: number;
    duration_seconds: number;
    last_error_message: string;
    performance_metrics: Record<string, unknown>;
    session_log: string;
    log_file_path: string;
    completed_at: string;
    date_updated: string;
  }>): Promise<{ data: unknown }> {
    return this.request<{ data: unknown }>(`/items/sync_logs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteSyncLog(id: string): Promise<void> {
    await this.request(`/items/sync_logs/${id}`, {
      method: 'DELETE',
    });
  }

  async getSyncLogStats(): Promise<{
    total: number;
    completed: number;
    failed: number;
    in_progress: number;
    pending: number;
  }> {
    try {
      const parseCount = async (query: string): Promise<number> => {
        const res = await this.request<{ data?: Array<{ count?: number }> }>(query);
        return res.data?.[0]?.count ?? 0;
      };

      const [total, completed, failed, in_progress, pending] = await Promise.all([
        parseCount('/items/sync_logs?aggregate[count]=*'),
        parseCount('/items/sync_logs?aggregate[count]=*&&filter[status][_eq]=completed'),
        parseCount('/items/sync_logs?aggregate[count]=*&&filter[status][_eq]=failed'),
        parseCount('/items/sync_logs?aggregate[count]=*&&filter[status][_eq]=in_progress'),
        parseCount('/items/sync_logs?aggregate[count]=*&&filter[status][_eq]=pending'),
      ]);

      return { total, completed, failed, in_progress, pending };
    } catch (error) {
      console.error('Failed to get sync log stats:', error);
      return {
        total: 0,
        completed: 0,
        failed: 0,
        in_progress: 0,
        pending: 0,
      };
    }
  }
}

// Create singleton instance
// Export base URL for client-side redirects (e.g., OAuth)
export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'https://sol-kore.alphabits.team';

// Optional Directus SDK client for future use (auth + REST)
export const directusSdk = createDirectus(DIRECTUS_URL).with(authentication('json')).with(rest());

export const directusClient = new DirectusClient();
export type { Brand, Branch, DirectusConfig, User };
export { DirectusClient };