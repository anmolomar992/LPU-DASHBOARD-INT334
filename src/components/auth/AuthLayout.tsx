
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 glass-card rounded-2xl animate-fade-in">
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo size="lg" className="mb-6" />
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-center mt-1">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
