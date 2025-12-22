'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Footer } from '@/components/layout/Footer';

// Hardcoded test user credentials
const TEST_USER = {
  email: 'testuser@gmail.com',
  password: 'Test1234!',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setIsAuthenticated } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate credentials
    if (email.trim() !== TEST_USER.email || password !== TEST_USER.password) {
      setError('Invalid email or password. Please try again.');
      toast.error('Invalid credentials');
      return;
    }

    // Successful login
    setIsAuthenticated(true);
    toast.success('Welcome back!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
          <div className="max-w-md text-center">
            {/* Logo above title - larger and oval/rounded */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-96 h-40 overflow-hidden" style={{ borderRadius: '9999px' }}>
                <img
                  src="/logo.png"
                  alt="White Chalk Road Logo"
                  className="w-full h-full object-contain p-4"
                  style={{ borderRadius: '9999px' }}
                  onError={(e) => {
                    // Fallback if logo file doesn't exist yet
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-primary-foreground mb-6">
              Unified Analytics
            </h1>
            <p className="text-lg text-primary-foreground/80 text-left">
              Connect Google Analytics, Search Console, and Google Ads in one powerful dashboard. Build custom views and gain insights faster.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md animate-fade-in">
              {/* Mobile logo - larger and oval/rounded */}
              <div className="lg:hidden mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative w-80 h-36 overflow-hidden" style={{ borderRadius: '9999px' }}>
                    <img
                      src="/logo.png"
                      alt="White Chalk Road Logo"
                      className="w-full h-full object-contain p-4"
                      style={{ borderRadius: '9999px' }}
                      onError={(e) => {
                        // Fallback if logo file doesn't exist yet
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome back
                </h2>
                <p className="text-muted-foreground mt-2">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="h-12"
                    required
                  />
                </div>

                <Button type="submit" className="w-full h-12 gradient-primary text-primary-foreground hover:opacity-90">
                  Sign In
                </Button>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

