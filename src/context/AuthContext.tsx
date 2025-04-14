
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { logToMonitoring } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Student Demo',
    email: 'student@lpu.in',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Teacher Demo',
    email: 'teacher@lpu.in',
    role: 'teacher',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Admin Demo',
    email: 'admin@lpu.in',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('lpu_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        logToMonitoring('userSessionRestored', { userId: parsedUser.id, role: parsedUser.role });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('lpu_user');
        logToMonitoring('userSessionParseError', { error: String(error) });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    logToMonitoring('loginAttempt', { email });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching email (in a real app, this would be an API call)
      const user = mockUsers.find(u => u.email === email);
      
      // In a real app, you would verify the password here
      if (!user || password !== 'password') {
        const error = new Error('Invalid email or password');
        logToMonitoring('loginFailed', { email, reason: 'Invalid credentials' });
        throw error;
      }
      
      // Save user to state and localStorage
      setUser(user);
      localStorage.setItem('lpu_user', JSON.stringify(user));
      
      logToMonitoring('loginSuccess', { userId: user.id, role: user.role });
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    logToMonitoring('registerAttempt', { email, role });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email is already taken
      if (mockUsers.some(u => u.email === email)) {
        logToMonitoring('registerFailed', { email, reason: 'Email in use' });
        throw new Error('Email already in use');
      }
      
      // In a real app, this would create a new user in the database
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 4}`
      };
      
      // Save user to state and localStorage
      setUser(newUser);
      localStorage.setItem('lpu_user', JSON.stringify(newUser));
      
      logToMonitoring('registerSuccess', { userId: newUser.id, role: newUser.role });
      toast.success('Registered successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      logToMonitoring('logout', { userId: user.id });
    }
    
    setUser(null);
    localStorage.removeItem('lpu_user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
