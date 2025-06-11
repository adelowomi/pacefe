import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateCalendarEvent } from '../hooks/useCalendarEvents';
import type { CreateCalendarEventModel } from '@/api/models/CreateCalendarEventModel';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  calendarId: string;
  selectedDate?: Date;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  organizationId,
  calendarId,
  selectedDate,
}: CreateEventModalProps) {
  const [formData, setFormData] = useState<CreateCalendarEventModel>(() => {
    const now = selectedDate || new Date();
    const startTime = new Date(now);
    startTime.setMinutes(0, 0, 0); // Round to nearest hour
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // Default 1 hour duration

    return {
      title: '',
      description: '',
      startTime: startTime.toISOString().slice(0, 16), // Format for datetime-local input
      endTime: endTime.toISOString().slice(0, 16),
      isAllDay: false,
      location: '',
      recurrenceRule: '',
    };
  });

  const createEventMutation = useCreateCalendarEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      await createEventMutation.mutateAsync({
        organizationId,
        calendarId,
        data: eventData,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const resetForm = () => {
    const now = selectedDate || new Date();
    const startTime = new Date(now);
    startTime.setMinutes(0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    setFormData({
      title: '',
      description: '',
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
      isAllDay: false,
      location: '',
      recurrenceRule: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAllDay = e.target.checked;
    setFormData(prev => {
      if (isAllDay) {
        // Set to start and end of day
        const startDate = new Date(prev.startTime);
        const endDate = new Date(prev.endTime);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return {
          ...prev,
          isAllDay,
          startTime: startDate.toISOString().slice(0, 16),
          endTime: endDate.toISOString().slice(0, 16),
        };
      }
      return {
        ...prev,
        isAllDay,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-modal-backdrop">
      <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-border shadow-lg animate-modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground input-focus-animate"
              placeholder="Enter event title"
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
              placeholder="Enter event description (optional)"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAllDay"
              name="isAllDay"
              checked={formData.isAllDay}
              onChange={handleAllDayChange}
              className="h-4 w-4 text-primary focus:ring-ring border-input rounded bg-background"
            />
            <label htmlFor="isAllDay" className="ml-2 block text-sm text-foreground">
              All day event
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-foreground mb-1">
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-foreground mb-1">
                End Time *
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
              placeholder="Enter event location (optional)"
            />
          </div>

          <div>
            <label htmlFor="recurrenceRule" className="block text-sm font-medium text-foreground mb-1">
              Recurrence Rule
            </label>
            <input
              type="text"
              id="recurrenceRule"
              name="recurrenceRule"
              value={formData.recurrenceRule || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
              placeholder="e.g., FREQ=WEEKLY;BYDAY=MO,WE,FR (optional)"
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
              disabled={createEventMutation.isPending || !formData.title.trim()}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 rounded-md transition-colors"
            >
              {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
