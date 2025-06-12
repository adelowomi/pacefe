import React from 'react';
import { useLocation } from '@tanstack/react-router';
import Sidebar from '@/features/dashboard/components/sidebar';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { AuthConfig } from '@/lib/auth-config';

interface AppLayoutProps {
  children: React.ReactNode;
  selectedOrganizationId?: string;
  onOrganizationChange?: (organizationId: string | undefined) => void;
}

export default function AppLayout({ 
  children, 
  selectedOrganizationId 
}: AppLayoutProps) {
  const location = useLocation();
  const { data: dashboardData, isLoading } = useDashboard(selectedOrganizationId);

  const handleLogout = () => {
    AuthConfig.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 bg-sidebar border-r border-sidebar-border"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        currentUser={dashboardData?.currentUser}
        currentOrganization={dashboardData?.currentOrganization}
        currentPath={location.pathname}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
