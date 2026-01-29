import { useState } from 'react';
import { Bell, UserPlus, CreditCard, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminNotification {
  id: string;
  type: 'signup' | 'payment_failed' | 'payment_success' | 'subscription_change';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock notifications
const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: '1',
    type: 'signup',
    title: 'New User Signup',
    message: 'nurse.jones@devon.nhs.uk just signed up',
    timestamp: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'payment_success',
    title: 'Payment Received',
    message: 'Pro subscription payment from demo@torbay.nhs.uk',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Card declined for consultant@torbay.nhs.uk',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'subscription_change',
    title: 'Plan Upgrade',
    message: 'admin.team@devon.nhs.uk upgraded to Enterprise',
    timestamp: '2 days ago',
    read: true,
  },
];

export function AdminNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'signup':
        return <UserPlus className="h-4 w-4 text-primary" />;
      case 'payment_success':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'payment_failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'subscription_change':
        return <Check className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer focus:bg-muted",
                  !notification.read && "bg-primary/5"
                )}
                onSelect={(e) => {
                  e.preventDefault();
                  markAsRead(notification.id);
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.timestamp}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
