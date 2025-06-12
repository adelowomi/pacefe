import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateCalendar } from '../hooks/useCalendar';
import type { CreateCalendarModel } from '@/api/models/CreateCalendarModel';

interface CreateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  currentUserId: string;
  onCalendarCreated?: (calendarId: string) => void;
}

export default function CreateCalendarModal({
  isOpen,
  onClose,
  organizationId,
  currentUserId,
  onCalendarCreated,
}: CreateCalendarModalProps) {
  const [formData, setFormData] = useState<CreateCalendarModel>({
    name: '',
    description: '',
    organizationId,
    ownerUserId: currentUserId,
  });

  const createCalendarMutation = useCreateCalendar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await createCalendarMutation.mutateAsync({
        organizationId,
        data: formData,
      });
      
      // Call the callback with the created calendar ID
      if (onCalendarCreated && response.data?.id) {
        onCalendarCreated(response.data.id);
      }
      
      onClose();
      setFormData({
        name: '',
        description: '',
        organizationId,
        ownerUserId: currentUserId,
      });
    } catch (error) {
      console.error('Failed to create calendar:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-modal-backdrop">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg animate-modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Create New Calendar</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Calendar Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
              placeholder="Enter calendar name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
              placeholder="Enter calendar description (optional)"
            />
          </div>

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
              disabled={createCalendarMutation.isPending || !formData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 rounded-md transition-colors"
            >
              {createCalendarMutation.isPending ? 'Creating...' : 'Create Calendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
