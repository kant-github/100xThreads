import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import InputBox from "../utility/InputBox";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { ChannelType } from "types/types";
import { projectChannelMessageAtom } from "@/recoil/atoms/organizationAtoms/projectChannelMessageAtom";

interface CreateProjectsFormProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    className?: string
    channel: ChannelType;
}

const createProjectSchema = z.object({
    title: z.string().min(1, "Title is required").max(20, "Title must be less than 255 characters"),
    description: z.string().min(1, "Content is required").max(32, "Content must be less than 30 characters"),
    dueDate: z.string().min(1, "Due date is required")
})

type ProjectSchema = z.infer<typeof createProjectSchema>;

export default function ({ open, setOpen, className, channel }: CreateProjectsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const organization = useRecoilValue(organizationAtom);
    const session = useRecoilValue(userSessionAtom);
    const ref = useRef<HTMLDivElement>(null);
    const setProjectChannelMessagesAtom = useSetRecoilState(projectChannelMessageAtom);
    const { handleSubmit, control, formState: { errors } } = useForm<ProjectSchema>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            dueDate: new Date().toISOString().split('T')[0]
        }
    })

    useEffect(() => {
        function clickOutsideHandler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', clickOutsideHandler);
        return () => {
            document.removeEventListener('mousedown', clickOutsideHandler);
        }

    }, [open])

    async function submitHandler(formData: ProjectSchema) {
        console.log(formData);
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(`${API_URL}/organizations/${organization?.id}/channels/${channel.id}/project-channel`, formData, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`
                }
            })
            setProjectChannelMessagesAtom(prev => [...prev, data.data]);
            console.log("project data is : ", data);

        } catch (err) {
            console.log("error in creation of anouncement in frontend ", err)
        } finally {
            setIsSubmitting(false);
            setOpen(false);
        }
    }
    return (
        <div className={`${className} absolute right-8`} ref={ref}>
            <UtilityCard open={open} setOpen={setOpen} className="px-[20px] py-4 dark:bg-neutral-900 dark:border-neutral-600 border" >
                {/* <DashboardComponentHeading description="start creating the project">Create project</DashboardComponentHeading> */}
                <form className="flex flex-col items-center justify-between gap-y-4" onSubmit={handleSubmit(submitHandler)}>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => {
                            return <InputBox placeholder="Choose project title" onChange={field.onChange} value={field.value} label="Title" error={errors.title?.message} />
                        }}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => {
                            return <InputBox placeholder="Choose project description" onChange={field.onChange} value={field.value} label="Description" error={errors.description?.message} />
                        }}
                    />
                    <Controller
                        name="dueDate"
                        control={control}
                        render={({ field }) => {
                            return (
                                <div className="w-full">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
                                        Due Date
                                    </label>
                                    <input id="date" type="date"
                                        className="w-full px-3 py-2 border rounded-[8px] text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 outline-none select-none"
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                    {errors.dueDate && (
                                        <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
                                    )}
                                </div>
                            )
                        }}
                    />
                    <button type='submit' className="flex items-center justify-center gap-2 mt-3 bg-yellow-600 hover:bg-yellow-600/90 disabled:bg-yellow-600/90 disabled:cursor-not-allowed text-neutral-900 font-medium px-4 py-3 rounded-[8px] mx-auto w-full text-center text-xs" >
                        {isSubmitting ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </UtilityCard>
        </div>
    )
}