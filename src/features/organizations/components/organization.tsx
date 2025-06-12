import { useState } from 'react';
import { 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Edit,
  UserPlus,
  Shield,
  Trash2,
  Settings,
  Plus
} from 'lucide-react';
import { useOrganization } from '../hooks/useOrganization';
import { useOrganizationMembers, useRemoveOrganizationMember, useUpdateMemberRole } from '../hooks/useOrganizationMembers';
import AddMemberModal from './add-member-modal';
import CreateOrganizationModal from './create-organization-modal';

interface OrganizationPageProps {
  organizationId: string;
}

export default function OrganizationPage({ organizationId }: OrganizationPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateOrganization, setShowCreateOrganization] = useState(false);

  const { data: organizationData, isLoading: isLoadingOrg } = useOrganization(organizationId);
  const { data: membersData, isLoading: isLoadingMembers } = useOrganizationMembers(organizationId);
  const removeMemberMutation = useRemoveOrganizationMember();
  const updateRoleMutation = useUpdateMemberRole();

  const organization = organizationData?.data;
  const members = membersData?.data || [];

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMemberMutation.mutateAsync(memberId);
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await updateRoleMutation.mutateAsync({ memberId, role: newRole });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  if (isLoadingOrg) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCreateOrganizationSuccess = (organizationId: string) => {
    // Optionally navigate to the new organization or refresh the current one
    window.location.reload();
  };

  if (!organization) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">Organization not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The organization you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setShowCreateOrganization(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </button>
        </div>
        
        {/* Create Organization Modal */}
        <CreateOrganizationModal
          isOpen={showCreateOrganization}
          onClose={() => setShowCreateOrganization(false)}
          onSuccess={handleCreateOrganizationSuccess}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {organization.logoUrl ? (
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{organization.name}</h1>
              {organization.description && (
                <p className="text-muted-foreground mt-1">{organization.description}</p>
              )}
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground">
            <Edit className="h-4 w-4 mr-2" />
            Edit Organization
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'settings', label: 'Settings', icon: Edit },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Organization Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Members Card */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {isLoadingMembers ? '...' : members.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Members Card */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {isLoadingMembers ? '...' : members.filter(m => m.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Members Card */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserPlus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {isLoadingMembers ? '...' : members.filter(m => m.role === 'Admin' || m.role === 'Owner').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Organization Status Card */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Organization Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-card shadow-sm rounded-lg border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">Organization Information</h3>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                        <Building2 className="h-4 w-4 mr-2" />
                        Organization Name
                      </dt>
                      <dd className="text-sm text-card-foreground font-medium">{organization.name}</dd>
                    </div>
                    
                    {organization.description && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-muted-foreground mb-2">Description</dt>
                        <dd className="text-sm text-card-foreground">{organization.description}</dd>
                      </div>
                    )}

                    {organization.contactEmail && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Email
                        </dt>
                        <dd className="text-sm text-card-foreground">
                          <a href={`mailto:${organization.contactEmail}`} className="text-primary hover:text-primary/80">
                            {organization.contactEmail}
                          </a>
                        </dd>
                      </div>
                    )}

                    {organization.contactPhone && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact Phone
                        </dt>
                        <dd className="text-sm text-card-foreground">
                          <a href={`tel:${organization.contactPhone}`} className="text-primary hover:text-primary/80">
                            {organization.contactPhone}
                          </a>
                        </dd>
                      </div>
                    )}

                    {organization.websiteUrl && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </dt>
                        <dd className="text-sm text-card-foreground">
                          <a 
                            href={organization.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            {organization.websiteUrl}
                          </a>
                        </dd>
                      </div>
                    )}

                    {organization.dateUpdated && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Last Updated
                        </dt>
                        <dd className="text-sm text-card-foreground">
                          {new Date(organization.dateUpdated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card shadow-sm rounded-lg border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-card-foreground">Organization created</p>
                        <p className="text-xs text-muted-foreground">
                          {organization.dateUpdated 
                            ? new Date(organization.dateUpdated).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Recently'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {members.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-card-foreground">
                            {members.length} member{members.length !== 1 ? 's' : ''} added
                          </p>
                          <p className="text-xs text-muted-foreground">Active team</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-card shadow-sm rounded-lg border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Organization
                  </button>
                  <button 
                    onClick={() => setActiveTab('members')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Members
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Organization Settings
                  </button>
                </div>
              </div>

              {/* Member Summary */}
              <div className="bg-card shadow-sm rounded-lg border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">Team Overview</h3>
                </div>
                <div className="p-6">
                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center h-20">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Members</span>
                        <span className="text-lg font-semibold text-card-foreground">{members.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active</span>
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {members.filter(m => m.isActive).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Admins</span>
                        <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          {members.filter(m => m.role === 'Admin' || m.role === 'Owner').length}
                        </span>
                      </div>
                      
                      {members.length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Recent Members</p>
                          <div className="flex -space-x-2">
                            {members.slice(0, 4).map((member, index) => (
                              <div key={member.id || index} className="relative">
                                {member.user?.profilePictureUrl ? (
                                  <img
                                    className="h-8 w-8 rounded-full border-2 border-card"
                                    src={member.user.profilePictureUrl}
                                    alt=""
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {member.user?.firstName?.charAt(0)}{member.user?.lastName?.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {members.length > 4 && (
                              <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                                <span className="text-xs font-medium text-muted-foreground">
                                  +{members.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-foreground">Organization Members</h3>
            <button
              onClick={() => setShowAddMember(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </button>
          </div>

          {isLoadingMembers ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-card shadow overflow-hidden sm:rounded-md border border-border">
              <ul className="divide-y divide-border">
                {members.map((member) => (
                  <li key={member.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {member.user?.profilePictureUrl ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={member.user.profilePictureUrl}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-sm font-medium text-muted-foreground">
                                {member.user?.firstName?.charAt(0)}{member.user?.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-card-foreground">
                              {member.user?.firstName} {member.user?.lastName}
                            </p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.isActive 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                            }`}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                          <div className="flex items-center mt-1">
                            <Shield className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">{member.role}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Joined {member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={member.role || ''}
                          onChange={(e) => member.id && handleUpdateRole(member.id, e.target.value)}
                          className="text-sm border-input rounded-md bg-background text-foreground"
                          disabled={updateRoleMutation.isPending}
                        >
                          <option value="Member">Member</option>
                          <option value="Admin">Admin</option>
                          <option value="Owner">Owner</option>
                        </select>
                        <button
                          onClick={() => member.id && handleRemoveMember(member.id)}
                          disabled={removeMemberMutation.isPending}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-card shadow rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-card-foreground mb-4">Organization Settings</h3>
          <p className="text-muted-foreground">Organization settings will be implemented here.</p>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        organizationId={organizationId}
      />
    </div>
  );
}
