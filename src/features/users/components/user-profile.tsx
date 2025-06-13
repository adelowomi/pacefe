import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar,
  Edit,
  Save,
  X,
  Image,
  FileText,
  Shield,
  Key,
  Settings,
  Phone
} from 'lucide-react';
import { useUserProfile, useUpdateUserProfile } from '../hooks/useUser';
import ForgotPasswordModal from './forgot-password-modal';
import type { UpdateUserProfileModel } from '@/api/models/UpdateUserProfileModel';
import ChangePasswordModal from './change-password-modal';
import ImageUpload from '@/components/ui/image-upload';
import PhoneInput from '@/components/ui/phone-input';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<UpdateUserProfileModel>({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    profilePictureUrl: null,
    bio: null,
    phoneNumber: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: userProfileData, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const userProfile = userProfileData?.data;

  // Initialize form data when user profile loads
  useEffect(() => {
    if (userProfile && !isEditing) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        dateOfBirth: userProfile.dateOfBirth || null,
        profilePictureUrl: userProfile.profilePictureUrl || null,
        bio: userProfile.bio || null,
        phoneNumber: userProfile.phoneNumber || null,
      });
    }
  }, [userProfile, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        dateOfBirth: userProfile.dateOfBirth || null,
        profilePictureUrl: userProfile.profilePictureUrl || null,
        bio: userProfile.bio || null,
        phoneNumber: userProfile.phoneNumber || null,
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        dateOfBirth: userProfile.dateOfBirth || null,
        profilePictureUrl: userProfile.profilePictureUrl || null,
        bio: userProfile.bio || null,
        phoneNumber: userProfile.phoneNumber || null,
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    }
  };

  const handleInputChange = (field: keyof UpdateUserProfileModel, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getUserInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    }
    if (userProfile?.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">Profile not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Unable to load your profile information.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {userProfile.profilePictureUrl ? (
              <img
                src={userProfile.profilePictureUrl}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium text-primary">
                  {getUserInitials()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">{userProfile.email}</p>
              {userProfile.isActive !== undefined && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  userProfile.isActive 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {userProfile.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
          </div>
          {!isEditing && (
            <button 
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Settings },
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
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-card shadow-sm rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-card-foreground">Profile Information</h3>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                      className="inline-flex items-center px-3 py-1.5 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    First Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-input'
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-card-foreground font-medium">
                      {userProfile.firstName || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Last Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-input'
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-card-foreground font-medium">
                      {userProfile.lastName || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <p className="text-sm text-card-foreground font-medium">
                    {userProfile.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed from this page
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  {isEditing ? (
                    <PhoneInput
                      label="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(value) => handleInputChange('phoneNumber', value || null)}
                      placeholder="Enter phone number"
                      error={errors.phoneNumber}
                      disabled={updateProfileMutation.isPending}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number
                      </label>
                      <p className="text-sm text-card-foreground font-medium">
                        {userProfile.phoneNumber || 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value || null)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                          errors.dateOfBirth ? 'border-red-500' : 'border-input'
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-card-foreground font-medium">
                      {userProfile.dateOfBirth 
                        ? new Date(userProfile.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not provided'
                      }
                    </p>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="sm:col-span-2">
                  {isEditing ? (
                    <ImageUpload
                      value={formData.profilePictureUrl}
                      onChange={(url) => handleInputChange('profilePictureUrl', url)}
                      label="Profile Picture"
                      placeholder="Click to upload your profile picture"
                      error={errors.profilePictureUrl}
                      disabled={updateProfileMutation.isPending}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Image className="h-4 w-4 inline mr-1" />
                        Profile Picture
                      </label>
                      {userProfile.profilePictureUrl ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={userProfile.profilePictureUrl}
                            alt="Profile"
                            className="h-16 w-16 rounded-lg object-cover border border-border"
                          />
                          <p className="text-sm text-card-foreground font-medium">
                            Profile picture uploaded
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-card-foreground font-medium">
                          No profile picture uploaded
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value || null)}
                      className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm text-card-foreground">
                      {userProfile.bio || 'No bio provided'}
                    </p>
                  )}
                </div>

                {/* Last Updated */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Updated
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.dateUpdated 
                      ? new Date(userProfile.dateUpdated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never updated'
                    }
                  </p>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mt-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                  {errors.submit}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-card shadow-sm rounded-lg border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-card-foreground">Security Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-card-foreground">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="inline-flex items-center px-3 py-2 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground"
                >
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-card-foreground">Password Reset</h4>
                    <p className="text-sm text-muted-foreground">
                      Send a password reset link to your email
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="inline-flex items-center px-3 py-2 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-card shadow-sm rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-card-foreground">Account Settings</h3>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground">Additional account settings will be implemented here.</p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
