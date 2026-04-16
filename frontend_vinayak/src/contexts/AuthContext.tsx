'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  profile?: any;
}

type AccountType = 'employee' | 'recruiter';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, accountType?: AccountType) => Promise<void>;
  register: (email: string, password: string, name: string, accountType?: AccountType) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, accountType: AccountType = 'employee') => {
    try {
      const response =
        accountType === 'recruiter'
          ? await apiClient.recruiterLogin(email, password)
          : await apiClient.login(email, password);

      if (response.success && response.data) {
        const userData = response.data.user || { email, role: accountType };
        setUser(userData);
        localStorage.setItem('authToken', response.data.token || '');
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    accountType: AccountType = 'employee'
  ) => {
    try {
      const response =
        accountType === 'recruiter'
          ? await apiClient.recruiterRegister(name, email, password)
          : await apiClient.register(email, password, name);

      if (response.success && response.data) {
        const userData = response.data.user || { email, name, role: accountType };
        setUser(userData);
        localStorage.setItem('authToken', response.data.token || '');
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
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
