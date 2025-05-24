import React, { useState, useRef, useEffect } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateEventFormSchema } from "./CalendarEventForm";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CalendarEventfFormTwoProps {
    control: Control<CreateEventFormSchema>;
    errors: FieldErrors<CreateEventFormSchema>;
}

export default function CalendarEventfFormTwo({ control, errors }: CalendarEventfFormTwoProps) {
    const [openCalendar, setOpenCalendar] = useState<"start" | "end" | null>(null);
    const startRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

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
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openCalendar]);

    return (
        <div className="flex flex-col gap-4 relative">
            {/* Start Time */}
            <div ref={startRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Start Time
                </label>

                <Controller
                    name="start_time"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400",
                                    // "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                onClick={() =>
                                    setOpenCalendar(openCalendar === "start" ? null : "start")
                                }
                            >
                                {field.value ? (
                                    format(field.value, "PPP")
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
                                            field.onChange(date);
                                            setOpenCalendar(null);
                                        }}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </div>
                            )}
                        </>
                    )}
                />

                {errors.start_time && (
                    <p className="text-xs text-red-500 mt-1">{errors.start_time.message}</p>
                )}
            </div>

            {/* End Time */}
            <div ref={endRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    End Time
                </label>

                <Controller
                    name="end_time"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "px-4 py-[11px] text-xs font-medium border-[1px] border-zinc-400 dark:border-zinc-600 text-black shadow-sm focus:outline-none rounded-[8px] w-full pr-10 dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400",
                                    // "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                onClick={() =>
                                    setOpenCalendar(openCalendar === "end" ? null : "end")
                                }
                            >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>

                            {openCalendar === "end" && (
                                <div className="absolute z-50 mt-1 bg-white dark:bg-secDark border-[1px] dark:border-neutral-700 rounded-[8px] shadow-lg">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            field.onChange(date);
                                            setOpenCalendar(null);
                                        }}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </div>
                            )}
                        </>
                    )}
                />

                {errors.end_time && (
                    <p className="text-xs text-red-500 mt-1">{errors.end_time.message}</p>
                )}
            </div>
        </div>
    );
}
