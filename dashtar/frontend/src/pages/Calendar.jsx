import {
    Card,
    CardBody,
    Button,
} from "@windmill/react-ui";
import { useState, useEffect, useContext } from "react";
import PageTitle from "@/components/Typography/PageTitle";
import { useTranslation } from "react-i18next";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { notifyError } from "@/utils/toast";

//internal import
import AnimatedContent from "@/components/common/AnimatedContent";
import EventServices from "@/services/EventServices";
import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import useFilter from "@/hooks/useFilter";
import EventTable from "@/components/event/EventTable";

const Calendar = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('calendar');

  const { data, loading } = useAsync(() =>
    EventServices.getAllEvents({
      name: "",
      page: "",
      limit: "",
    })
  );
  const { dataTable } = useFilter(data?.events);
  
  const calendarEvents = dataTable?.map(event => ({
    id: event._id,
    title: event.name,
    start: event.startTime,
    description: event.description,
    location: event?.venue?.address,
    allDay: false
  })) || [];

  const renderCalendarView = () => (
    <div className="calendar-container dark:text-white h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: '',
          center: 'prev title next',
          right: ''
        }}
        height="auto"
        events={calendarEvents}
        editable={false}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        eventDisplay="block"
        dayMaxEventRows={2}
        aspectRatio={1.35}
        displayEventEnd={false}
        nextDayThreshold="00:00:00"
        eventContent={({ event }) => (
          <div className="event-content">
            <div className="event-title">{event.title}</div>
          </div>
        )}
      />
    </div>
  );

  const renderListView = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    // Group events by date using dataTable
    const groupedEvents = dataTable?.reduce((groups, event) => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
      
      // Check if the event date is today
      const isToday = eventDate.getTime() === today.getTime();
      
      const date = isToday ? 'Today' : eventDate.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {}) || {};

    return (
      <div className="w-full overflow-hidden rounded-lg">
        <div className="space-y-6">
          {Object.entries(groupedEvents)
            // Sort by closest date to today
            .sort(([dateA], [dateB]) => {
              if (dateA === 'Today') return -1;
              if (dateB === 'Today') return 1;

              const dateAObj = new Date(dateA);
              const dateBObj = new Date(dateB);
              
              // Calculate difference from today in milliseconds
              const diffA = Math.abs(dateAObj.getTime() - today.getTime());
              const diffB = Math.abs(dateBObj.getTime() - today.getTime());
              
              // Sort by closest date to today
              return diffA - diffB;
            })
            .map(([date, events]) => (
              <div 
                key={date} 
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4">
                  <h2 className={`text-xl font-bold ${
                    date === 'Today' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {date}
                  </h2>
                </div>
                <div className="space-y-4">
                  {events
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    .map((event) => (
                      <div key={event._id} className="pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-32 text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(event.startTime).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                              {' - '}
                              {new Date(event.endTime).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </div>
                          </div>
                          <div className="ml-4 flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {event.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {event.description}
                            </p>
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {event.venue?.address && (
                                <div className="mt-1">
                                  <span className="font-medium">Location:</span> {event.venue.address}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <div className="flex-none">
          <PageTitle>{t(" My Calendar")}</PageTitle>
        </div>
        <div className="flex-grow flex justify-center">
          <div className="flex space-x-4">
            <Button 
              onClick={() => setView('calendar')}
              className={`px-6 ${view === 'calendar' ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              Calendar View
            </Button>
            <Button 
              onClick={() => setView('list')}
              className={`px-6 ${view === 'list' ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              List View
            </Button>
          </div>
        </div>
        <div className="flex-none w-[200px]"></div>
      </div>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            {view === 'calendar' ? renderCalendarView() : renderListView()}
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Calendar;
