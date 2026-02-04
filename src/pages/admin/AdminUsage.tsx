import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { AlertTriangle, TrendingUp, Users, Activity, Gauge } from 'lucide-react';

// Mock usage data
const planLimits = [
  { plan: 'Free', chartsLimit: 10, comparisonsLimit: 5, savedLimit: 10, apiCalls: 100 },
  { plan: 'Pro', chartsLimit: 50, comparisonsLimit: 20, savedLimit: 30, apiCalls: 1000 },
  { plan: 'Enterprise', chartsLimit: -1, comparisonsLimit: -1, savedLimit: -1, apiCalls: -1 },
];

const userUsageData = [
  { email: 'dr.smith@nhs.uk', plan: 'Pro', chartsViewed: 45, comparisons: 18, saved: 25, status: 'warning' },
  { email: 'dr.jones@nhs.uk', plan: 'Free', chartsViewed: 8, comparisons: 4, saved: 9, status: 'normal' },
  { email: 'dr.patel@nhs.uk', plan: 'Pro', chartsViewed: 32, comparisons: 12, saved: 15, status: 'normal' },
  { email: 'dr.wilson@nhs.uk', plan: 'Free', chartsViewed: 10, comparisons: 5, saved: 10, status: 'exceeded' },
  { email: 'dr.brown@nhs.uk', plan: 'Enterprise', chartsViewed: 156, comparisons: 89, saved: 45, status: 'normal' },
];

const dailyUsage = [
  { date: 'Mon', charts: 120, comparisons: 45, api: 890 },
  { date: 'Tue', charts: 145, comparisons: 52, api: 920 },
  { date: 'Wed', charts: 98, comparisons: 38, api: 756 },
  { date: 'Thu', charts: 167, comparisons: 61, api: 1102 },
  { date: 'Fri', charts: 189, comparisons: 78, api: 1245 },
  { date: 'Sat', charts: 67, comparisons: 23, api: 456 },
  { date: 'Sun', charts: 45, comparisons: 18, api: 320 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'exceeded':
      return <Badge variant="destructive">Exceeded</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Near Limit</Badge>;
    default:
      return <Badge variant="outline">Normal</Badge>;
  }
};

export default function AdminUsage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Usage & Quotas</h1>
        <p className="text-muted-foreground">Monitor user usage and manage plan limits</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,689</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Near Limit</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              users at 80%+ usage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exceeded</CardTitle>
            <Gauge className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">
              users over quota
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Usage</TabsTrigger>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
          <TabsTrigger value="limits">Plan Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Usage Overview</CardTitle>
              <CardDescription>Monitor individual user consumption against plan limits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Charts Viewed</TableHead>
                    <TableHead>Comparisons</TableHead>
                    <TableHead>Saved Items</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userUsageData.map((user) => {
                    const planLimit = planLimits.find(p => p.plan === user.plan);
                    return (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span className="text-sm">
                              {user.chartsViewed}
                              {planLimit && planLimit.chartsLimit > 0 && ` / ${planLimit.chartsLimit}`}
                            </span>
                            {planLimit && planLimit.chartsLimit > 0 && (
                              <Progress 
                                value={(user.chartsViewed / planLimit.chartsLimit) * 100} 
                                className="h-1" 
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span className="text-sm">
                              {user.comparisons}
                              {planLimit && planLimit.comparisonsLimit > 0 && ` / ${planLimit.comparisonsLimit}`}
                            </span>
                            {planLimit && planLimit.comparisonsLimit > 0 && (
                              <Progress 
                                value={(user.comparisons / planLimit.comparisonsLimit) * 100} 
                                className="h-1" 
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.saved}
                          {planLimit && planLimit.savedLimit > 0 && ` / ${planLimit.savedLimit}`}
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Usage Trends</CardTitle>
              <CardDescription>Platform usage over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="charts" name="Charts Viewed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comparisons" name="Comparisons" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Plan Limits Configuration</CardTitle>
              <CardDescription>Current quota limits for each subscription tier</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Charts/Month</TableHead>
                    <TableHead>Comparisons/Month</TableHead>
                    <TableHead>Saved Items</TableHead>
                    <TableHead>API Calls/Month</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planLimits.map((plan) => (
                    <TableRow key={plan.plan}>
                      <TableCell>
                        <Badge variant={plan.plan === 'Enterprise' ? 'default' : 'outline'}>
                          {plan.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.chartsLimit === -1 ? 'Unlimited' : plan.chartsLimit}</TableCell>
                      <TableCell>{plan.comparisonsLimit === -1 ? 'Unlimited' : plan.comparisonsLimit}</TableCell>
                      <TableCell>{plan.savedLimit === -1 ? 'Unlimited' : plan.savedLimit}</TableCell>
                      <TableCell>{plan.apiCalls === -1 ? 'Unlimited' : plan.apiCalls.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
