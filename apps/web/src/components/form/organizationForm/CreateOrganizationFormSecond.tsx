import { Control, Controller, FieldErrors } from "react-hook-form";
import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import ErrorMessage from "@/components/utility/ErrorMessage";
import { FormValues } from "@/components/dashboard/CreateOrganizationForm";
import InputBox from "@/components/utility/InputBox";
import { FileUpload } from "@/components/ui/file-upload";

export const presetChannels = [
    {
        id: 'announcements',
        name: 'Announcements',
        defaultEnabled: true,
    },
    {
        id: 'general',
        name: 'General Chat',
        defaultEnabled: true,
    },
    {
        id: 'resources',
        name: 'Resources',
        defaultEnabled: true,
    },
    {
        id: 'help-desk',
        name: 'Help Desk',
        defaultEnabled: true,
    },
    {
        id: 'projects',
        name: 'Projects',
        defaultEnabled: true,
    },
    {
        id: 'learning',
        name: 'Learning',
        defaultEnabled: true,
    }
];


interface OrganizationDetailsSectionProps {
    control: Control<FormValues>;
    errors: FieldErrors<FormValues>;
}

export default function ({
    control,
    errors
}: OrganizationDetailsSectionProps) {
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
        <div className="">
            <div className="flex flex-row gap-x-4 w-full">
                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <FileUpload
                        className="mt-8"
                            value={value}
                            onChange={onChange}
                            error={errors.image?.message}
                        />
                    )}
                />
                <div className="flex-col w-full">
                    <Controller
                        name="organizationName"
                        control={control}
                        render={({ field }) => (
                            <InputBox
                                className="mt-4"
                                label="Organization name"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.ownerName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="organizationDescription"
                        control={control}
                        render={({ field }) => (
                            <InputBox
                                className="mt-4"
                                label="Choose description"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.ownerName?.message}
                            />
                        )}
                    />
                </div>
            </div>
            <div className="mt-6">
                <div className="relative">
                    <ErrorMessage error={errors?.organizationTags?.message} />
                    <label className="text-[12px] ml-1 font-light tracking-wider text-gray-700 dark:text-gray-200 mb-1">
                        Add Organization Tags
                    </label>
                    <Controller
                        name="organizationTags"
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
                                        className="flex-1 min-w-[120px] outline-none rounded-[8px] bg-transparent text-sm dark:bg-neutral-900 dark:text-gray-200 placeholder:text-[12px] placeholder:text-neutral-400 border-zinc-400 dark:border-zinc-600"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Press Enter or comma to add tags. Tags should be relevant to your organization's focus areas.
                                </p>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}