import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/charts');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (status: number, message: string) => {
    switch (status) {
      case 401:
        return 'Invalid email or password. Please try again.';
      case 402:
        return 'Subscription required. Please choose a plan.';
      case 500:
        return 'Something went wrong. Please contact support.';
      default:
        return message;
    }
  };

  return (
    <Card className={cn(shake && 'animate-shake')}>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
              {error.includes('Subscription') && (
                <Link to="/pricing" className="text-sm text-primary underline mt-1 inline-block">
                  View pricing plans →
                </Link>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Hospital Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@nhs.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{' '}
            <Link to="/pricing" className="text-primary hover:underline">
              View pricing
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
