import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  priceId: string;
  features: string[];
  highlighted: boolean;
}

interface PricingCardProps {
  plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const { initiateCheckout, isLoading } = useStripeCheckout();

  const handleChoose = () => {
    if (plan.priceId === 'price_free') {
      // For free plan, redirect directly to login
      window.location.href = '/login?plan=free';
      return;
    }
    initiateCheckout(plan.priceId);
  };

  return (
    <Card 
      className={cn(
        'relative flex flex-col transition-shadow hover:shadow-lg',
        plan.highlighted && 'border-primary shadow-lg ring-2 ring-primary/20'
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
          <span className="text-muted-foreground">{plan.period}</span>
        </div>
        
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.highlighted ? 'default' : 'outline'}
          onClick={handleChoose}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Choose ' + plan.name}
        </Button>
      </CardFooter>
    </Card>
  );
}
