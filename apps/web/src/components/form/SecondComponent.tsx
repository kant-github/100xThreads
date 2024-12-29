import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormValues } from "../dashboard/CreateRoomForm";

export const presetChannels = [
    {
        id: 'events',
        name: 'Events',
        description: 'Channel for organizing and announcing events',
        defaultEnabled: true,
    },
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
        id: 'admin',
        name: 'Admin',
        description: 'Private channel for administrators',
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
    return (
        <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-4">
                Select Preset Channels
            </label>
            <Controller
                name="presetChannels"
                control={control}
                defaultValue={presetChannels.map(channel => channel.id)}
                render={({ field: { onChange, value = [] } }) => (
                    <div className="space-y-4">
                        {presetChannels.map((channel) => (
                            <label
                                key={channel.id}
                                className="flex items-start space-x-3 cursor-pointer group"
                            >
                                <div className="flex items-center h-5">
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
                                        className="appearance-none h-4 w-4 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500
                           checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                        {channel.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {channel.description}
                                    </span>
                                </div>
                            </label>
                        ))}
                        {errors.presetChannels && (
                            <p className="text-red-500 text-sm">{errors.presetChannels.message}</p>
                        )}
                    </div>
                )}
            />
        </div>
    )
}