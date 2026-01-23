import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Shield, 
  Printer,
  Palette,
  LineChart,
  Smartphone,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mainFeatures = [
  {
    icon: BarChart3,
    title: 'Interactive Decision Flowcharts',
    description: 'Guided visual pathways built with React Flow that help clinicians and patients navigate complex treatment options step by step.',
    highlights: ['Branching logic', 'Visual node-based design', 'Touch-friendly navigation'],
  },
  {
    icon: Users,
    title: 'Shared Decision-Making Framework',
    description: 'Evidence-based tools designed around NHS shared decision-making principles, ensuring patients are at the centre of their care.',
    highlights: ['Patient preference capture', 'Risk communication aids', 'Option comparison tools'],
  },
  {
    icon: Palette,
    title: 'Multi-Tenant White-Labelling',
    description: 'Customise the platform with your NHS trust\'s branding. Each organisation gets their own logo, colours, and fonts.',
    highlights: ['Custom branding', 'Tenant isolation', 'Personalised URLs'],
  },
  {
    icon: Printer,
    title: 'Print & Download',
    description: 'Generate PDF summaries of decision pathways for patient records and take-home information sheets.',
    highlights: ['PDF export', 'Record keeping', 'Patient handouts'],
  },
];

const additionalFeatures = [
  {
    icon: LineChart,
    title: 'Usage Analytics',
    description: 'Track which decision aids are most used and monitor engagement across your trust.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Fully responsive interface that works seamlessly on tablets and phones at the bedside.',
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'NHS-grade security with data protection built in from the ground up.',
  },
  {
    icon: Shield,
    title: 'Clinical Governance',
    description: 'Tools designed to support clinical governance and audit requirements.',
  },
];

export default function Features() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Features Built for NHS Teams
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Comprehensive tools designed specifically for shared decision-making in NHS clinical settings.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {mainFeatures.map((feature) => (
              <Card key={feature.title} className="border shadow-md">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">
            And Much More
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additionalFeatures.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to See These Features in Action?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose a plan that fits your NHS trust's needs.
          </p>
          <div className="mt-8">
            <Link to="/pricing">
              <Button size="lg" className="gap-2">
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
