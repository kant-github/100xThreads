import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import { z } from 'zod';
import { ChannelType, Priority, TaskStatus } from "types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { progressBarAtom } from "@/recoil/atoms/progressBarAtom";
import CreateTaskFormOne from "./CreateTaskFormOne";
import CreateTaskFormTwo from "./CreateTaskFormTwo";
import CreateTaskFormThree from "./CreateTaskFormThree";
import UtilityCard from "@/components/utility/UtilityCard";
import FormProgressBar from "../FormProgressBar";
import ProgressBarButtons from "../ProgressBarButtons";
import { useWebSocket } from "@/hooks/useWebsocket";
import { presetColors } from "../FirstComponent";

interface CreateTaskFormProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType;
}

const createTaskFormSchema = z.object({
    title: z.string().min(1, 'Title is missing').max(28, 'Max 28 characters'),
    description: z.string().min(1, 'Description is missing').max(70, 'Max 70 characters'),
    priority: z.enum([Priority.LOW, Priority.NORMAL, Priority.HIGH, Priority.URGENT]),
    dueDate: z.string().optional(),
    status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).default(TaskStatus.TODO),
    assignees: z.array(z.number()).min(1, "At least one assignee is required"),
    tags: z.array(z.string()).min(1, "Add at least one tag").max(5, "Maximum 5 tags allowed"),
    color: z.string().refine(
        (color) => !color || presetColors.some((preset) => preset.value === color),
        "Select a color"
    ),
})

export type CreateTaskFormType = z.infer<typeof createTaskFormSchema>

export default function ({ open, setOpen, channel }: CreateTaskFormProps) {
    const [currentStep, setCurrentStep] = useRecoilState(progressBarAtom);
    const selectedProject = useRecoilValue(projectSelectedAtom);
    const { sendMessage } = useWebSocket();
    const ref = useRef<HTMLDivElement | null>(null);
    const { reset, control, handleSubmit, formState: { errors } } = useForm<CreateTaskFormType>({
        resolver: zodResolver(createTaskFormSchema),
        defaultValues: {
            priority: Priority.NORMAL,
            status: TaskStatus.TODO
        }
    });

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open])

    function submitHandler(data: CreateTaskFormType) {
        const payload = {
            ...data,
            projectId: selectedProject?.id
        }
        sendMessage(payload, channel.id, 'new-created-task');
        reset();
        setCurrentStep(1);
        setOpen(false);
    }

    function renderComponent() {
        switch (currentStep) {
            case 1:
                return <CreateTaskFormOne control={control} errors={errors} />;
            case 2:
                return <CreateTaskFormTwo control={control} errors={errors} />;
            case 3:
                return <CreateTaskFormThree control={control} errors={errors} />;
            default:
                return null;
        }
    }

    return (
        <div ref={ref}>
            <UtilityCard className="absolute top-[4rem] right-0 w-[24rem] bg-white dark:bg-neutral-900 rounded-[14px] px-6 py-4 cursor-pointer border dark:border-neutral-700">
                <div className="text-sm dark:text-neutral-200 font-semibold tracking-wider">Add task to <span className="text-amber-500 font-light">`{selectedProject?.title}`</span>...</div>
                <form className="w-full flex flex-col gap-y-2" onSubmit={handleSubmit(submitHandler)} >
                    <FormProgressBar className="mt-6 w-full" />
                    {renderComponent()}
                    <ProgressBarButtons className="flex flex-row w-full justify-end" />
                </form>
            </UtilityCard>
        </div>
    )
}