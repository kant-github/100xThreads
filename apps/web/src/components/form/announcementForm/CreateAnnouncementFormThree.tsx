import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateAnnouncementFormSchemaType } from "./CreateAnnouncementForm";

interface CreateAnnouncementFormOneProps {
    control: Control<CreateAnnouncementFormSchemaType>;
    errors: FieldErrors<CreateAnnouncementFormSchemaType>;
}

export default function ({ errors, control }: CreateAnnouncementFormOneProps) {
    return (
        <>
            <Controller
                name="expires_at"
                control={control}
                render={({ field }) => {
                    return (
                        <div className="w-full">
                            <label htmlFor="date" className="block text-xs font-medium text-gray-700 dark:text-neutral-200 mb-1">
                                Due Date
                            </label>
                            <input id="date" type="date"
                                className="w-full px-3 py-2 border rounded-[8px] text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 outline-none select-none"
                                onChange={field.onChange}
                                value={field.value}
                            />
                            {errors.expires_at && (
                                <p className="text-red-500 text-xs mt-1">{errors.expires_at.message}</p>
                            )}
                        </div>
                    )
                }}
            />
            <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300">
                    Content
                </label>
                <Controller
                    name="content"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            {error && (<p className="mt-1 text-xs text-red-500"> {error?.message} </p>)}
                            <textarea
                                {...field}
                                className={`mt-2 px-3 py-2 placeholder:text-sm placeholder:text-neutral-400 w-full text-xs min-h-[120px] rounded-[6px] border dark:bg-neutral-900 dark:text-white focus:outline-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-neutral-600 focus:border-gray-300 focus:ring-1 focus:ring-gray-300'}`}
                                placeholder="Enter announcement content..."
                            />
                        </>
                    )}
                />
            </div>
        </>
    )
}