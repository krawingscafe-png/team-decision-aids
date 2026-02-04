import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const plan = searchParams.get('plan') || 'pro';
  
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Simulate verification check (for demo purposes)
  useEffect(() => {
    // In real implementation, this would poll the backend or use websockets
    const timer = setTimeout(() => {
      setIsVerified(true);
    }, 5000); // Auto-verify after 5 seconds for demo

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendCooldown(60);
    }, 1500);
  };

  const handleContinueToPayment = () => {
    navigate(`/checkout?plan=${plan}`);
  };

  // Mask email for display
  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.slice(0, 2) + '***' + local.slice(-1);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm text-muted-foreground">Sign Up</span>
          </div>
          <div className="w-8 h-px bg-primary" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isVerified 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-primary text-primary-foreground animate-pulse'
            }`}>
              {isVerified ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <span className={`text-sm font-medium ${isVerified ? 'text-primary' : 'text-primary'}`}>
              Verify
            </span>
          </div>
          <div className={`w-8 h-px ${isVerified ? 'bg-primary' : 'bg-border'}`} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-sm text-muted-foreground">Payment</span>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isVerified 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-primary/10'
            }`}>
              {isVerified ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <Mail className="w-8 h-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isVerified ? 'Email Verified!' : 'Check your email'}
            </CardTitle>
            <CardDescription className="mt-2">
              {isVerified ? (
                'Your email has been verified successfully. Continue to complete your subscription.'
              ) : (
                <>
                  We've sent a verification link to
                  <br />
                  <span className="font-medium text-foreground">{maskEmail(email)}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4 space-y-4">
            {isVerified ? (
              <Button 
                onClick={handleContinueToPayment}
                className="w-full gap-2" 
                size="lg"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Didn't receive the email?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>

                <Button 
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full gap-2"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>Resend in {resendCooldown}s</>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Resend verification email
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Verification link expires in 24 hours
                </p>
              </>
            )}

            <div className="pt-4 border-t text-center">
              <Link 
                to="/signup" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="mt-6 p-4 border rounded-lg bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            🧪 <span className="font-semibold">Demo Mode:</span> Email will auto-verify in 5 seconds for testing purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
