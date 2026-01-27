import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Building2, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  { path: '/admin/tenants', label: 'Tenants', icon: Building2 },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const location = useLocation();
  const { adminLogout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "sticky top-0 h-screen border-r bg-card flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Shield className="h-6 w-6 text-primary flex-shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-foreground">Admin Panel</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={adminLogout}
          className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
