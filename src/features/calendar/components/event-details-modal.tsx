import { X, Clock, MapPin, User, Calendar, FileText, Repeat, Tag } from 'lucide-react';
import type { CalendarEventView } from '@/api/models/CalendarEventView';
import { getEventColor } from '@/lib/event-colors';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventView | null;
}

export default function EventDetailsModal({ 
  isOpen, 
  onClose, 
  event 
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  const eventColor = getEventColor(event.id || `temp-${event.title}`);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: formatDate(dateString),
      time: formatTime(dateString),
    };
  };

  const getEventDuration = () => {
    if (!event.startTime || !event.endTime) return null;
    
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const diffMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} minutes`;
  };

  const isSameDay = event.startTime && event.endTime && 
    new Date(event.startTime).toDateString() === new Date(event.endTime).toDateString();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="relative">
          {/* Colorful header background */}
          <div className={`${eventColor.bg} p-6 relative`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full bg-white/30 flex-shrink-0`}></div>
                  <h2 className={`text-xl font-semibold pr-4 ${eventColor.text}`}>
                    {event.title}
                  </h2>
                </div>
                {event.status && (
                  <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                    <Tag className="w-3 h-3 mr-1" />
                    {event.status}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 hover:bg-white/20 rounded-md transition-colors ${eventColor.text}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium text-card-foreground mb-1">Date & Time</h3>
                {event.isAllDay ? (
                  <div>
                    <p className="text-muted-foreground">All day</p>
                    {event.startTime && (
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.startTime)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {event.startTime && (
                      <div>
                        <p className="text-muted-foreground">
                          <span className="font-medium">Start:</span> {formatDateTime(event.startTime).date}
                        </p>
                        <p className="text-sm text-muted-foreground ml-12">
                          {formatDateTime(event.startTime).time}
                        </p>
                      </div>
                    )}
                    {event.endTime && (
                      <div>
                        <p className="text-muted-foreground">
                          <span className="font-medium">End:</span> {isSameDay ? formatTime(event.endTime) : formatDateTime(event.endTime).date}
                        </p>
                        {!isSameDay && (
                          <p className="text-sm text-muted-foreground ml-12">
                            {formatDateTime(event.endTime).time}
                          </p>
                        )}
                      </div>
                    )}
                    {getEventDuration() && (
                      <p className="text-sm text-muted-foreground">
                        Duration: {getEventDuration()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-1">Location</h3>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-1">Description</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>
              </div>
            )}

            {/* Recurrence */}
            {event.recurrenceRule && (
              <div className="flex items-start space-x-3">
                <Repeat className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-1">Recurrence</h3>
                  <p className="text-muted-foreground">{event.recurrenceRule}</p>
                </div>
              </div>
            )}

            {/* Created By */}
            {event.createdBy && (
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-1">Created By</h3>
                  <p className="text-muted-foreground">
                    {event.createdBy.firstName} {event.createdBy.lastName}
                  </p>
                  {event.createdBy.email && (
                    <p className="text-sm text-muted-foreground">{event.createdBy.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Event Metadata */}
            <div className="border-t border-border pt-6">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Event Details</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {event.id && (
                      <p><span className="font-medium">Event ID:</span> {event.id}</p>
                    )}
                    {event.dateCreated && (
                      <p>
                        <span className="font-medium">Created:</span> {' '}
                        {new Date(event.dateCreated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                    {event.dateUpdated && (
                      <p>
                        <span className="font-medium">Last Updated:</span> {' '}
                        {new Date(event.dateUpdated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Status:</span> {' '}
                      {event.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
