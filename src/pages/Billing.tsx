import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  Receipt
} from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

interface PaymentMethod {
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function Billing() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Mock invoices data
  const invoices: Invoice[] = [
    { id: 'INV-2024-001', date: '2024-01-15', amount: '£199.00', status: 'paid', description: 'Pro Plan - Annual Subscription' },
    { id: 'INV-2023-012', date: '2023-12-15', amount: '£19.90', status: 'paid', description: 'Pro Plan - Monthly (Prorated)' },
    { id: 'INV-2023-011', date: '2023-11-15', amount: '£0.00', status: 'paid', description: 'Free Trial Activation' },
  ];

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    { type: 'card', last4: '4242', brand: 'Visa', expiryMonth: 12, expiryYear: 2026, isDefault: true },
    { type: 'card', last4: '5555', brand: 'Mastercard', expiryMonth: 6, expiryYear: 2025, isDefault: false },
  ];

  // Mock billing info
  const billingInfo = {
    name: `${user.tenant.charAt(0).toUpperCase() + user.tenant.slice(1)} NHS Trust`,
    address: '123 Hospital Road',
    city: user.tenant === 'torbay' ? 'Torquay' : 'Exeter',
    postcode: user.tenant === 'torbay' ? 'TQ2 7AA' : 'EX2 5DW',
    country: 'United Kingdom',
    vatNumber: 'GB123456789',
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8">
        <Link to="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-muted-foreground mt-2">Manage your payment methods and view invoices</p>
      </div>

      <div className="grid gap-6">
        {/* Current Plan Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold text-foreground">
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.plan === 'pro' ? '£199/year' : user.plan === 'enterprise' ? '£999/year' : 'Free'}
                  {' • '}Renews on January 15, 2025
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/pricing">
                  <Button variant="outline">Change Plan</Button>
                </Link>
                <Button variant="destructive" disabled>Cancel Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Methods
            </CardTitle>
            <CardDescription>Cards saved for automatic billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-xs font-medium">
                    {method.brand}
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• {method.last4}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Billing Information
            </CardTitle>
            <CardDescription>Details used for invoicing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Organisation Name</p>
                <p className="font-medium">{billingInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VAT Number</p>
                <p className="font-medium">{billingInfo.vatNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{billingInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{billingInfo.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Postcode</p>
                <p className="font-medium">{billingInfo.postcode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{billingInfo.country}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4">Edit Billing Details</Button>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Invoice History
            </CardTitle>
            <CardDescription>Download past invoices and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invoice.id}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.description}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{invoice.amount}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              NHS invoicing available for Enterprise plans. Contact support for purchase orders.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
