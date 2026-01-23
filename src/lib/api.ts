const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';

interface FetchOptions extends RequestInit {
  token?: string | null;
}

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = getErrorMessage(response.status, errorData.message);
    throw new ApiError(message, response.status);
  }
  
  return response.json();
}

function getErrorMessage(status: number, serverMessage?: string): string {
  switch (status) {
    case 401:
      return 'Invalid credentials. Please check your email and password.';
    case 402:
      return 'Subscription required. Please choose a plan to continue.';
    case 403:
      return 'Access denied. You don\'t have permission to view this resource.';
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Something went wrong on our end. Please try again or contact support.';
    default:
      return serverMessage || `An error occurred (${status})`;
  }
}

// Tenant configuration
export interface TenantConfig {
  logo: string;
  primaryColor: string;
  font: string;
}

export async function fetchTenantConfig(): Promise<TenantConfig | null> {
  try {
    return await apiFetch<TenantConfig>('/tenant/config');
  } catch (error) {
    console.warn('Failed to fetch tenant config:', error);
    return null;
  }
}

// Apply tenant theming
export function applyTenantTheme(config: TenantConfig) {
  const root = document.documentElement;
  
  if (config.primaryColor) {
    // Convert hex to HSL if needed and apply
    root.style.setProperty('--tenant-primary', config.primaryColor);
  }
  
  if (config.font) {
    root.style.setProperty('--tenant-font', config.font);
  }
}
