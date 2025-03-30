import UnclickableTicker from "@/components/ui/UnclickableTicker"
import { AnimatedTooltipPreview } from "@/components/utility/AnimatedTooltipPreview"
import { FaCalendar } from "react-icons/fa"
import { ChannelType, TaskTypes } from "types/types"
import { format } from 'date-fns'
import { useEffect, useRef, useState } from "react"
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom"
import { useRecoilValue } from "recoil"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaUserEdit } from "react-icons/fa";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom"
import { useDraggable } from "@dnd-kit/core"
import TaskAssigningDropDown from "./TaskAssigningDropDown"
import { RxDragHandleHorizontal } from "react-icons/rx";


interface TaskProps {
    task: TaskTypes;
    channel: ChannelType;
}

const chooseTaskAssigneesSchema = z.object({
    assignees: z.array(z.number()).min(1, "At least one assignee is required"),
})

export type ChooseAssigneeSchemaType = z.infer<typeof chooseTaskAssigneesSchema>;

export default function ({ task, channel }: TaskProps) {
    const [cardExpand, setCardExpand] = useState<boolean>(false);
    const [searchExpand, setSearchExpand] = useState<boolean>(false);
    const organizationUsers = useRecoilValue(organizationUsersAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const ref = useRef<HTMLDivElement | null>(null);
    const { setNodeRef, listeners, attributes, transform } = useDraggable({ id: task.id });
    const selectedProject = useRecoilValue(projectSelectedAtom);

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
    }, [cardExpand, searchExpand]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ChooseAssigneeSchemaType>({
        resolver: zodResolver(chooseTaskAssigneesSchema),
        defaultValues: {
            assignees: task.assignees?.map((assignee) => assignee?.org_user_id)
        }
    })

    const filteredUsers = organizationUsers.filter(user =>
        user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function expandCardHandler() {

        if (cardExpand && searchExpand) {
            setSearchExpand(false);
            setCardExpand(false);
        } else if (!cardExpand && searchExpand) {
            setSearchExpand(false);
            setCardExpand(false);
        } else if (cardExpand) {
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
            style={{
                backgroundColor: `${task.color}CA`,
                ...(transform ? {
                    transform: `translate(${transform.x}px, ${transform.y}px)`,
                    transition: 'transform 0.05s ease'
                } : {})
            }}
            className={`p-3 rounded-[12px] select-none flex flex-col gap-y-1 relative cursor-pointer transition-all duration-200 ease-in-out w-full ${searchExpand ? 'h-[27rem]' : cardExpand ? 'h-[13rem]' : 'h-[10rem]'}`}
        >
            <div className='flex items-center gap-x-2'>
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    className="flex-shrink-0 w-[30px] h-[30px] flex items-center justify-center cursor-grab"
                >
                    <RxDragHandleHorizontal
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearchExpand(prev => !prev);
                        }}
                        size={24}
                        className='bg-neutral-300/50 rounded-[4px] p-[3px] hover:bg-neutral-300/70 transition-colors cursor-grab'
                    />
                </div>
            </div>
            <div className="text-neutral-950 text-base font-bold">
                {task.title.substring(0, 15)}...
            </div>
            <div className="text-neutral-950 font-medium text-[13px] mt-1">
                {task.description}
            </div>
            <div className='flex items-center gap-x-2'>
                <div className="flex-shrink-0 w-[30px] h-[30px] flex items-center justify-center">
                    <FaUserEdit
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearchExpand(prev => !prev);
                        }}
                        size={19}
                        className='bg-neutral-300/50 rounded-[4px] cursor-pointer p-[3px] hover:bg-neutral-300/70 transition-colors'
                    />
                </div>
                {/* <AnimatedTooltipPreview className="select-none" users={task.assignees!.map(assignee => assignee.organization_user)} /> */}
                {searchExpand && (
                    <div className="w-full flex justify-end">
                        <input
                            type="text"
                            placeholder="search users.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-3/4 px-3 py-1 border rounded-[8px] text-sm dark:bg-neutral-300/50 dark:border-neutral-300 dark:text-neutral-200 placeholder:text-xs placeholder:text-neutral-700"
                        />
                    </div>
                )}
            </div>
            <UnclickableTicker className="absolute top-3 right-3 text-[9px]">
                <FaCalendar className="text-amber-500" />
                {format(new Date(task.due_date!), "EEE d MMM")}
            </UnclickableTicker>
            <div className={`${cardExpand || searchExpand ? 'opacity-100 delay-200' : 'opacity-0'} transition-opacity ease-linear mt-2 flex flex-row gap-x-2 items-center`}>
                {
                    task.tags.map((tag, index) => <UnclickableTicker key={index}>{tag}</UnclickableTicker>)
                }
            </div>
            <TaskAssigningDropDown errors={errors} searchExpand={searchExpand} control={control} filteredUsers={filteredUsers} selectedProject={selectedProject!} task={task} channel={channel} />
        </div>
    )
}