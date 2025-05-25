import React, { useState, useRef, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CreateEventFormSchema } from "@/validations/createEventFormSchema";

interface CalendarEventfFormTwoProps {
    control: Control<CreateEventFormSchema>;
    errors: FieldErrors<CreateEventFormSchema>;
}

export default function CalendarEventfFormTwo({ control, errors }: CalendarEventfFormTwoProps) {
    const [openCalendar, setOpenCalendar] = useState<"start" | "end" | null>(null);
    const [openTimePicker, setOpenTimePicker] = useState<"start" | "end" | null>(null);
    const startRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<HTMLDivElement>(null);
    const endTimeRef = useRef<HTMLDivElement>(null);

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = format(new Date(2000, 0, 1, hour, minute), 'h:mm a');
                options.push({ value: timeString, display: displayTime });
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                openCalendar === "start" &&
                startRef.current &&
                !startRef.current.contains(event.target as Node)
            ) {
                setOpenCalendar(null);
            }
            if (
                openCalendar === "end" &&
                endRef.current &&
                !endRef.current.contains(event.target as Node)
            ) {
                setOpenCalendar(null);
            }
            if (
                openTimePicker === "start" &&
                startTimeRef.current &&
                !startTimeRef.current.contains(event.target as Node)
            ) {
                setOpenTimePicker(null);
            }
            if (
                openTimePicker === "end" &&
                endTimeRef.current &&
                !endTimeRef.current.contains(event.target as Node)
            ) {
                setOpenTimePicker(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openCalendar, openTimePicker]);

    const updateDateTime = (date: Date, time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours!, minutes, 0, 0);
        return newDate;
    };

    const getTimeFromDate = (date: Date) => {
        return format(date, 'HH:mm');
    };

    return (
        <div className="flex flex-col gap-4 relative">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Start Time
                </label>
                <div className="flex gap-2">
                    <div ref={startRef} className="relative flex-1">
                        <Controller
                            name="start_time"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        onClick={() =>
                                            setOpenCalendar(openCalendar === "start" ? null : "start")
                                        }
                                    >
                                        {field.value ? (
                                            format(field.value, "MMM dd, yyyy")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>

                                    {openCalendar === "start" && (
                                        <div className="absolute z-50 mt-1 bg-white dark:bg-secDark border-[1px] dark:border-neutral-700 rounded-[8px] shadow-lg">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const currentTime = field.value ? getTimeFromDate(field.value) : '09:00';
                                                        field.onChange(updateDateTime(date, currentTime));
                                                    }
                                                    setOpenCalendar(null);
                                                }}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                initialFocus
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    <div ref={startTimeRef} className="relative w-32">

                        <Controller
                            name="start_time"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-8 dark:bg-neutral-900 dark:text-gray-200",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        onClick={() =>
                                            setOpenTimePicker(openTimePicker === "start" ? null : "start")
                                        }
                                    >
                                        {field.value ? (
                                            format(field.value, "h:mm a")
                                        ) : (
                                            <span>Time</span>
                                        )}
                                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>

                                    {openTimePicker === "start" && (
                                        <div className="absolute z-50 mt-1 bg-white dark:bg-secDark border-[1px] dark:border-neutral-700 rounded-[8px] shadow-lg max-h-60 overflow-y-auto">
                                            {timeOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-200"
                                                    onClick={() => {
                                                        const currentDate = field.value || new Date();
                                                        field.onChange(updateDateTime(currentDate, option.value));
                                                        setOpenTimePicker(null);
                                                    }}
                                                >
                                                    {option.display}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>
                {errors.start_time && (
                    <p className="text-xs text-red-500">{errors.start_time.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    End Time
                </label>
                <div className="flex gap-2">
                    <div ref={endRef} className="relative flex-1">
                        <Controller
                            name="end_time"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        onClick={() =>
                                            setOpenCalendar(openCalendar === "end" ? null : "end")
                                        }
                                    >
                                        {field.value ? (
                                            format(field.value, "MMM dd, yyyy")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>

                                    {openCalendar === "end" && (
                                        <div className="absolute z-50 mt-1 bg-white dark:bg-secDark border-[1px] dark:border-neutral-700 rounded-[8px] shadow-lg">
                                            <Calendar
                                                mode="single"
                                                selected={field.value || undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const currentTime = field.value ? getTimeFromDate(field.value) : '10:00';
                                                        field.onChange(updateDateTime(date, currentTime));
                                                    }
                                                    setOpenCalendar(null);
                                                }}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                initialFocus
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Time Picker */}
                    <div ref={endTimeRef} className="relative w-32">
                        <Controller
                            name="end_time"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-8 dark:bg-neutral-900 dark:text-gray-200",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        onClick={() =>
                                            setOpenTimePicker(openTimePicker === "end" ? null : "end")
                                        }
                                    >
                                        {field.value ? (
                                            format(field.value, "h:mm a")
                                        ) : (
                                            <span>Time</span>
                                        )}
                                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>

                                    {openTimePicker === "end" && (
                                        <div className="absolute z-50 mt-1 bg-white dark:bg-secDark border-[1px] dark:border-neutral-700 rounded-[8px] shadow-lg max-h-60 overflow-y-auto">
                                            {timeOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-200"
                                                    onClick={() => {
                                                        const currentDate = field.value || new Date();
                                                        field.onChange(updateDateTime(currentDate, option.value));
                                                        setOpenTimePicker(null);
                                                    }}
                                                >
                                                    {option.display}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>
                {errors.end_time && (
                    <p className="text-xs text-red-500">{errors.end_time.message}</p>
                )}
            </div>
        </div>
    );
}