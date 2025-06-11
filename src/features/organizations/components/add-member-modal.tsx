import { useState } from 'react';
import { X, UserPlus, Mail, Shield, User, Calendar, Image, FileText } from 'lucide-react';
import { useAddOrganizationMember } from '../hooks/useOrganizationMembers';
import type { OrganizationMemberModel } from '../../../api/models/OrganizationMemberModel';
import ImageUpload from '@/components/ui/image-upload';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export default function AddMemberModal({ isOpen, onClose, organizationId }: AddMemberModalProps) {
  const [formData, setFormData] = useState<OrganizationMemberModel>({
    organizationId,
    email: '',
    role: 'Member',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    profilePictureUrl: '',
    bio: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const addMemberMutation = useAddOrganizationMember();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await addMemberMutation.mutateAsync({
        ...formData,
        organizationId,
        // Remove empty optional fields
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        dateOfBirth: formData.dateOfBirth || null,
        profilePictureUrl: formData.profilePictureUrl || null,
        bio: formData.bio || null,
        password: formData.password || null
      });
      
      // Reset form and close modal
      setFormData({
        organizationId,
        email: '',
        role: 'Member',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        profilePictureUrl: '',
        bio: '',
        password: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to add member:', error);
      setErrors({ submit: 'Failed to add member. Please try again.' });
    }
  };

  const handleInputChange = (field: keyof OrganizationMemberModel, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-card border border-border rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-card-foreground">
                      Add Organization Member
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Invite a new member to join your organization
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                {/* Email (Required) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                      errors.email ? 'border-red-500' : 'border-input'
                    }`}
                    placeholder="member@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Role (Required) */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Role *
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.role ? 'border-red-500' : 'border-input'
                    }`}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                    <option value="Owner">Owner</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="Doe"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-input'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Profile Picture */}
                <div>
                  <ImageUpload
                    value={formData.profilePictureUrl || null}
                    onChange={(url) => handleInputChange('profilePictureUrl', url || '')}
                    label="Profile Picture"
                    placeholder="Click to upload member's profile picture"
                    error={errors.profilePictureUrl}
                    disabled={addMemberMutation.isPending}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="Brief description about the member..."
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                    placeholder="Leave empty to send invitation"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Leave empty to send an invitation email instead
                  </p>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                    {errors.submit}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={addMemberMutation.isPending}
                className="w-full inline-flex justify-center rounded-md px-4 py-2 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                {addMemberMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={addMemberMutation.isPending}
                className="mt-3 w-full inline-flex justify-center rounded-md px-4 py-2 text-base font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
