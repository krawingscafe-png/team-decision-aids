import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  Eye, 
  TrendingUp, 
  ArrowRight,
  Calendar,
  FileText,
  Star,
  Zap
} from 'lucide-react';

// Mock data for dashboard
const recentActivity = [
  { id: 1, action: 'Viewed', item: 'Knee Arthritis Pathway', time: '2 hours ago', icon: Eye },
  { id: 2, action: 'Compared', item: 'Hip vs Knee treatments', time: '5 hours ago', icon: BarChart3 },
  { id: 3, action: 'Saved', item: 'Shoulder Replacement Guide', time: 'Yesterday', icon: Star },
  { id: 4, action: 'Viewed', item: 'Hip Arthritis Pathway', time: '2 days ago', icon: Eye },
];

const quickActions = [
  { label: 'Browse Charts', path: '/charts', icon: BarChart3, color: 'bg-primary' },
  { label: 'View Profile', path: '/profile', icon: FileText, color: 'bg-secondary' },
  { label: 'Manage Billing', path: '/billing', icon: Calendar, color: 'bg-accent' },
];

const usageStats = {
  chartsViewed: 24,
  chartsLimit: 50,
  comparisonsUsed: 8,
  comparisonsLimit: 20,
  savedItems: 12,
  savedLimit: 30,
};

export default function Dashboard() {
  const { user } = useAuth();

  const getUsagePercentage = (used: number, limit: number) => (used / limit) * 100;

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your activity and usage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {user?.plan || 'Free'} Plan
          </Badge>
          {user?.plan === 'pro' && (
            <Badge className="bg-gradient-to-r from-primary to-primary/80">
              <Zap className="h-3 w-3 mr-1" />
              Pro Member
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charts Viewed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.chartsViewed}</div>
            <p className="text-xs text-muted-foreground">
              of {usageStats.chartsLimit} this month
            </p>
            <Progress 
              value={getUsagePercentage(usageStats.chartsViewed, usageStats.chartsLimit)} 
              className="mt-2 h-1" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comparisons</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.comparisonsUsed}</div>
            <p className="text-xs text-muted-foreground">
              of {usageStats.comparisonsLimit} this month
            </p>
            <Progress 
              value={getUsagePercentage(usageStats.comparisonsUsed, usageStats.comparisonsLimit)} 
              className="mt-2 h-1" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.savedItems}</div>
            <p className="text-xs text-muted-foreground">
              of {usageStats.savedLimit} available
            </p>
            <Progress 
              value={getUsagePercentage(usageStats.savedItems, usageStats.savedLimit)} 
              className="mt-2 h-1" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">
              estimated this month
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest interactions with charts and treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.action}: {activity.item}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" asChild>
              <Link to="/charts">
                View All Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Jump to frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                >
                  <div className={`h-8 w-8 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  {action.label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Banner (for non-pro users) */}
      {subscription?.plan !== 'enterprise' && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Unlock More Features</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to {subscription?.plan === 'pro' ? 'Enterprise' : 'Pro'} for unlimited access and priority support
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/pricing">
                View Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
