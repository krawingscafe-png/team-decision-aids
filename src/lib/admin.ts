// Admin mock data and utilities

export interface AdminUser {
  id: string;
  email: string;
  tenant: string;
  plan: 'free' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'trialing' | 'canceled' | 'past_due' | 'none';
  createdAt: string;
  lastLogin: string;
  chartsViewed: number;
}

export interface AdminPayment {
  id: string;
  userId: string;
  userEmail: string;
  tenant: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  plan: string;
  date: string;
  invoiceNumber: string;
}

export interface AdminTenant {
  id: string;
  name: string;
  primaryColor: string;
  usersCount: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalChartViews: number;
  userGrowth: number;
  revenueGrowth: number;
}

// Mock admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@torbaycharts.com',
  password: 'admin123',
};

// Mock users data
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'demo@torbay.nhs.uk',
    tenant: 'torbay',
    plan: 'pro',
    subscriptionStatus: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2025-01-27',
    chartsViewed: 156,
  },
  {
    id: '2',
    email: 'demo@devon.nhs.uk',
    tenant: 'devon',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2025-01-26',
    chartsViewed: 342,
  },
  {
    id: '3',
    email: 'dr.smith@torbay.nhs.uk',
    tenant: 'torbay',
    plan: 'pro',
    subscriptionStatus: 'active',
    createdAt: '2024-03-10',
    lastLogin: '2025-01-25',
    chartsViewed: 89,
  },
  {
    id: '4',
    email: 'nurse.jones@devon.nhs.uk',
    tenant: 'devon',
    plan: 'pro',
    subscriptionStatus: 'trialing',
    createdAt: '2025-01-10',
    lastLogin: '2025-01-27',
    chartsViewed: 23,
  },
  {
    id: '5',
    email: 'consultant@torbay.nhs.uk',
    tenant: 'torbay',
    plan: 'free',
    subscriptionStatus: 'none',
    createdAt: '2024-11-05',
    lastLogin: '2025-01-20',
    chartsViewed: 5,
  },
  {
    id: '6',
    email: 'admin.team@devon.nhs.uk',
    tenant: 'devon',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2025-01-27',
    chartsViewed: 567,
  },
];

// Mock payments data
export const MOCK_ADMIN_PAYMENTS: AdminPayment[] = [
  {
    id: 'pay_1',
    userId: '1',
    userEmail: 'demo@torbay.nhs.uk',
    tenant: 'torbay',
    amount: 199,
    currency: 'GBP',
    status: 'succeeded',
    plan: 'Pro Annual',
    date: '2025-01-15',
    invoiceNumber: 'INV-2025-001',
  },
  {
    id: 'pay_2',
    userId: '2',
    userEmail: 'demo@devon.nhs.uk',
    tenant: 'devon',
    amount: 999,
    currency: 'GBP',
    status: 'succeeded',
    plan: 'Enterprise Annual',
    date: '2025-01-10',
    invoiceNumber: 'INV-2025-002',
  },
  {
    id: 'pay_3',
    userId: '3',
    userEmail: 'dr.smith@torbay.nhs.uk',
    tenant: 'torbay',
    amount: 199,
    currency: 'GBP',
    status: 'succeeded',
    plan: 'Pro Annual',
    date: '2025-01-05',
    invoiceNumber: 'INV-2025-003',
  },
  {
    id: 'pay_4',
    userId: '6',
    userEmail: 'admin.team@devon.nhs.uk',
    tenant: 'devon',
    amount: 999,
    currency: 'GBP',
    status: 'succeeded',
    plan: 'Enterprise Annual',
    date: '2024-12-20',
    invoiceNumber: 'INV-2024-089',
  },
  {
    id: 'pay_5',
    userId: '4',
    userEmail: 'nurse.jones@devon.nhs.uk',
    tenant: 'devon',
    amount: 0,
    currency: 'GBP',
    status: 'pending',
    plan: 'Pro Trial',
    date: '2025-01-10',
    invoiceNumber: 'INV-2025-004',
  },
  {
    id: 'pay_6',
    userId: '1',
    userEmail: 'demo@torbay.nhs.uk',
    tenant: 'torbay',
    amount: 199,
    currency: 'GBP',
    status: 'refunded',
    plan: 'Pro Annual',
    date: '2024-06-15',
    invoiceNumber: 'INV-2024-045',
  },
];

// Mock tenants data
export const MOCK_ADMIN_TENANTS: AdminTenant[] = [
  {
    id: 'torbay',
    name: 'Torbay NHS Trust',
    primaryColor: '221 83% 53%',
    usersCount: 3,
    activeSubscriptions: 2,
    monthlyRevenue: 398,
    createdAt: '2024-01-01',
  },
  {
    id: 'devon',
    name: 'Devon NHS Trust',
    primaryColor: '142 76% 36%',
    usersCount: 3,
    activeSubscriptions: 3,
    monthlyRevenue: 2197,
    createdAt: '2024-01-01',
  },
];

// Calculate admin stats
export function getAdminStats(): AdminStats {
  const totalUsers = MOCK_ADMIN_USERS.length;
  const activeSubscriptions = MOCK_ADMIN_USERS.filter(
    u => u.subscriptionStatus === 'active' || u.subscriptionStatus === 'trialing'
  ).length;
  const monthlyRevenue = MOCK_ADMIN_TENANTS.reduce((sum, t) => sum + t.monthlyRevenue, 0);
  const totalChartViews = MOCK_ADMIN_USERS.reduce((sum, u) => sum + u.chartsViewed, 0);

  return {
    totalUsers,
    activeSubscriptions,
    monthlyRevenue,
    totalChartViews,
    userGrowth: 12.5, // Mock percentage
    revenueGrowth: 23.8, // Mock percentage
  };
}

// Mock chart data for analytics
export const REVENUE_CHART_DATA = [
  { month: 'Aug', revenue: 1200 },
  { month: 'Sep', revenue: 1450 },
  { month: 'Oct', revenue: 1800 },
  { month: 'Nov', revenue: 2100 },
  { month: 'Dec', revenue: 2350 },
  { month: 'Jan', revenue: 2595 },
];

export const USER_GROWTH_DATA = [
  { month: 'Aug', users: 2 },
  { month: 'Sep', users: 3 },
  { month: 'Oct', users: 4 },
  { month: 'Nov', users: 5 },
  { month: 'Dec', users: 5 },
  { month: 'Jan', users: 6 },
];

export const CHART_USAGE_DATA = [
  { name: 'Antibiotic Decision Aid', views: 234 },
  { name: 'Diabetes Management', views: 189 },
  { name: 'Cardiac Assessment', views: 156 },
  { name: 'Pain Management', views: 142 },
  { name: 'Respiratory Care', views: 98 },
];
