import ErrorMessage from "@/components/utility/ErrorMessage";
import { presetChannels } from "./CreateOrganizationFormSecond";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormValues } from "@/components/dashboard/CreateOrganizationForm";
import { presetColors } from "./CreateOrganizationFormOne";

interface OrganizationDetailsSectionProps {
    control: Control<FormValues>;
    errors: FieldErrors<FormValues>;
}

export default function ({
    control,
    errors
}: OrganizationDetailsSectionProps) {
    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-neutral-200 mb-2">
                    Choose Organization Color
                </label>
                <Controller
                    name="organizationColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-4">
                                {presetColors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => onChange(color.value)}
                                        className={`w-8 h-8 rounded-[4px] transition-all duration-200 ${value === color.value
                                            ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-black dark:ring-white scale-110'
                                            : 'hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                            {value && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded border border-gray-200 dark:border-gray-700"
                                        style={{ backgroundColor: value }}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {value.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {errors.organizationColor && (
                                <p className="text-red-500 text-sm">
                                    {errors.organizationColor.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
            <div className="relative">
                <ErrorMessage error={errors?.presetChannels?.message} />
                <label className="block text-xs font-medium text-gray-700 dark:text-neutral-200 mb-2">
                    Select Preset Channels
                </label>
                <Controller
                    name="presetChannels"
                    control={control}
                    defaultValue={presetChannels.map(channel => channel.id)}
                    render={({ field: { onChange, value = [] } }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
                            {presetChannels.map((channel) => (
                                <label key={channel.id} className="flex items-start space-x-3 cursor-pointer group dark:bg-neutral-950 py-3 px-4 rounded-[8px] select-none hover:bg-zinc-50 dark:hover:bg-zinc-700/90 transition-colors duration-200 h-full">
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
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                            {channel.name}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                />
            </div>
        </div>
    )
}