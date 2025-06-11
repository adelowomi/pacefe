import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Home, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  ArrowUpDown,
  Calendar,
  Moon,
  Sun
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

interface SidebarProps {
  currentUser?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePictureUrl?: string | null;
  };
  currentOrganization?: {
    name?: string;
  };
  currentPath?: string;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
}

export default function Sidebar({ currentUser, currentOrganization, currentPath, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      active: currentPath === '/dashboard',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      href: '/calendar',
      active: currentPath === '/calendar',
    },
    {
      id: 'transfers',
      label: 'Transfers',
      icon: ArrowUpDown,
      href: '/transfers',
      active: currentPath === '/transfers',
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: Building2,
      href: '/organization',
      active: currentPath === '/organization',
    },
  ];

  const getUserInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`;
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-sidebar-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Pace</h1>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md hover:bg-sidebar-accent transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-sidebar-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-sidebar-foreground" />
              )}
            </button>
            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-sidebar-accent transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
              )}
            </button>
          </div>
        </div>
        
        {/* Organization Info */}
        {!isCollapsed && currentOrganization?.name && (
          <div className="mt-3 p-2 bg-sidebar-accent rounded-lg">
            <p className="text-xs text-muted-foreground">Organization</p>
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
              {currentOrganization.name}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${item.active ? 'text-sidebar-accent-foreground' : 'text-muted-foreground'} ${
                    isCollapsed ? '' : 'mr-3'
                  }`} />
                  {!isCollapsed && (
                    <span className={item.active ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {currentUser?.profilePictureUrl ? (
                <img
                  src={currentUser.profilePictureUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground text-sm font-medium">
                    {getUserInitials()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex-shrink-0">
              {currentUser?.profilePictureUrl ? (
                <img
                  src={currentUser.profilePictureUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground text-sm font-medium">
                    {getUserInitials()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-1 text-muted-foreground hover:text-sidebar-foreground transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onLogout}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
