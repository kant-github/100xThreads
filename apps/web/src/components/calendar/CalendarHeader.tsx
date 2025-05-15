import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { format } from 'date-fns'
import { Dispatch, SetStateAction } from "react";
interface CalendarHeaderProps {
    previousMonthHandler: () => void;
    nextMonthHandler: () => void;
    firstDayCurrentMonth: Date;
    currentMonth: any;
    setIsAddModalOpen: Dispatch<SetStateAction<boolean>>
}

export default function ({ previousMonthHandler, nextMonthHandler, currentMonth, firstDayCurrentMonth, setIsAddModalOpen }: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    className="p-2 px-3 opacity-75 hover:opacity-100"
                    onClick={previousMonthHandler}
                >
                    <ChevronLeft className="w-4 h-4 text-neutral-100" />
                </Button>
                <Button
                    variant="ghost"
                    className="p-2 px-3 opacity-75 hover:opacity-100"
                    onClick={nextMonthHandler}
                >
                    <ChevronRight className="w-4 h-4 text-neutral-100" />
                </Button>
                <motion.h2
                    key={currentMonth}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold text-neutral-100"
                >
                    {format(firstDayCurrentMonth, "MMMM yyyy")}
                </motion.h2>
            </div>
            <Button className="text-neutral-900" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
            </Button>
        </div>
    )
}