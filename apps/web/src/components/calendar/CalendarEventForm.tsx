import { Dispatch, SetStateAction } from "react";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import InputBox from "../utility/InputBox";
import { z } from "zod";

interface CalendarEventFormProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const createEventSchema = z.object({
    title: z.string().min(1, "Title is must"),
    description: z.string().min(1, "Description is must"),
    start_time: z.date(),
    end_time: z.date()
})

export default function ({ isOpen, setIsOpen }: CalendarEventFormProps) {

    return (
        <OpacityBackground onBackgroundClick={() => setIsOpen(false)}>
            <UtilityCard open={isOpen} setOpen={setIsOpen} className="w-4/12 px-12 relative py-5 dark:bg-neutral-900 dark:border-neutral-600 border-[1px]">
                <DashboardComponentHeading description="Add events to this particular date">
                    Add New Event
                </DashboardComponentHeading>
                <InputBox placeholder="choose event title" label="Title" />
            </UtilityCard>
        </OpacityBackground>
    )
}