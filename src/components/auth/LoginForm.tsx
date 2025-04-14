
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  const setDemoAccount = (type: 'student' | 'teacher' | 'admin') => {
    setEmail(`${type}@lpu.in`);
    setPassword('password');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="youremail@lpu.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-sm text-lpu-blue hover:underline">
            Forgot Password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="glass-input"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center">
        <button 
          type="button" 
          className="text-sm text-lpu-blue hover:underline" 
          onClick={() => setShowDemoAccounts(!showDemoAccounts)}
        >
          {showDemoAccounts ? 'Hide Demo Accounts' : 'Use Demo Account'}
        </button>
        
        {showDemoAccounts && (
          <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">All demo accounts use password: <span className="font-mono bg-gray-200 px-1 rounded">password</span></p>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => setDemoAccount('student')} 
                className="text-xs"
              >
                Student
              </Button>
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => setDemoAccount('teacher')} 
                className="text-xs"
              >
                Teacher
              </Button>
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => setDemoAccount('admin')} 
                className="text-xs"
              >
                Admin
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-lpu-blue hover:underline">
          Register
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
