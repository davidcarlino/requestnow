import {
    Card,
    CardBody,
    Button,
} from "@windmill/react-ui";
import { useState, useEffect, useContext, useRef } from "react";
import PageTitle from "@/components/Typography/PageTitle";
import { useTranslation } from "react-i18next";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { notifyError } from "@/utils/toast";
import { Link } from 'react-router-dom';

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
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(currentDate.getFullYear(), newMonth, 1);
    setCurrentDate(newDate);
    calendarRef.current.getApi().gotoDate(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(newYear, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    calendarRef.current.getApi().gotoDate(newDate);
  };

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    window.location.href = `/event/${eventId}/dashboard`;
  };

  const renderCalendarView = () => (
    <div className="calendar-container dark:text-white h-full relative">
      <div className="absolute top-0.5 right-1 z-10 flex space-x-3">
        <select
          className="px-4 py-2 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 min-w-[140px]"
          value={currentDate.getMonth()}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 text-base rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 min-w-[100px]"
          value={currentDate.getFullYear()}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={currentDate}
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
        eventClick={handleEventClick}
        eventContent={({ event }) => (
          <div className="event-content cursor-pointer hover:opacity-80">
            <div className="event-title">{event.title}</div>
          </div>
        )}
        datesSet={(dateInfo) => {
          const newDate = new Date(dateInfo.view.currentStart);
          setCurrentDate(newDate);
        }}
      />
    </div>
  );

  const renderListView = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groupedEvents = dataTable?.reduce((groups, event) => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0);
      
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
            .sort(([dateA], [dateB]) => {
              if (dateA === 'Today') return -1;
              if (dateB === 'Today') return 1;

              const dateAObj = new Date(dateA);
              const dateBObj = new Date(dateB);
              
              const diffA = Math.abs(dateAObj.getTime() - today.getTime());
              const diffB = Math.abs(dateBObj.getTime() - today.getTime());
              
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
                      <Link 
                        key={event._id} 
                        to={`/event/${event._id}/dashboard`}
                        className="block pl-4 border-l-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 rounded-r-lg"
                      >
                        <div className="flex items-start p-2">
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
                            {event.venue?.address && (
                              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Location:</span> {event.venue.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
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
