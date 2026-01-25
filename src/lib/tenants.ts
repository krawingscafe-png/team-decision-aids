// Mock tenant configurations for testing
export interface TenantTheme {
  id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  primaryForeground: string;
  font: string;
}

export const MOCK_TENANTS: Record<string, TenantTheme> = {
  torbay: {
    id: 'torbay',
    name: 'Torbay NHS Trust',
    primaryColor: '221 83% 53%', // Blue - NHS Blue
    primaryForeground: '0 0% 100%',
    font: 'system-ui, sans-serif',
  },
  devon: {
    id: 'devon',
    name: 'Devon NHS Trust',
    primaryColor: '142 76% 36%', // Green
    primaryForeground: '0 0% 100%',
    font: 'system-ui, sans-serif',
  },
};

// Mock user credentials for testing
export interface MockUser {
  email: string;
  password: string;
  tenant: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trialing' | 'canceled' | 'past_due' | 'none';
}

export const MOCK_USERS: MockUser[] = [
  {
    email: 'demo@torbay.nhs.uk',
    password: 'torbay123',
    tenant: 'torbay',
    plan: 'pro',
    subscriptionStatus: 'active',
  },
  {
    email: 'demo@devon.nhs.uk',
    password: 'devon123',
    tenant: 'devon',
    plan: 'enterprise',
    subscriptionStatus: 'active',
  },
];

// Apply tenant theme to CSS variables
export function applyTenantTheme(tenant: TenantTheme) {
  const root = document.documentElement;
  
  root.style.setProperty('--primary', tenant.primaryColor);
  root.style.setProperty('--primary-foreground', tenant.primaryForeground);
  
  if (tenant.font) {
    root.style.setProperty('--font-sans', tenant.font);
  }
}

// Reset to default theme
export function resetTheme() {
  const root = document.documentElement;
  
  root.style.removeProperty('--primary');
  root.style.removeProperty('--primary-foreground');
  root.style.removeProperty('--font-sans');
}
