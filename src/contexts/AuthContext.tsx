import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '../types/index.js';
import apiService from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, isBrand: boolean) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, isBrand: boolean, brandName?: string, brandDescription?: string) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveAuthData = (authResponse: AuthResponse) => {
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    setToken(authResponse.token);
    setUser(authResponse.user);
  };

  const login = async (email: string, password: string, isBrand: boolean) => {
    let authResponse: AuthResponse;
    if (isBrand) {
      authResponse = await apiService.brandLogin(email, password);
    } else {
      authResponse = await apiService.customerLogin(email, password);
    }
    saveAuthData(authResponse);
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, isBrand: boolean, brandName?: string, brandDescription?: string) => {
    if (isBrand) {
      await apiService.brandSignup(email, password, firstName, lastName, brandName!, brandDescription!);
    } else {
      await apiService.customerSignup(email, password, firstName, lastName);
    }
    localStorage.setItem('pendingEmail', email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const authResponse = await apiService.verifyOtp(email, otp);
    saveAuthData(authResponse);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    verifyOtp,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
