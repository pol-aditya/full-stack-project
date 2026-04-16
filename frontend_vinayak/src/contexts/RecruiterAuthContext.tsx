'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface RecruiterUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface RecruiterAuthContextType {
  recruiter: RecruiterUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const RecruiterAuthContext = createContext<RecruiterAuthContextType | undefined>(undefined);

export function RecruiterAuthProvider({ children }: { children: ReactNode }) {
  const [recruiter, setRecruiter] = useState<RecruiterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('recruiterAuthToken');
    const recruiterData = localStorage.getItem('recruiterUser');

    if (token && recruiterData) {
      try {
        setRecruiter(JSON.parse(recruiterData));
      } catch (_error) {
        localStorage.removeItem('recruiterAuthToken');
        localStorage.removeItem('recruiterUser');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.recruiterLogin(email, password);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Recruiter login failed');
    }

    const userData = (response.data as any).user as RecruiterUser;
    const token = (response.data as any).token as string;

    setRecruiter(userData);
    localStorage.setItem('recruiterAuthToken', token || '');
    localStorage.setItem('recruiterUser', JSON.stringify(userData));
    localStorage.setItem('authToken', token || '');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.recruiterRegister(name, email, password);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Recruiter registration failed');
    }

    const userData = (response.data as any).user as RecruiterUser;
    const token = (response.data as any).token as string;

    setRecruiter(userData);
    localStorage.setItem('recruiterAuthToken', token || '');
    localStorage.setItem('recruiterUser', JSON.stringify(userData));
    localStorage.setItem('authToken', token || '');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setRecruiter(null);
    localStorage.removeItem('recruiterAuthToken');
    localStorage.removeItem('recruiterUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <RecruiterAuthContext.Provider
      value={{
        recruiter,
        isLoading,
        isAuthenticated: !!recruiter,
        login,
        register,
        logout,
      }}
    >
      {children}
    </RecruiterAuthContext.Provider>
  );
}

export function useRecruiterAuth() {
  const context = useContext(RecruiterAuthContext);
  if (!context) {
    throw new Error('useRecruiterAuth must be used within RecruiterAuthProvider');
  }
  return context;
}
