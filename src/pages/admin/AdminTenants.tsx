import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_ADMIN_TENANTS, AdminTenant } from '@/lib/admin';
import { Plus, Users, CreditCard, TrendingUp } from 'lucide-react';
import { TenantBrandingEditor } from '@/components/admin/TenantBrandingEditor';

export default function AdminTenants() {
  const [tenants, setTenants] = useState(MOCK_ADMIN_TENANTS);

  const handleSaveTenant = (updatedTenant: AdminTenant) => {
    setTenants(prev => 
      prev.map(t => t.id === updatedTenant.id ? updatedTenant : t)
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
          <p className="text-muted-foreground">Manage NHS Trust organizations and their branding</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Tenant Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-lg"
                  style={{ backgroundColor: `hsl(${tenant.primaryColor})` }}
                />
                <div>
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {tenant.id}</p>
                </div>
              </div>
              <TenantBrandingEditor tenant={tenant} onSave={handleSaveTenant} />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{tenant.usersCount}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <CreditCard className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{tenant.activeSubscriptions}</p>
                  <p className="text-xs text-muted-foreground">Subscriptions</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">£{tenant.monthlyRevenue}</p>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tenant List Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Primary Color</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Active Subs</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-4 w-4 rounded"
                          style={{ backgroundColor: `hsl(${tenant.primaryColor})` }}
                        />
                        <span className="font-medium">{tenant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        hsl({tenant.primaryColor})
                      </code>
                    </TableCell>
                    <TableCell>{tenant.usersCount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{tenant.activeSubscriptions}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">£{tenant.monthlyRevenue}</TableCell>
                    <TableCell>{tenant.createdAt}</TableCell>
                    <TableCell>
                      <TenantBrandingEditor tenant={tenant} onSave={handleSaveTenant} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
