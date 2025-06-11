import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiRequestOptions } from '../api/core/ApiRequestOptions';
import { CancelablePromise } from '../api/core/CancelablePromise';
import { OpenAPI } from '../api/core/OpenAPI';

/**
 * Custom API request implementation with authentication and error handling
 */
export const request = <T>(options: ApiRequestOptions): CancelablePromise<T> => {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    const source = axios.CancelToken.source();
    
    onCancel(() => source.cancel('Request was cancelled'));

    const config: AxiosRequestConfig = {
      url: `${OpenAPI.BASE}${options.url}`,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...OpenAPI.HEADERS,
        ...options.headers,
      },
      data: options.body,
      params: options.query,
      cancelToken: source.token,
      withCredentials: OpenAPI.WITH_CREDENTIALS,
    };

    // Add authentication token if available
    if (OpenAPI.TOKEN) {
      const token = typeof OpenAPI.TOKEN === 'function' ? OpenAPI.TOKEN(options) : OpenAPI.TOKEN;
      if (typeof token === 'string') {
        config.headers!['Authorization'] = `Bearer ${token}`;
      } else {
        token.then((resolvedToken) => {
          config.headers!['Authorization'] = `Bearer ${resolvedToken}`;
        });
      }
    }

    // Add basic auth if available
    if (OpenAPI.USERNAME && OpenAPI.PASSWORD) {
      const username = typeof OpenAPI.USERNAME === 'function' ? OpenAPI.USERNAME(options) : OpenAPI.USERNAME;
      const password = typeof OpenAPI.PASSWORD === 'function' ? OpenAPI.PASSWORD(options) : OpenAPI.PASSWORD;
      
      if (typeof username === 'string' && typeof password === 'string') {
        config.auth = { username, password };
      }
    }

    axios(config)
      .then((response: AxiosResponse<T>) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          reject(new Error('Request was cancelled'));
        } else {
          // Enhanced error handling
          const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
          const statusCode = error.response?.status;
          
          console.error('API Request Error:', {
            url: config.url,
            method: config.method,
            status: statusCode,
            message: errorMessage,
            data: error.response?.data,
          });
          
          reject(new Error(`${statusCode ? `${statusCode}: ` : ''}${errorMessage}`));
        }
      });
  });
};
