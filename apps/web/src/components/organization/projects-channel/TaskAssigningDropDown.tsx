import OptionImage from "@/components/ui/OptionImage";
import Image from "next/image";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ChooseAssigneeSchemaType } from "./Task";
import { ChannelType, OrganizationUsersType, ProjectTypes, TaskTypes } from "types/types";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";

interface TaskAssigningDropDown {
    searchExpand: boolean;
    control: Control<ChooseAssigneeSchemaType>;
    selectedProject: ProjectTypes;
    filteredUsers: any;
    task: TaskTypes;
    errors: FieldErrors<ChooseAssigneeSchemaType>;
    channel: ChannelType
}

export default function ({ searchExpand, control, filteredUsers, selectedProject, errors, task, channel }: TaskAssigningDropDown) {
    const { sendMessage } = useWebSocket();
    const organization = useRecoilValue(organizationAtom);

    const truncateEmail = (email: string, maxLength = 20) => {
        if (email.length <= maxLength) return email;

        const atIndex = email.indexOf('@');
        if (atIndex === -1 || atIndex > maxLength - 3) {
            return email.substring(0, maxLength - 3) + '...';
        }

        // Keep username part up to 10 chars max and show domain part partially
        const username = email.substring(0, Math.min(atIndex, 10));
        const domain = email.substring(atIndex);
        const domainToShow = domain.length > 10 ? domain.substring(0, 9) + '...' : domain;

        return username + domainToShow;
    };
    return (
        <div
            className={`mt-2 block transition-opacity w-full ${searchExpand && 'delay-200'} ${searchExpand ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <Controller
                name="assignees"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200">
                            Select Assignees
                        </label>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 w-full">
                            {filteredUsers.map((orgUser: OrganizationUsersType) => (
                                <div key={orgUser.id} className="flex items-center space-x-3 p-2 px-3 border dark:border-neutral-400 rounded-[10px] bg-neutral-300/50 hover:bg-neutral-300/40 w-full">
                                    <input
                                        type="checkbox"
                                        id={`user-${orgUser.id}`}
                                        checked={field.value?.includes(orgUser.id)}
                                        onChange={(e) => {
                                            const updatedAssignees = e.target.checked ? [...(field.value || []), orgUser.id] : (field.value || []).filter(id => id !== orgUser.id);
                                            const payload = {
                                                orgUserId: orgUser.id,
                                                project_id: selectedProject?.id,
                                                task_id: task.id,
                                                action: e.target.checked ? 'add' : 'remove'
                                            };
                                            sendMessage(payload, channel.id, 'task-assignee-change');
                                            field.onChange(updatedAssignees);
                                        }}
                                        className="w-4 h-4 appearance-none flex-shrink-0 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500 checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center transition-colors duration-200"
                                    />
                                    <label htmlFor={`user-${orgUser.id}`} className="flex items-center space-x-3 cursor-pointer w-full overflow-hidden">
                                        <div className="flex-shrink-0">
                                            {orgUser.user.image && (
                                                <OptionImage
                                                    content={<Image
                                                        width={40}
                                                        height={40}
                                                        src={orgUser.user.image}
                                                        alt={orgUser.user.name}
                                                        className="rounded-full"
                                                    />}
                                                    organizationId={organization?.id!}
                                                    userId={orgUser.user_id}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1 w-full max-w-full overflow-hidden">
                                            <span className="text-[13px] font-medium dark:text-neutral-950 truncate">
                                                {orgUser.user.name}
                                            </span>
                                            <span className="text-[11px] text-gray-500 dark:text-neutral-950 truncate block w-full" title={orgUser.user.email}>
                                                {truncateEmail(orgUser.user.email)}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.assignees && (
                            <p className="text-red-500 text-xs mt-1">{errors.assignees.message}</p>
                        )}
                    </div>
                )}
            />
        </div>
    )
}