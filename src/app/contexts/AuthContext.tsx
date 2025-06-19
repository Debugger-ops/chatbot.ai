"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('chatbot_token');
    const userData = localStorage.getItem('chatbot_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('chatbot_token');
        localStorage.removeItem('chatbot_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in production, this would be a real backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - check against demo credentials
      const demoUsers = [
        { email: 'demo@chatbot.com', password: 'demo123', name: 'Demo User' },
        { email: 'test@example.com', password: 'test123', name: 'Test User' }
      ];
      
      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: foundUser.email,
          name: foundUser.name,
          createdAt: new Date().toISOString()
        };
        
        const token = `mock_jwt_${userData.id}_${Date.now()}`;
        
        localStorage.setItem('chatbot_token', token);
        localStorage.setItem('chatbot_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        createdAt: new Date().toISOString()
      };
      
      const token = `mock_jwt_${userData.id}_${Date.now()}`;
      
      localStorage.setItem('chatbot_token', token);
      localStorage.setItem('chatbot_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('chatbot_token');
    localStorage.removeItem('chatbot_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
