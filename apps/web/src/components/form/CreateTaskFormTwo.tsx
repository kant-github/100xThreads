
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateTaskFormType } from "./CreateTaskForm";

interface CreateTaskFormTwoProps {
    control: Control<CreateTaskFormType>;
    errors: FieldErrors<CreateTaskFormType>;
}

export default function ({ control, errors }: CreateTaskFormTwoProps) {
    return (
        <>
            <div className="flex items-center justify-between gap-x-4">
                <div className="flex-1">
                    <label className="block text-xs my-1 font-medium text-gray-700 dark:text-neutral-300">
                        Priority
                    </label>
                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className="w-full rounded-[6px] px-2 text-sm dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-900 outline-none py-2.5" >
                                <option value="LOW">Low</option>
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        )}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs my-1 font-medium text-gray-700 dark:text-neutral-300">
                        Task status
                    </label>
                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className="w-full rounded-[6px] px-2 text-sm dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-900 outline-none py-2.5" >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        )}
                    />
                </div>
            </div>
            <Controller
                name="dueDate"
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
                            {errors.dueDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
                            )}
                        </div>
                    )
                }}
            />
        </>
    )
}