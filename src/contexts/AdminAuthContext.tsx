import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ADMIN_CREDENTIALS } from '@/lib/admin';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('admin_email');
  });
  const [isLoading, setIsLoading] = useState(false);

  const adminLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true);
      setAdminEmail(email);
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
    } else {
      throw new Error('Invalid admin credentials');
    }
    
    setIsLoading(false);
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      isAdminAuthenticated,
      adminEmail,
      isLoading,
      adminLogin,
      adminLogout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
