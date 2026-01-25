import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, CreditCard, Calendar, Building2, Shield, Mail } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Mock subscription data
  const subscriptionData = {
    startDate: '2024-01-15',
    expiryDate: '2025-01-15',
    billingCycle: 'Annual',
    autoRenew: true,
    nextBillingAmount: user.plan === 'pro' ? '£199.00' : user.plan === 'enterprise' ? '£999.00' : '£0.00',
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'default';
      case 'pro': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trialing': return 'secondary';
      case 'past_due': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and subscription</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Organisation</p>
                <p className="font-medium capitalize">{user.tenant} NHS Trust</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <Badge variant={getStatusBadgeVariant(user.subscriptionStatus)}>
                  {user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Plan</span>
              <Badge variant={getPlanBadgeVariant(user.plan)} className="text-sm">
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Billing Cycle</span>
              <span className="font-medium">{subscriptionData.billingCycle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Start Date</span>
              <span className="font-medium">{subscriptionData.startDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expiry Date</span>
              <span className="font-medium">{subscriptionData.expiryDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto-Renew</span>
              <span className="font-medium">{subscriptionData.autoRenew ? 'Yes' : 'No'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Usage This Month
            </CardTitle>
            <CardDescription>Your activity summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Charts Viewed</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Charts Downloaded</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Members</span>
              <span className="font-medium">{user.plan === 'enterprise' ? '12' : user.plan === 'pro' ? '5' : '1'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="font-medium">Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/billing" className="block">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                View Billing & Payments
              </Button>
            </Link>
            <Link to="/pricing" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" disabled>
              <User className="mr-2 h-4 w-4" />
              Edit Profile (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
