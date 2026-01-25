import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isSubscribed, setUserFromCheckout, isLoading } = useAuth();

  const success = searchParams.get('success');
  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan');

  // Handle Stripe checkout return
  useEffect(() => {
    if (success === 'true' && sessionId) {
      setUserFromCheckout(sessionId).catch(console.error);
    }
  }, [success, sessionId, setUserFromCheckout]);

  // Redirect authenticated users
  useEffect(() => {
    if (user && isSubscribed) {
      navigate('/charts');
    }
  }, [user, isSubscribed, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (success === 'true' && sessionId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-muted-foreground">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your hospital email to continue.
          </p>
          {plan && (
            <p className="mt-2 text-sm text-primary">
              Signing up for the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
            </p>
          )}
        </div>
        
        <LoginForm />
        
        {/* Test Credentials Card */}
        <div className="mt-8 p-4 border rounded-lg bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground mb-3">🧪 Test Credentials</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-700 dark:text-blue-300">Torbay NHS Trust (Blue Theme)</p>
              <p className="text-muted-foreground">Email: <code className="bg-background px-1 rounded">demo@torbay.nhs.uk</code></p>
              <p className="text-muted-foreground">Password: <code className="bg-background px-1 rounded">torbay123</code></p>
              <p className="text-xs text-muted-foreground mt-1">Pro Plan • Active</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
              <p className="font-medium text-green-700 dark:text-green-300">Devon NHS Trust (Green Theme)</p>
              <p className="text-muted-foreground">Email: <code className="bg-background px-1 rounded">demo@devon.nhs.uk</code></p>
              <p className="text-muted-foreground">Password: <code className="bg-background px-1 rounded">devon123</code></p>
              <p className="text-xs text-muted-foreground mt-1">Enterprise Plan • Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
