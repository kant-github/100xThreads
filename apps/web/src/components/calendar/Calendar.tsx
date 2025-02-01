import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = () => {
    const events = [
        {
            title: 'Sample Event',
            start: '2025-01-31',
            end: '2025-02-01',
            backgroundColor: '#6366f1',
            borderColor: '#6366f1',
            textColor: '#ffffff'
        }
    ];

    return (
        <div className="mt-4">
            <style>
                {`
          /* Overall calendar background */
          .fc {
            background-color: #171717 !important;
            overflow: hidden;
          }
          
          /* Calendar cell backgrounds */
          .fc td {
            background-color: #171717 !important;
          }
          
          /* Calendar grid borders */
          .fc td, .fc th {
            border: 1px solid #262626 !important;
          }
          .fc-scrollgrid {
            border: 1px solid #171717 !important;
          }
          .fc-header-toolbar {
            margin: 24px !important;
          }
          
          /* Weekend day styling */
          .fc .fc-day-sat, .fc .fc-day-sun {
            background-color: #262626 !important;
          }
          
          /* Today's cell styling */
          .fc .fc-day-today {
            background-color: #262626 !important;
          }
          
          /* Month/week name cells (header) */
          .fc th {
            background-color: #262626 !important;
            color: #e5e5e5 !important;
            padding: 8px !important;
          }
          
          /* Disabled/past dates in other months */
          .fc .fc-day-other {
            background-color: #171717 !important;
            opacity: 0.5;
          }
          
          /* Header toolbar styling */
          .fc-toolbar-title {
            color: #e5e5e5 !important;
          }
          
          /* Button styling */
          .fc .fc-button-primary {
            background-color: #404040 !important;
            border-color: #404040 !important;
            color: #e5e5e5 !important;
          }
          .fc .fc-button-primary:hover {
            background-color: #525252 !important;
            border-color: #525252 !important;
          }
          
          /* Date text color */
          .fc-daygrid-day-number {
            color: #e5e5e5 !important;
          }
          
          /* Event styling */
          .fc-event {
            background-color: #6366f1 !important;
            border-color: #6366f1 !important;
            color: #ffffff !important;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .fc-header-toolbar {
              flex-direction: column;
              gap: 1rem;
            }
            .fc-toolbar-title {
              font-size: 1.2rem !important;
            }
          }
        `}
            </style>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
                height="auto"
            />
        </div>
    );
};

export default Calendar;