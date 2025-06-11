import { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Upload
} from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import CreateCalendarModal from './create-calendar-modal';
import CreateEventModal from './create-event-modal';
import DayViewModal from './day-view-modal';
import EventDetailsModal from './event-details-modal';
import type { CalendarEventView } from '@/api/models/CalendarEventView';
import ImportIcsModal from './import-ics-modal';
import { getEventColor } from '@/lib/event-colors';

interface CalendarProps {
  organizationId: string;
  calendarId: string;
  currentUserId: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEventView[];
}

export default function Calendar({ organizationId, calendarId, currentUserId }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateCalendarModal, setShowCreateCalendarModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDayViewModal, setShowDayViewModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEventView[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventView | null>(null);

  // Get calendar details
  const { data: calendarResponse, isLoading: isLoadingCalendar } = useCalendar(organizationId, calendarId);
  const calendar = calendarResponse?.data;

  // Get calendar events for the current month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const { data: eventsResponse } = useCalendarEvents(
    organizationId,
    calendarId,
    startOfMonth.toISOString(),
    endOfMonth.toISOString()
  );
  const events = eventsResponse?.data || [];

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(event => {
        if (!event.startTime) return false;
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: dayEvents,
      });
    }
    
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
    
    return days;
  }, [currentDate, events]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDayClick = (day: CalendarDay, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    // If the day has events, show the day view modal
    if (day.events.length > 0) {
      setSelectedDate(day.date);
      setSelectedDayEvents(day.events);
      setShowDayViewModal(true);
    } else {
      // If no events, show create event modal
      setSelectedDate(day.date);
      setShowCreateEventModal(true);
    }
  };

  const handleEventClick = (event: CalendarEventView, clickEvent?: React.MouseEvent) => {
    if (clickEvent) {
      clickEvent.stopPropagation();
    }
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  const handleDayViewEventClick = (event: CalendarEventView) => {
    setShowDayViewModal(false);
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  const handleCreateEventFromDay = (date: Date) => {
    setShowDayViewModal(false);
    setSelectedDate(date);
    setShowCreateEventModal(true);
  };

  if (isLoadingCalendar) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Calendar Selected</h3>
        <p className="text-muted-foreground mb-4">Create a new calendar to get started.</p>
        <button
          onClick={() => setShowCreateCalendarModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow border border-border animate-fade-in-up">
      {/* Header */}
      <div className="p-6 border-b border-border animate-slide-in-down">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">{calendar.name}</h1>
            {calendar.description && (
              <p className="text-muted-foreground mt-1">{calendar.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import ICS
            </button>
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-card-foreground">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const staggerClass = `calendar-day-stagger-${(index % 7) + 1}`;
            return (
              <div
                key={index}
                onClick={() => day.isCurrentMonth && handleDayClick(day)}
                className={`
                  min-h-[100px] p-2 border border-border cursor-pointer transition-all duration-200 hover:shadow-sm
                  ${!day.isCurrentMonth ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 'bg-card hover:bg-accent/50'}
                  ${day.isToday ? 'bg-primary/10 border-primary/30 animate-pulse-subtle' : ''}
                  animate-scale-in ${staggerClass}
                `}
              >
                <div className={`
                  text-sm font-medium mb-1 transition-colors duration-200
                  ${day.isToday ? 'text-primary' : day.isCurrentMonth ? 'text-card-foreground' : 'text-muted-foreground'}
                `}>
                  {day.date.getDate()}
                </div>
                
                {/* Events */}
                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event, eventIndex) => {
                    const eventColor = getEventColor(event.id || `temp-${eventIndex}`);
                    return (
                      <div
                        key={eventIndex}
                        onClick={(e) => handleEventClick(event, e)}
                        className={`text-xs p-1 rounded truncate cursor-pointer event-item-animate font-medium shadow-sm transition-all duration-200 ${eventColor.bg} ${eventColor.text} hover:opacity-90 hover:shadow-md hover:scale-[1.02]`}
                        title={`${event.title} ${event.startTime ? `- ${formatTime(event.startTime)}` : ''}`}
                        style={{ animationDelay: `${0.1 + eventIndex * 0.05}s` }}
                      >
                        {event.isAllDay ? event.title : `${formatTime(event.startTime!)} ${event.title}`}
                      </div>
                    );
                  })}
                  {day.events.length > 3 && (
                    <div 
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer font-medium transition-all duration-200 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(day.date);
                        setSelectedDayEvents(day.events);
                        setShowDayViewModal(true);
                      }}
                    >
                      +{day.events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateCalendarModal
        isOpen={showCreateCalendarModal}
        onClose={() => setShowCreateCalendarModal(false)}
        organizationId={organizationId}
        currentUserId={currentUserId}
      />

      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => {
          setShowCreateEventModal(false);
          setSelectedDate(null);
        }}
        organizationId={organizationId}
        calendarId={calendarId}
        selectedDate={selectedDate || undefined}
      />

      <ImportIcsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        organizationId={organizationId}
        calendarId={calendarId}
      />

      <DayViewModal
        isOpen={showDayViewModal}
        onClose={() => {
          setShowDayViewModal(false);
          setSelectedDate(null);
          setSelectedDayEvents([]);
        }}
        date={selectedDate || new Date()}
        events={selectedDayEvents}
        onEventClick={handleDayViewEventClick}
        onAddEvent={handleCreateEventFromDay}
      />

      <EventDetailsModal
        isOpen={showEventDetailsModal}
        onClose={() => {
          setShowEventDetailsModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
}
