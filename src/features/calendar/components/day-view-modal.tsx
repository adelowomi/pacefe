import { X, Clock, MapPin, User, Calendar, Plus } from 'lucide-react';
import type { CalendarEventView } from '@/api/models/CalendarEventView';
import { getEventColor } from '@/lib/event-colors';

interface DayViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEventView[];
  onEventClick: (event: CalendarEventView) => void;
  onAddEvent?: (date: Date) => void;
}

export default function DayViewModal({ 
  isOpen, 
  onClose, 
  date, 
  events, 
  onEventClick,
  onAddEvent
}: DayViewModalProps) {
  if (!isOpen) return null;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateRange = (startTime: string, endTime?: string) => {
    const start = formatTime(startTime);
    if (!endTime) return start;
    const end = formatTime(endTime);
    return `${start} - ${end}`;
  };

  const sortedEvents = [...events].sort((a, b) => {
    // All-day events first
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    
    // Then sort by start time
    if (a.startTime && b.startTime) {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    
    return 0;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-modal-backdrop">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-border animate-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Events List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Events</h3>
              <p className="text-muted-foreground">No events scheduled for this day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event, index) => {
                const eventColor = getEventColor(event.id || `temp-${event.title}`);
                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-all duration-200 relative overflow-hidden animate-slide-in-up hover:shadow-md hover:scale-[1.01]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Colored left border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${eventColor.bg}`}></div>
                    
                    <div className="flex items-start justify-between ml-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-card-foreground">
                            {event.title}
                          </h3>
                          {/* Small color indicator */}
                          <div className={`w-3 h-3 rounded-full ${eventColor.bg} flex-shrink-0`}></div>
                        </div>
                        
                        {/* Time */}
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.isAllDay ? (
                            <span>All day</span>
                          ) : event.startTime ? (
                            <span>{formatDateRange(event.startTime, event.endTime)}</span>
                          ) : (
                            <span>No time specified</span>
                          )}
                        </div>

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {/* Description preview */}
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* Created by */}
                        {event.createdBy && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <User className="w-3 h-3 mr-1" />
                            <span>Created by {event.createdBy.firstName} {event.createdBy.lastName}</span>
                          </div>
                        )}
                      </div>

                      {/* Status indicator */}
                      {event.status && (
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${event.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                            event.status === 'tentative' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                            'bg-muted text-muted-foreground'}
                        `}>
                          {event.status}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {onAddEvent && (
          <div className="flex justify-between items-center p-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onAddEvent(date)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
