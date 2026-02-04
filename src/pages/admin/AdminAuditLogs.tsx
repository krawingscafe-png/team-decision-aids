import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Search, 
  Download, 
  User, 
  Settings, 
  CreditCard, 
  LogIn, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { DataTablePagination } from '@/components/admin/DataTablePagination';
import { usePagination } from '@/hooks/usePagination';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'auth' | 'user' | 'billing' | 'admin' | 'data';
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:32:15',
    user: 'dr.smith@nhs.uk',
    action: 'LOGIN',
    category: 'auth',
    details: 'Successful login from new device',
    ipAddress: '192.168.1.45',
    severity: 'info',
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:28:00',
    user: 'admin@torbaycharts.com',
    action: 'USER_ROLE_CHANGE',
    category: 'admin',
    details: 'Changed role for dr.jones@nhs.uk from Free to Pro',
    ipAddress: '10.0.0.1',
    severity: 'warning',
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:15:30',
    user: 'dr.patel@nhs.uk',
    action: 'SUBSCRIPTION_CANCEL',
    category: 'billing',
    details: 'Cancelled Pro subscription',
    ipAddress: '192.168.1.78',
    severity: 'warning',
  },
  {
    id: '4',
    timestamp: '2024-01-15 13:45:00',
    user: 'dr.wilson@nhs.uk',
    action: 'DATA_EXPORT',
    category: 'data',
    details: 'Exported patient pathway data',
    ipAddress: '192.168.1.92',
    severity: 'info',
  },
  {
    id: '5',
    timestamp: '2024-01-15 13:30:00',
    user: 'unknown',
    action: 'LOGIN_FAILED',
    category: 'auth',
    details: 'Multiple failed login attempts for dr.brown@nhs.uk',
    ipAddress: '203.45.67.89',
    severity: 'critical',
  },
  {
    id: '6',
    timestamp: '2024-01-15 13:15:00',
    user: 'dr.jones@nhs.uk',
    action: 'PROFILE_UPDATE',
    category: 'user',
    details: 'Updated profile information',
    ipAddress: '192.168.1.34',
    severity: 'info',
  },
  {
    id: '7',
    timestamp: '2024-01-15 12:45:00',
    user: 'admin@torbaycharts.com',
    action: 'TENANT_BRANDING_UPDATE',
    category: 'admin',
    details: 'Updated branding for Devon NHS Trust',
    ipAddress: '10.0.0.1',
    severity: 'info',
  },
  {
    id: '8',
    timestamp: '2024-01-15 12:30:00',
    user: 'dr.smith@nhs.uk',
    action: 'CHART_VIEW',
    category: 'data',
    details: 'Viewed Knee Arthritis pathway',
    ipAddress: '192.168.1.45',
    severity: 'info',
  },
];

const getActionIcon = (action: string) => {
  switch (action) {
    case 'LOGIN':
      return <LogIn className="h-4 w-4" />;
    case 'LOGOUT':
      return <LogOut className="h-4 w-4" />;
    case 'LOGIN_FAILED':
      return <AlertTriangle className="h-4 w-4" />;
    case 'PROFILE_UPDATE':
    case 'USER_ROLE_CHANGE':
      return <User className="h-4 w-4" />;
    case 'SUBSCRIPTION_CANCEL':
    case 'PAYMENT':
      return <CreditCard className="h-4 w-4" />;
    case 'CHART_VIEW':
    case 'DATA_EXPORT':
      return <Eye className="h-4 w-4" />;
    case 'TENANT_BRANDING_UPDATE':
      return <Settings className="h-4 w-4" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

const getSeverityBadge = (severity: AuditLog['severity']) => {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Warning</Badge>;
    default:
      return <Badge variant="outline">Info</Badge>;
  }
};

const getCategoryBadge = (category: AuditLog['category']) => {
  const colors = {
    auth: 'bg-blue-500/20 text-blue-600',
    user: 'bg-green-500/20 text-green-600',
    billing: 'bg-purple-500/20 text-purple-600',
    admin: 'bg-orange-500/20 text-orange-600',
    data: 'bg-cyan-500/20 text-cyan-600',
  };
  return (
    <Badge variant="secondary" className={colors[category]}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
};

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const { paginatedData, currentPage, totalPages, setCurrentPage, pageSize, setPageSize } = 
    usePagination(filteredLogs, 10);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Track all user actions for compliance and security</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAuditLogs.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auth Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAuditLogs.filter(l => l.category === 'auth').length}
            </div>
            <p className="text-xs text-muted-foreground">Logins, logouts, failures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockAuditLogs.filter(l => l.severity === 'warning').length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockAuditLogs.filter(l => l.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">Security alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>All system events with filtering and search</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Details</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="text-sm">{log.action.replace(/_/g, ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(log.category)}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalItems={filteredLogs.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
