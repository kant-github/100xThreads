"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import CalendarHeader from "./CalendarHeader";
import { add, eachDayOfInterval, endOfMonth, format, isEqual, isSameMonth, isToday, parse, startOfMonth, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import UtilityCard from "../utility/UtilityCard";
import CalendarEventForm from "./event-form/CalendarEventForm";
import { EventChannelType, EventType } from "types/types";
import { useAbility } from "@/rbac/abilityContext";
import { Action, Subject } from "types/permission";
import { myEventsAtom } from "@/recoil/atoms/events/myEventsAtom";
import { useRecoilState } from "recoil";
import { eventsForChannel } from "@/recoil/atoms/events/eventsForChannel";

interface CalendarDay {
  date: Date;
  events: EventType[];
  isCurrentMonth: boolean;
}

interface CalendarProps {
  className?: string;
  channel: EventChannelType;
}

export default function ({ className, channel }: CalendarProps) {
  const [myEvents, setMyEvents] = useRecoilState(eventsForChannel);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const ability = useAbility();
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MMM-yyyy")
  );

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(firstDayCurrentMonth));
    const end = endOfWeek(endOfMonth(firstDayCurrentMonth));

    return eachDayOfInterval({ start, end }).map(
      (day): CalendarDay => {
        // Filter events for this specific day
        const dayEvents = myEvents.filter((event) => {
          const eventDate = new Date(event.start_time);
          return isSameDay(eventDate, day);
        });

        return {
          date: day,
          events: dayEvents,
          isCurrentMonth: isSameMonth(day, firstDayCurrentMonth),
        };
      }
    );
  }, [firstDayCurrentMonth, myEvents]);

  function previousMonthHandler() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonthHandler() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function tapOnDateHandler(date: Date) {
    if (ability.can(Action.CREATE, Subject.EVENT)) {
      setSelectedDate(date);
      setIsAddModalOpen(true);
    }
  }

  return (
    <UtilityCard className={`p-4 mx-auto max-w-xl bg-secDark border-[1px] dark:border-neutral-700 rounded-[6px] ${className}`}>
      <CalendarHeader
        previousMonthHandler={previousMonthHandler}
        nextMonthHandler={nextMonthHandler}
        firstDayCurrentMonth={firstDayCurrentMonth}
        currentMonth={currentMonth}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs font-light tracking-wider bg-background text-neutral-100 my-4"
            >
              {day}
            </motion.div>
          ))}
          {days.map((day, dayIdx) => (
            <motion.div
              key={format(day.date, "yyyy-MM-dd")}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: dayIdx * 0.01 }}
              onClick={() => tapOnDateHandler(day.date)}
              className={cn(
                "relative min-h-[65px] flex items-center justify-center cursor-pointer rounded-[10px]",
                !day.isCurrentMonth && "bg-muted/50",
                isToday(day.date) && "font-semibold bg-[#f54242] text-neutral-900",
                isEqual(day.date, new Date()) && "bg-accent"
              )}
            >
              <time
                dateTime={format(day.date, "yyyy-MM-dd")}
                className={cn(
                  "text-xs font-normal text-neutral-200",
                  isToday(day.date) && "font-semibold text-neutral-900",
                  !day.isCurrentMonth && "text-neutral-500"
                )}
              >
                {format(day.date, "d")}
              </time>

              {day.events.length > 0 && (
                <div className="mt-1 flex items-center justify-center absolute right-2.5 bottom-2.5">
                  <span className="bg-amber-500 text-[2px] font-medium rounded-full min-w-[14px] flex items-center justify-center text-neutral-800">
                    {day.events.length}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {isAddModalOpen && (
        <CalendarEventForm
          isEditMode={false}
          channelId={channel.id}
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          selectedDate={selectedDate!}
        />
      )}
    </UtilityCard>
  );
}