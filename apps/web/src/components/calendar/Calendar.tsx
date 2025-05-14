'use client';

import { Calendar, dateFnsLocalizer, Event as RBCEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useState } from 'react';




const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 👇 Define your Event type
type MyEvent = {
  title: string;
  start: Date;
  end: Date;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<MyEvent[]>([
    {
      title: 'Kickoff Meeting',
      start: new Date(2025, 4, 15, 10, 0),
      end: new Date(2025, 4, 15, 11, 0),
    },
  ]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt('Enter event title');
    if (title) {
      setEvents((prev) => [...prev, { title, start, end }]);
    }
  };

  return (
    <main className="p-6">
      <div className="bg-neutral-900rounded-xl shadow p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event: RBCEvent) => alert(`Event: ${event.title}`)}
        />
      </div>
    </main>
  );
}
