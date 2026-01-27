import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_ADMIN_USERS, AdminUser } from '@/lib/admin';
import { Search, MoreHorizontal, Mail, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredUsers = MOCK_ADMIN_USERS.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTenant = tenantFilter === 'all' || user.tenant === tenantFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesTenant && matchesPlan;
  });

  const getStatusBadge = (status: AdminUser['subscriptionStatus']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Trial</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Canceled</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Past Due</Badge>;
      default:
        return <Badge variant="secondary">None</Badge>;
    }
  };

  const getPlanBadge = (plan: AdminUser['plan']) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">Enterprise</Badge>;
      case 'pro':
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Pro</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">Manage all registered users and their subscriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={tenantFilter} onValueChange={setTenantFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                <SelectItem value="torbay">Torbay</SelectItem>
                <SelectItem value="devon">Devon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Charts Viewed</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="capitalize">{user.tenant}</TableCell>
                    <TableCell>{getPlanBadge(user.plan)}</TableCell>
                    <TableCell>{getStatusBadge(user.subscriptionStatus)}</TableCell>
                    <TableCell>{user.chartsViewed}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {MOCK_ADMIN_USERS.length} users
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
