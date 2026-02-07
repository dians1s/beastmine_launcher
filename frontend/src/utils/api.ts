// BeastMine API Client using Tauri HTTP
// Based on API documentation: https://beastmine.ru/api

import { fetch } from '@tauri-apps/plugin-http';

const API_BASE_URL = 'https://beastmine.ru/api';

// Types
interface ApiResponse<T> {
  response_status: number;
  count?: number;
  current_page?: number;
  page_count?: number;
  page_size?: number;
  data: T;
  message: string;
}

// API Client
class BeastMineApi {
  // Tokens are always read from localStorage to ensure sync across sessions
  
  private getAccessToken(): string | null {
    return localStorage.getItem('bm_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('bm_refresh_token');
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('bm_access_token', access);
    localStorage.setItem('bm_refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('bm_access_token');
    localStorage.removeItem('bm_refresh_token');
  }

  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request:', method, url);
    console.log('Request data:', data);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const accessToken = this.getAccessToken();
    if (requiresAuth && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const body = data ? JSON.stringify({ data }) : undefined;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response data:', result);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && requiresAuth) {
        console.log('Got 401, attempting token refresh...');
        try {
          await this.doRefreshToken();
          // Retry the request with new token
          return this.request<T>(method, endpoint, data, requiresAuth);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens and throw auth error
          this.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('API Request error:', error);
      throw error;
    }
  }

  // Auth
  async loginLauncher(username: string, password: string, otpCode?: string) {
    // Build request data - only include otp_code if provided
    const requestData: any = { username, password };
    if (otpCode) {
      requestData.otp_code = otpCode;
    }
    
    const result = await this.request<{
      access_token: string;
      refresh_token: string;
      uuid: string;
      id: number;
      username: string;
      email: string;
      role: number;
      donate: number;
      coins: number;
    }>('POST', '/player/login/launchered/', requestData);

    if (result.data.access_token && result.data.refresh_token) {
      this.setTokens(result.data.access_token, result.data.refresh_token);
    }

    return result;
  }

  async doRefreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const result = await this.request<{
      access_token: string;
      refresh_token: string;
    }>('POST', '/player/refresh/', {
      refresh_token: refreshToken,
    });

    if (result.data.access_token && result.data.refresh_token) {
      this.setTokens(result.data.access_token, result.data.refresh_token);
    }

    return result;
  }

  async logout() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return;

    await this.request('POST', '/player/logout/', {
      refresh_token: refreshToken,
    }, true);

    this.clearTokens();
  }

  // Player
  async getPlayerInfo() {
    return this.request<{
      id: number;
      username: string;
      email: string;
      create_date: string;
      last_date: string | null;
      last_date_launch: string | null;
      role: number;
      true_mail: boolean;
      status: boolean;
      donate: number;
      coins: number;
      otp_enabled: boolean;
      referrer_id: number | null;
      referrer_username: string | null;
      has_new_notifications: boolean;
    }>('POST', '/player/info/', {}, true);
  }

  // News
  async getNews(limit = 10, offset = 0) {
    return this.request<Array<{
      id: number;
      title: string;
      media: string | null;
      description: string;
      description_launch: string;
      created_date: string;
      created_by_id: number;
      created_by: string;
    }>>('GET', `/news/?limit=${limit}&offset=${offset}`, undefined, true);
  }

  // Skin
  async getSkin() {
    return this.request<{ skin: string }>('GET', '/skin/', undefined, true);
  }

  async updateSkin(skinBase64: string) {
    return this.request('POST', '/skin/update/', { skin: skinBase64 }, true);
  }

  // Privileges
  async checkPrivileges() {
    return this.request<{
      privileges: Array<{
        server: number;
        rank: string;
        expires_at: string;
      }>;
    }>('POST', '/privilege/check/', {}, true);
  }

  // Promocode
  async usePromocode(promocode: string) {
    return this.request<{
      type: number;
      value: number;
    }>('POST', '/promocode/use/', { promocode }, true);
  }

  // Notifications
  async getNotifications(page = 1) {
    return this.request<{
      notifications: Array<{
        id: number;
        message: string;
        notification_type: number;
        notification_type_display: string;
        created_at: string;
        created_by: string;
      }>;
      total_pages: number;
      current_page: number;
    }>('POST', '/notifications/', { page }, true);
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: string;
      timestamp: string;
      services: {
        database: string;
        redis: string;
        rcon: string;
      };
    }>('GET', '/health');
  }
}

export const api = new BeastMineApi();

// Helper functions
export const getAuthHeaders = () => {
  const token = localStorage.getItem('bm_access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('bm_access_token');
};
