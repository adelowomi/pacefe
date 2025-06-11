import { createFileRoute } from '@tanstack/react-router';
import { AuthConfig } from '../lib/auth-config';
import OrganizationPage from '../features/organizations/components/organization';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import AppLayout from '../components/layout/app-layout';

export const Route = createFileRoute('/organization')({
  component: Organization,
});

function Organization() {
  const { data: dashboardData, isLoading } = useDashboard();

  if (!AuthConfig.isAuthenticated()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">Access Denied</h3>
          <p className="text-muted-foreground">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Use the current organization from dashboard data
  const organizationId = dashboardData?.currentOrganization?.id || 'default-org-id';

  return (
    <AppLayout>
      <OrganizationPage organizationId={organizationId} />
    </AppLayout>
  );
}
