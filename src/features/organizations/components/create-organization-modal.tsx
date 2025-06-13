import { useState } from 'react';
import { X, Building2, Globe, Mail, Phone } from 'lucide-react';
import { useCreateOrganization } from '../hooks/useCreateOrganization';
import type { OrganizationModel } from '../../../api/models/OrganizationModel';
import PhoneInput from '@/components/ui/phone-input';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (organizationId: string) => void;
}

export default function CreateOrganizationModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState<OrganizationModel>({
    name: '',
    description: '',
    logoUrl: null,
    websiteUrl: null,
    contactEmail: null,
    contactPhone: null,
    dateUpdated: null,
  });

  const createOrganizationMutation = useCreateOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }

    try {
      const response = await createOrganizationMutation.mutateAsync(formData);
      if (response.data?.id && onSuccess) {
        onSuccess(response.data.id);
      }
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        logoUrl: null,
        websiteUrl: null,
        contactEmail: null,
        contactPhone: null,
        dateUpdated: null,
      });
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleInputChange = (field: keyof OrganizationModel, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || null
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">Create Organization</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Organization Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter organization name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Describe your organization"
              required
            />
          </div>

          {/* Website URL */}
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-card-foreground mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Website URL
            </label>
            <input
              type="url"
              id="websiteUrl"
              value={formData.websiteUrl || ''}
              onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-card-foreground mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={formData.contactEmail || ''}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="contact@example.com"
            />
          </div>

          {/* Contact Phone */}
          <PhoneInput
            label="Contact Phone"
            value={formData.contactPhone}
            onChange={(value) => handleInputChange('contactPhone', value)}
            placeholder="Enter contact phone number"
            disabled={createOrganizationMutation.isPending}
          />

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-card-foreground mb-2">
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              value={formData.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createOrganizationMutation.isPending || !formData.name.trim() || !formData.description.trim()}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {createOrganizationMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  <span>Create Organization</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
