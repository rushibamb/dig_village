import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useAuthStore from '../store/authStore';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string }) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { 
    user, 
    token, 
    isLoading, 
    error, 
    login: storeLogin, 
    logout: storeLogout, 
    register: storeRegister,
    clearError,
    initialize
  } = useAuthStore();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await storeLogin(credentials);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    storeLogout();
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await storeRegister(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isLoggedIn: !!(user && token),
    login,
    logout,
    register,
    isLoading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
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