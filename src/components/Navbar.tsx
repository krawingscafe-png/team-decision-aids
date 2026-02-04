import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_TENANTS } from '@/lib/tenants';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
  tenantLogo?: string;
}

export function Navbar({ tenantLogo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isSubscribed } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {tenantLogo ? (
              <img src={tenantLogo} alt="Logo" className="h-8 w-auto" />
            ) : (
              <>
                <BarChart3 className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  {user?.tenant && MOCK_TENANTS[user.tenant] 
                    ? MOCK_TENANTS[user.tenant].name.replace(' NHS Trust', '') 
                    : 'Torbay'} Charts
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
                <ThemeToggle />
                
                {user ? (
              <>
                {isSubscribed && (
                  <Link
                    to="/charts"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname.startsWith('/charts') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Charts
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:inline">{user.email}</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                {isSubscribed && (
                  <Link
                    to="/charts"
                    className="block py-2 text-sm font-medium text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Charts
                  </Link>
                )}
                <div className="pt-3 border-t">
                  <Link to="/profile" className="block py-2 text-sm font-medium text-muted-foreground" onClick={() => setIsOpen(false)}>
                    My Profile
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
