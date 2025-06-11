import { createFileRoute } from '@tanstack/react-router';
import { AuthConfig } from '../lib/auth-config';
import Users from '../features/users/components/users';
import AppLayout from '../components/layout/app-layout';

export const Route = createFileRoute('/users')({
  component: UsersPage,
});

function UsersPage() {
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

  return (
    <AppLayout>
      <Users />
    </AppLayout>
  );
}
