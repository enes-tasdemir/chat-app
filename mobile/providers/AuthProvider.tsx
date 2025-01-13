import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = 'http://your-api-url/api'; // Spring Boot API URL'iniz

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  createDemoUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Axios instance oluştur
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Token'ı her istekte otomatik ekle
  api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Token'ı doğrula
        const response = await api.get('/auth/validate');
        setUser(response.data);
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      setUser(user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    name: string;
    age: number;
    bio?: string;
    gender?: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      setUser(user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const createDemoUser = async () => {
    const demoUser = {
      email: "demo@example.com",
      password: "demo123456",
      name: "Demo User",
      age: 25,
      bio: "Hey! I'm a demo user.",
      gender: "not-specified"
    };

    try {
      await signUp(demoUser);
    } catch (error: any) {
      if (error.response?.status === 409) { // Email already exists
        await signIn(demoUser.email, demoUser.password);
      } else {
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signOut, 
      signUp,
      createDemoUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 