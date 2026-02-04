import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  TrendingUp,
  Users,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 12400, users: 156 },
  { month: 'Feb', revenue: 14200, users: 178 },
  { month: 'Mar', revenue: 15800, users: 195 },
  { month: 'Apr', revenue: 18300, users: 212 },
  { month: 'May', revenue: 21200, users: 234 },
  { month: 'Jun', revenue: 24100, users: 256 },
];

const planDistribution = [
  { name: 'Free', value: 45, color: 'hsl(var(--muted-foreground))' },
  { name: 'Pro', value: 38, color: 'hsl(var(--primary))' },
  { name: 'Enterprise', value: 17, color: 'hsl(var(--chart-1))' },
];

const tenantPerformance = [
  { name: 'Torbay NHS', users: 89, revenue: 8900, growth: 12 },
  { name: 'Devon NHS', users: 67, revenue: 6700, growth: 8 },
  { name: 'Cornwall NHS', users: 54, revenue: 5400, growth: 15 },
  { name: 'Plymouth NHS', users: 45, revenue: 4500, growth: 5 },
];

const reportTemplates = [
  { id: 'revenue', name: 'Revenue Report', description: 'Monthly revenue breakdown by plan and tenant', icon: CreditCard },
  { id: 'users', name: 'User Activity Report', description: 'User engagement and activity metrics', icon: Users },
  { id: 'usage', name: 'Usage Report', description: 'Feature usage and quota consumption', icon: BarChart3 },
  { id: 'growth', name: 'Growth Report', description: 'User acquisition and retention metrics', icon: TrendingUp },
];

export default function AdminReports() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [selectedReport, setSelectedReport] = useState('revenue');

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Reports</h1>
          <p className="text-muted-foreground">Generate and export detailed analytics reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid gap-4 md:grid-cols-4">
        {reportTemplates.map((report) => (
          <Card 
            key={report.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedReport === report.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <report.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">{report.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tenants">By Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly recurring revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `£${v / 1000}k`} />
                      <Tooltip 
                        formatter={(value: number) => [`£${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>User distribution across subscription plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & User Growth</CardTitle>
              <CardDescription>Correlation between user growth and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" tickFormatter={(v) => `£${v / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Revenue (£)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Performance</CardTitle>
              <CardDescription>Revenue and user metrics by NHS Trust</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantPerformance.map((tenant) => (
                  <div 
                    key={tenant.name}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.users} active users</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">£{tenant.revenue.toLocaleString()}/mo</p>
                      <Badge variant="outline" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{tenant.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
