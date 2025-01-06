import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormValues } from "../dashboard/CreateOrganizationForm";
import ErrorMessage from "../utility/ErrorMessage";
import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

export const presetChannels = [
    {
        id: 'announcements',
        name: 'Announcements',
        description: 'Official announcements and important updates',
        defaultEnabled: true,
    },
    {
        id: 'general',
        name: 'General Chat',
        description: 'General discussion and conversations',
        defaultEnabled: true,
    },
    {
        id: 'resources',
        name: 'Resources',
        description: 'Knowledge sharing and resources',
        defaultEnabled: true,
    },
    {
        id: 'help-desk',
        name: 'Help Desk',
        description: 'Support and assistance',
        defaultEnabled: true,
    },
    {
        id: 'projects',
        name: 'Projects',
        description: 'Project management and updates',
        defaultEnabled: true,
    },
    {
        id: 'learning',
        name: 'Learning',
        description: 'Educational content and resources',
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

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        value: string[],
        onChange: (value: string[]) => void
    ) => {
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
        <div>
            <div className="relative">
                <ErrorMessage error={errors?.presetChannels?.message} />
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-4">
                    Select Preset Channels
                </label>
                <Controller
                    name="presetChannels"
                    control={control}
                    defaultValue={presetChannels.map(channel => channel.id)}
                    render={({ field: { onChange, value = [] } }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {presetChannels.map((channel) => (
                                <label key={channel.id} className="flex items-start space-x-3 cursor-pointer group dark:bg-zinc-900/80 py-3 px-4 rounded-[8px] select-none hover:bg-zinc-50 dark:hover:bg-zinc-700/90 transition-colors duration-200 h-full">
                                    <div className="flex items-center h-5 flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={value.includes(channel.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onChange([...value, channel.id]);
                                                } else {
                                                    onChange(value.filter((id: string) => id !== channel.id));
                                                }
                                            }}
                                            className="appearance-none h-4 w-4 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500 checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center transition-colors duration-200"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                            {channel.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {channel.description}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                />
            </div>
            <div className="mt-6">
                <div className="relative">
                    <ErrorMessage error={errors?.organizationTags?.message} />
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-4">
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
            </div>
        </div>
    )
}