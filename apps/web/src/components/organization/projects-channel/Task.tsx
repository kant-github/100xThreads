import UnclickableTicker from "@/components/ui/UnclickableTicker"
import { AnimatedTooltipPreview } from "@/components/utility/AnimatedTooltipPreview"
import { FaCalendar } from "react-icons/fa"
import { RxDragHandleDots2 } from "react-icons/rx"
import { TaskTypes } from "types/types"
import { format } from 'date-fns'
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom"
import { useRecoilValue } from "recoil"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom"
import OptionImage from "@/components/ui/OptionImage"

interface TaskProps {
    task: TaskTypes
}

const chooseTaskAssigneesSchema = z.object({
    assignees: z.array(z.number()).min(1, "At least one assignee is required"),
})

type ChooseAssigneeSchemaType = z.infer<typeof chooseTaskAssigneesSchema>;

export default function ({ task }: TaskProps) {
    const [cardExpand, setCardExpand] = useState<boolean>(false);
    const [searchExpand, setSearchExpand] = useState<boolean>(false);
    const organizationUsers = useRecoilValue(organizationUsersAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const organization = useRecoilValue(organizationAtom);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setCardExpand(false);
                setSearchExpand(false);
            }
        }
        if (cardExpand || searchExpand) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [cardExpand,]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ChooseAssigneeSchemaType>({
        resolver: zodResolver(chooseTaskAssigneesSchema),
        defaultValues: {
            assignees: task.assignees?.map((assignee) => assignee.org_user_id)
        }
    })

    console.log(task.assignees);

    const filteredUsers = organizationUsers.filter(user =>
        user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function expandCardHandler() {
        if (cardExpand && searchExpand) {
            console.log("rishi");
            setSearchExpand(false);
            setCardExpand(false);
        } else if (!cardExpand && searchExpand) {
            console.log("somya");
            setSearchExpand(false);
            setCardExpand(false);
        } else if (cardExpand) {
            console.log("falsed");
            setCardExpand(false);
        } else if (!cardExpand) {
            setCardExpand(true);
        }
    }

    return (
        <div
            ref={ref}
            onClick={expandCardHandler}
            key={task.id}
            style={{ backgroundColor: `${task.color}CA` }}
            className={`p-3 rounded-[12px] select-none flex flex-col gap-y-1 relative cursor-grab transition-all duration-200 ease-in-out  ${searchExpand ? 'h-[25rem]' : ''} ${cardExpand ? 'h-[11rem]' : 'h-[8rem]'}`}
        >
            <div className="text-neutral-950 text-md font-semibold">
                {task.title.substring(0, 15)}...
            </div>
            <div className="text-neutral-950 font-medium text-[13px] mt-1">
                {task.description}
            </div>
            <div className='flex items-center gap-x-2'>
                <div className="flex-shrink-0 w-[30px] h-[30px] flex items-center justify-center">
                    <RxDragHandleDots2
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearchExpand(prev => !prev);
                        }}
                        size={19}
                        className='bg-neutral-300/50 rounded-[4px] cursor-pointer p-[2px] hover:bg-neutral-300/70 transition-colors'
                    />
                </div>
                <AnimatedTooltipPreview className="select-none" users={task.assignees!.map(assignee => assignee.organization_user)} />
                {searchExpand && (
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-3 py-1 border rounded-[8px] text-sm dark:bg-neutral-300/50 dark:border-neutral-300 dark:text-neutral-200 placeholder:text-xs placeholder:text-neutral-700"
                    />
                )}
            </div>
            <UnclickableTicker className="absolute top-3 right-3 text-[9px]">
                <FaCalendar className="text-amber-500" />
                {format(new Date(task.due_date!), "EEE d MMM")}
            </UnclickableTicker>
            <div className={`${cardExpand || searchExpand ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 ease-linear mt-2 flex flex-row gap-x-2 items-center`}>
                {
                    task.tags.map((tag, index) => <UnclickableTicker key={index}>{tag}</UnclickableTicker>)
                }
            </div>
            <div
                className={`mt-2 block transition-opacity duration-400 ${searchExpand ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
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
                                    <div className="flex items-center space-x-3 p-2 px-3 border dark:border-neutral-400 rounded-[10px] bg-neutral-300/50 hover:bg-neutral-300/40">
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
                                            className="w-4 h-4 appearance-none flex-shrink-0 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500 checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center transition-colors duration-200"
                                        />
                                        <label htmlFor={`user-${orgUser.id}`} className="flex items-center space-x-3 cursor-pointer w-full min-w-0">
                                            <div className="flex">
                                                {orgUser.user.image && (
                                                    <OptionImage
                                                        content={<Image
                                                            width={40}
                                                            height={40}
                                                            src={orgUser.user.image}
                                                            alt={orgUser.user.name}
                                                            className="rounded-full flex-shrink-0"
                                                        />}
                                                        organizationId={organization?.id!}
                                                        userId={orgUser.user_id}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0 w-full pr-2">
                                                <span className="text-[13px] font-medium dark:text-neutral-950 truncate">
                                                    {orgUser.user.name}
                                                </span>
                                                <span className="text-[11px] text-gray-500 dark:text-neutral-950 truncate">
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
        </div>
    )
}