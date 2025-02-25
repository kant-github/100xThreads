import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateTaskFormType } from "./CreateTaskForm";
import { KeyboardEvent, useState } from "react";
import ErrorMessage from "@/components/utility/ErrorMessage";
import { X } from "lucide-react";

interface CreateTaskFormTwoProps {
    control: Control<CreateTaskFormType>;
    errors: FieldErrors<CreateTaskFormType>;
}

export default function ({ control, errors }: CreateTaskFormTwoProps) {
    const [tagInput, setTagInput] = useState<string>("");

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, value: string[], onChange: (value: string[]) => void) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();

            if (newTag && !value.includes(newTag)) {
                onChange([...value, newTag]);
                setTagInput("");
            }
        } else if (e.key === 'Backspace' && !tagInput && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

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
                        name="status"
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
                render={({ field }) => (
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
                }
            />
            <div className="relative">
                <ErrorMessage error={errors?.tags?.message} />
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-4">
                    Add Organization Tags
                </label>
                <Controller
                    name="tags"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value = [] } }) => (
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-[8px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900">
                                {value.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500"
                                    >
                                        {tag}
                                        <button
                                            aria-label="Close"
                                            type="button"
                                            onClick={() => onChange(value.filter((t: string) => t !== tag))}
                                            className="hover:text-yellow-900 dark:hover:text-yellow-400"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, value, onChange)}
                                    placeholder={value.length === 0 ? "Type tags and press Enter..." : "Add more tags..."}
                                    className="flex-1 min-w-[120px] outline-none bg-transparent text-sm placeholder:text-[12px]"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Press Enter or comma to add tags. Tags should be relevant to your organization's focus areas.
                            </p>
                        </div>
                    )}
                />
            </div>
        </>
    )
}