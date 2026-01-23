import { Check } from 'lucide-react';
import { PricingCard } from '@/components/PricingCard';

const plans = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    description: 'Perfect for individual clinicians exploring decision aids.',
    priceId: 'price_free',
    features: [
      'Access to 3 decision aids',
      'Basic flowchart viewer',
      'Mobile access',
      'Community support',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£199',
    period: '/year',
    description: 'Ideal for clinical teams and small departments.',
    priceId: 'price_pro',
    features: [
      'Unlimited decision aids',
      'Interactive flowcharts',
      'Print & download PDFs',
      'Usage analytics',
      'Priority email support',
      'Team management',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '£999',
    period: '/year',
    description: 'For NHS trusts requiring organisation-wide access.',
    priceId: 'price_enterprise',
    features: [
      'Everything in Pro',
      'White-label branding',
      'Custom decision aids',
      'API access',
      'Dedicated account manager',
      'SLA guarantee',
      'NHS invoicing',
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            No hidden fees. NHS invoicing available. Choose the plan that fits your team.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Info Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">Can I pay by NHS purchase order?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, we support NHS invoicing for Pro and Enterprise plans. Contact us for details.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">Is there a free trial?</h3>
              <p className="mt-2 text-muted-foreground">
                The Free plan gives you ongoing access to explore our tools. Pro and Enterprise 
                plans include a 14-day trial period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">Can I upgrade or downgrade later?</h3>
              <p className="mt-2 text-muted-foreground">
                Absolutely. You can change your plan at any time. We'll prorate the difference.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground">What payment methods do you accept?</h3>
              <p className="mt-2 text-muted-foreground">
                We accept all major credit cards via Stripe. NHS trusts can also pay by invoice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
