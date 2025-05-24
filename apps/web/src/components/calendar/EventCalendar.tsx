"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import CalendarHeader from "./CalendarHeader";
import { add, eachDayOfInterval, endOfMonth, format, isEqual, isSameMonth, isToday, parse, startOfMonth, startOfWeek, endOfWeek, } from "date-fns";
import UtilityCard from "../utility/UtilityCard";
import CalendarEventForm from "./event-form/CalendarEventForm";
import { EventChannelType } from "types/types";

interface Subscription {
  id: string;
  name: string;
  date: number;
  icon: string;
  color: string;
}
interface SubscriptionDay {
  date: Date;
  subscriptions: Subscription[];
  isCurrentMonth: boolean;
}

interface CalendarProps {
  className?: string;
  channel: EventChannelType;
}
export default function ({ className, channel }: CalendarProps) {
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MMM-yyyy")
  );

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(firstDayCurrentMonth));
    const end = endOfWeek(endOfMonth(firstDayCurrentMonth));
    return eachDayOfInterval({ start, end }).map(
      (day): SubscriptionDay => ({
        date: day,
        subscriptions: subscriptions.filter(
          (subscription) => subscription.date === day.getDate()
        ),
        isCurrentMonth: isSameMonth(day, firstDayCurrentMonth),
      })
    );
  }, [firstDayCurrentMonth, subscriptions]);


  function previousMonthHandler() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonthHandler() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function handleAddSubscription(newSubscription: Omit<Subscription, "id">) {
    const subscription = { ...newSubscription, id: Date.now().toString() };
    setSubscriptions([...subscriptions, subscription]);
  };

  function handleRemoveSubscription(id: string) {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  function tapOnDateHandler(date: any) {
    console.log(date);
  }

  return (
    <UtilityCard className={`p-4 mx-auto max-w-xl bg-secDark border-[1px] dark:border-neutral-700 rounded-[12px] ${className}`}>
      <CalendarHeader previousMonthHandler={previousMonthHandler} nextMonthHandler={nextMonthHandler} firstDayCurrentMonth={firstDayCurrentMonth} currentMonth={currentMonth} setIsAddModalOpen={setIsAddModalOpen} />
      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs font-light tracking-wider bg-background text-neutral-100 mt-4"
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
              onClick={() => setIsAddModalOpen(true)}
              className={cn(
                "relative min-h-[65px] flex items-center justify-center cursor-pointer rounded-[10px]",
                !day.isCurrentMonth && "bg-muted/50",
                isToday(day.date) && "font-semibold bg-[#ff4a4a] text-neutral-900",
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

              {day.subscriptions.length > 0 && (
                <div className="mt-1 flex items-center justify-center absolute right-1.5 bottom-1.5">
                  <span
                    className="bg-red-500 text-white text-[4px] font-medium px-[5px] rounded-full"
                  >
                    {day.subscriptions.length}
                  </span>
                </div>
              )}

            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {
        isAddModalOpen && (
          <CalendarEventForm channel={channel} isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
        )
      }
    </UtilityCard>
  );
}

