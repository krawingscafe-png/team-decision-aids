import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Lock, Mail, CheckCircle2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

const PLAN_DETAILS = {
  pro: { name: 'Pro Plan', price: '£199', period: '/year', features: ['Unlimited charts', 'Priority support', 'Custom branding'] },
  enterprise: { name: 'Enterprise Plan', price: '£999', period: '/year', features: ['Everything in Pro', 'SSO integration', 'Dedicated support', 'NHS invoicing'] },
  free: { name: 'Free Plan', price: '£0', period: '/year', features: ['5 charts per month', 'Community support'] },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromCheckout } = useAuth();
  const { toast } = useToast();
  
  const planId = (searchParams.get('plan') || 'pro') as keyof typeof PLAN_DETAILS;
  const plan = PLAN_DETAILS[planId] || PLAN_DETAILS.pro;

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Partial<CardDetails>>({});

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CardDetails> = {};

    if (!cardDetails.email || !cardDetails.email.includes('@')) {
      newErrors.email = 'Valid email required';
    }
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Enter 16-digit card number';
    }
    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = 'Cardholder name required';
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Use MM/YY format';
    }
    if (cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Enter 3-4 digit CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate sending confirmation email
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsProcessing(false);
    setIsComplete(true);

    toast({
      title: "Payment Successful!",
      description: `Confirmation email sent to ${cardDetails.email}`,
    });

    // Auto-authenticate after 2 seconds
    setTimeout(async () => {
      const mockSessionId = `mock_session_${Date.now()}`;
      await setUserFromCheckout(mockSessionId);
      navigate('/charts');
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for subscribing to {plan.name}
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Confirmation sent to {cardDetails.email}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Purchase</h1>
          <p className="text-muted-foreground mt-2">Secure payment powered by NHS-approved systems</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Payment Form */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Details
              </CardTitle>
              <CardDescription>Enter your card information below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@hospital.nhs.uk"
                    value={cardDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <Separator />

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className={`pl-10 ${errors.cardNumber ? 'border-destructive' : ''}`}
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="DR JOHN SMITH"
                    value={cardDetails.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                    className={errors.cardName ? 'border-destructive' : ''}
                  />
                  {errors.cardName && <p className="text-sm text-destructive">{errors.cardName}</p>}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className={errors.expiryDate ? 'border-destructive' : ''}
                    />
                    {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className={errors.cvv ? 'border-destructive' : ''}
                    />
                    {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                  </div>
                </div>

                {/* Test Card Notice */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>🧪 Test Mode:</strong> Use card <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">4242 4242 4242 4242</code>, any future expiry, any 3-digit CVV
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay {plan.price} Now
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>256-bit SSL encrypted • NHS Data Security compliant</span>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="md:col-span-2 h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">Annual subscription</p>
                </div>
                <p className="font-bold">{plan.price}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">What's included:</p>
                <ul className="space-y-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{plan.price}{plan.period}</span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Cancel anytime. NHS invoicing available for Enterprise plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
