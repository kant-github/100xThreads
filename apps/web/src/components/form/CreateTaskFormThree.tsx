import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateTaskFormType } from "./CreateTaskForm";
import { useRecoilValue } from "recoil";
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import { useState } from "react";
import Image from "next/image";

interface CreateTaskFormThreeProps {
    control: Control<CreateTaskFormType>;
    errors: FieldErrors<CreateTaskFormType>;
}

export default function CreateTaskFormThree({ control, errors }: CreateTaskFormThreeProps) {
    const organizationUsers = useRecoilValue(organizationUsersAtom);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = organizationUsers.filter(user =>
        user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mt-4 w-full">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-[8px] text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                />
            </div>

            <Controller
                name="assignees"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200">
                            Select Assignees
                        </label>
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                            {filteredUsers.map((orgUser) => (
                                <div key={orgUser.id} className="flex items-center space-x-3 p-2 px-3 border dark:border-neutral-700 rounded-[10px] hover:bg-gray-50 dark:hover:bg-neutral-800" >
                                    <input
                                        type="checkbox"
                                        id={`user-${orgUser.id}`}
                                        checked={field.value?.includes(orgUser.id)}
                                        onChange={(e) => {
                                            const updatedAssignees = e.target.checked
                                                ? [...(field.value || []), orgUser.id]
                                                : (field.value || []).filter(id => id !== orgUser.id);
                                            field.onChange(updatedAssignees);
                                        }}
                                        className="appearance-none h-4 w-4 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500 checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center transition-colors duration-200"
                                    />
                                    <label htmlFor={`user-${orgUser.id}`} className="flex items-center space-x-3 cursor-pointer" >
                                        {orgUser.user.image && (
                                            <Image
                                                width={24}
                                                height={24}
                                                src={orgUser.user.image}
                                                alt={orgUser.user.name}
                                                className="h-8 w-8 rounded-full"
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium dark:text-neutral-200">
                                                {orgUser.user.name}
                                            </span>
                                            <span className="text-[11px] text-gray-500 dark:text-neutral-400">
                                                {orgUser.user.email}
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
    );
}