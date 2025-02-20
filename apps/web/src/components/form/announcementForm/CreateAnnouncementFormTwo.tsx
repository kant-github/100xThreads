import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateAnnouncementFormSchemaType } from "./CreateAnnouncementForm";
import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

interface CreateAnnouncementFormOneProps {
    control: Control<CreateAnnouncementFormSchemaType>;
    errors: FieldErrors<CreateAnnouncementFormSchemaType>;
}

export default function ({ errors, control }: CreateAnnouncementFormOneProps) {
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
            <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300">
                    Add tags
                </label>
                <Controller
                    name="tags"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { onChange, value = [] } }) => (
                        <div className="space-y-3 mt-2">
                            <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-[6px] border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
                                {value.map((tag: string) => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500">
                                        {tag}
                                        <button aria-label="Close" type="button" onClick={() => onChange(value.filter((t: string) => t !== tag))} className="hover:text-yellow-900 dark:hover:text-yellow-400" >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, value, onChange)} placeholder={value.length === 0 ? "Type tags and press Enter..." : "Add more tags..."} className="flex-1 min-w-[120px] text-xs outline-none bg-transparent placeholder:text-[12px] placeholder:text-neutral-400" />
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutralfinp-400">
                                Press Enter or comma to add tags. Tags should be relevant to your organization's focus areas.
                            </p>
                        </div>
                    )}
                />
            </div>
        </>
    )
}