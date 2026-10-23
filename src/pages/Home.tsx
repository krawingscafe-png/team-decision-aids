import { Link } from 'react-router-dom';
import { ArrowRight, Users, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: BarChart3,
    title: 'Interactive Decision Aids',
    description: 'Visual flowcharts that guide clinicians and patients through treatment options together.',
  },
  {
    icon: Users,
    title: 'Patient-Centred Care',
    description: 'Empower patients to participate actively in their healthcare decisions.',
  },
  {
    icon: Shield,
    title: 'NHS Compliant',
    description: 'Designed to meet NHS digital standards and clinical governance requirements.',
  },
  {
    icon: Clock,
    title: 'Save Consultation Time',
    description: 'Streamlined tools that make shared decision-making efficient and effective.',
  },
];

const benefits = [
  'Evidence-based decision pathways',
  'Multi-trust white-label support',
  'Print and download capabilities',
  'Real-time usage analytics',
  'Mobile-friendly design',
  'Secure NHS-grade hosting',
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-display-1 font-bold tracking-tight text-foreground sm:text-display-2 lg:text-display-3">
              Shared Decision-Making
              <span className="block text-primary">for NHS Teams &amp; Patients</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Interactive decision aid tools that empower patients and clinicians to make 
              informed treatment choices together. Built specifically for NHS trusts.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/pricing">
                <Button size="lg" className="gap-2">
                  View Pricing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose Torbay Charts?</h2>
            <p className="mt-4 text-muted-foreground">
              Purpose-built tools for NHS shared decision-making
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Everything Your NHS Trust Needs
              </h2>
              <p className="mt-4 text-muted-foreground">
                Comprehensive features designed with NHS clinical teams in mind. 
                From interactive flowcharts to analytics, we've got you covered.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/features">
                  <Button variant="outline" className="gap-2">
                    Explore All Features
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-16 w-16 text-primary/60" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Interactive Decision Aid Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to Transform Patient Care?</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Join NHS trusts across the country using Torbay Charts for better 
            patient outcomes through shared decision-making.
          </p>
          <div className="mt-8">
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
