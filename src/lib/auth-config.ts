import { OpenAPI } from '../api/core/OpenAPI';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export class AuthConfig {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly TOKEN_TYPE_KEY = 'tokenType';
  private static readonly EXPIRES_IN_KEY = 'expiresIn';

  /**
   * Initialize the auth configuration by setting up the OpenAPI token resolver
   */
  static initialize() {
    // Set up the token resolver for OpenAPI
    OpenAPI.TOKEN = async () => {
      const token = this.getAccessToken();
      return token ? `${token}` : '';
    };

    // Only set base URL if environment variable is provided and different from current
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (envBaseUrl && envBaseUrl !== OpenAPI.BASE) {
      OpenAPI.BASE = envBaseUrl;
    }
  }

  /**
   * Store authentication tokens in localStorage
   */
  static setTokens(tokens: AuthTokens) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokens.tokenType);
    localStorage.setItem(this.EXPIRES_IN_KEY, tokens.expiresIn.toString());
  }

  /**
   * Get the access token from localStorage
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get the refresh token from localStorage
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get the token type from localStorage
   */
  static getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  /**
   * Get the expires in value from localStorage
   */
  static getExpiresIn(): number | null {
    const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
    return expiresIn ? parseInt(expiresIn, 10) : null;
  }

  /**
   * Get all tokens from localStorage
   */
  static getTokens(): AuthTokens | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const tokenType = this.getTokenType();
    const expiresIn = this.getExpiresIn();

    if (!accessToken || !refreshToken || !tokenType || expiresIn === null) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
    };
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  static isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Clear all authentication tokens
   */
  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
  }

  /**
   * Logout user by clearing tokens and redirecting
   */
  static logout() {
    this.clearTokens();
    window.location.href = '/';
  }
}
