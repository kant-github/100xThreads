import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import InputBox from "../utility/InputBox";

interface CreateProjectsFormProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    className?: string
}

const createProjectSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    description: z.string().min(1, "Content is required").max(10000, "Content must be less than 10000 characters"),
})

type ProjectSchema = z.infer<typeof createProjectSchema>;

export default function ({ open, setOpen, className }: CreateProjectsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const { handleSubmit, control, formState: { errors } } = useForm<ProjectSchema>({
        resolver: zodResolver(createProjectSchema)
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

    function submitHandler(data: any) {
        console.log(data);
    }
    return (
        <div className={`${className} absolute right-8`} ref={ref}>
            <UtilityCard open={open} setOpen={setOpen} className=" px-10 py-6 dark:bg-neutral-900 dark:border-neutral-600 border" >
                <DashboardComponentHeading description="start creating the project">Create project</DashboardComponentHeading>
                <form className="flex flex-col items-center justify-between gap-y-4 mt-4" onSubmit={handleSubmit(submitHandler)}>
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
                        render={({ field, fieldState: { error } }) => (
                            <>
                                {error && (<p className="mt-1 text-xs text-red-500"> {error?.message} </p>)}
                                <textarea
                                    {...field}
                                    className={`mt-2 px-3 py-2 placeholder:text-sm placeholder:text-neutral-400 w-full text-xs min-h-[120px] rounded-[6px] border dark:bg-neutral-900 dark:text-white focus:outline-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-neutral-600 focus:border-gray-300 focus:ring-1 focus:ring-gray-300'}`}
                                    placeholder="Enter announcement content..."
                                />
                            </>
                        )}
                    />
                    <button type='submit' className="flex items-center justify-center gap-2 mt-3 bg-yellow-600 hover:bg-yellow-600/90 disabled:bg-yellow-600/90 disabled:cursor-not-allowed text-neutral-900 font-medium px-4 py-3 rounded-[8px] mx-auto w-full text-center text-xs" >
                        {isSubmitting ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </UtilityCard>
        </div>
    )
}