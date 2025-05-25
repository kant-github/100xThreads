import { CreateEventFormSchema } from "@/validations/createEventFormSchema"
import { Control, FieldErrors } from "react-hook-form"

interface CalendarEventfFormTwoProps {
    control: Control<CreateEventFormSchema>;
    errors: FieldErrors<CreateEventFormSchema>;
}

export default function CalendarEventfFormThree({ control, errors }: CalendarEventfFormTwoProps) {
    return (
        <>
            
        </>
    )
}