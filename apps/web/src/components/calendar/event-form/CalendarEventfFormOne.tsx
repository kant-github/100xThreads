import InputBox from "@/components/utility/InputBox";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateEventFormSchema } from "./CalendarEventForm";


interface CalendarEventfFormOneProps {
    control: Control<CreateEventFormSchema>;
    errors: FieldErrors<CreateEventFormSchema>
}

export default function CalendarEventfFormOne({ control, errors }: CalendarEventfFormOneProps) {

    return (
        <>
            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <InputBox
                        label="Event title"
                        placeholder="choose event title"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.title?.message}
                    />
                )}
            />
            <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300">
                    Content
                </label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            {error && (<p className="mt-1 text-xs text-red-500"> {error?.message} </p>)}
                            <textarea
                                {...field}
                                className={`mt-2 px-3 py-2 placeholder:text-sm placeholder:text-neutral-400 w-full text-xs min-h-[120px] rounded-[6px] border dark:bg-neutral-900 dark:text-white focus:outline-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-neutral-600 focus:border-gray-300 focus:ring-1 focus:ring-gray-300'}`}
                                placeholder="Enter event description"
                            />
                        </>
                    )}
                />
            </div>
        </>
    )
}