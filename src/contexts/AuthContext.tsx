import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MOCK_USERS, MOCK_TENANTS, applyTenantTheme, resetTheme } from '@/lib/tenants';

// Enable mock mode for testing without backend
const MOCK_MODE = true;

interface User {
  email: string;
  tenant: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trialing' | 'canceled' | 'past_due' | 'none';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSubscribed: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserFromCheckout: (sessionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.torbaycharts.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isSubscribed = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing';

  // Initialize from localStorage on mount and apply theme
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Apply tenant theme if user is logged in
        if (parsedUser.tenant && MOCK_TENANTS[parsedUser.tenant]) {
          applyTenantTheme(MOCK_TENANTS[parsedUser.tenant]);
        }
      } catch (e) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Mock mode: check against mock users
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error('Invalid email or password');
      }
      
      const userData: User = {
        email: mockUser.email,
        tenant: mockUser.tenant,
        plan: mockUser.plan,
        subscriptionStatus: mockUser.subscriptionStatus,
      };
      
      const mockToken = 'mock_token_' + Date.now();
      
      setToken(mockToken);
      setUser(userData);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Apply tenant theme
      if (MOCK_TENANTS[mockUser.tenant]) {
        applyTenantTheme(MOCK_TENANTS[mockUser.tenant]);
      }
      
      return;
    }
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    const data = await response.json();
    
    const userData: User = {
      email,
      tenant: data.tenant,
      plan: data.plan,
      subscriptionStatus: data.subscriptionStatus,
    };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    resetTheme(); // Reset to default theme on logout
  }, []);

  const setUserFromCheckout = useCallback(async (sessionId: string) => {
    // Handle mock sessions for testing
    if (sessionId.startsWith('mock_session_')) {
      const mockUserData: User = {
        email: 'demo@nhs.uk',
        tenant: 'torbay',
        plan: 'pro',
        subscriptionStatus: 'active',
      };
      const mockToken = 'mock_token_' + Date.now();
      
      setToken(mockToken);
      setUser(mockUserData);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUserData));
      return;
    }

    const response = await fetch(`${API_BASE}/stripe/portal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify subscription');
    }

    const data = await response.json();
    
    const userData: User = {
      email: data.email || '',
      tenant: data.tenant,
      plan: data.plan,
      subscriptionStatus: data.subscriptionStatus,
    };

    if (data.token) {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
    }
    
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  }, []);
  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isSubscribed,
      login,
      logout,
      setUserFromCheckout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
