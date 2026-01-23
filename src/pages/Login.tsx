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
      </div>
    </div>
  );
}
