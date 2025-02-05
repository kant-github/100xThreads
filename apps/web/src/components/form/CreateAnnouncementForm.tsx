import { Controller, useForm } from "react-hook-form";
import UtilityCard from "../utility/UtilityCard";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import InputBox from "../utility/InputBox";
import { X } from "lucide-react";
import { Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
import GreyButton from "../buttons/GreyButton";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { ChannelType } from "types";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessages";

const PriorityEnum = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]);


const createAnnouncementFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10000 characters"),
    priority: PriorityEnum.default('LOW'),
    tags: z.array(z.string()).default([]).transform(tags => tags.filter(tag => tag.length > 0))
})

type AnnouncementFormSchema = z.infer<typeof createAnnouncementFormSchema>;

interface CreateAnnouncementFormProps {
    className?: string;
    createAnnoucementModal: boolean;
    setCreateAnnouncementModal: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType
}

export default function ({ className, setCreateAnnouncementModal, createAnnoucementModal, channel }: CreateAnnouncementFormProps) {
    const [tagInput, setTagInput] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const organization = useRecoilValue(organizationAtom);
    const setAnnouncementChannelMessages = useSetRecoilState(announcementChannelMessgaes);
    const session = useRecoilValue(userSessionAtom);
    const ref = useRef<HTMLDivElement>(null);
    const { reset, handleSubmit, control, formState: { errors } } = useForm<AnnouncementFormSchema>({
        resolver: zodResolver(createAnnouncementFormSchema)
    })

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setCreateAnnouncementModal(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, value: string[], onChange: (value: string[]) => void) {
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

    async function submitHandler(formData: AnnouncementFormSchema) {
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(`${API_URL}/organizations/${organization?.id}/channels/${channel.id}`, formData, {
                headers: {
                    authorization: `Bearer ${session.user?.token}`
                }
            })
            setAnnouncementChannelMessages(prev => [...prev, data.data]);

        } catch (err) {
            console.log("error in creation of anouncement in frontend ", err)
        } finally {
            setIsSubmitting(false);
            setCreateAnnouncementModal(false);
        }
    }

    return (
        <div ref={ref}>
            <UtilityCard className={`w-[28rem] dark:bg-neutral-900 border-[1px] dark:border-neutral-700 absolute right-0 top-10 z-[100] px-8 py-8  ${className}`}>
                <form className="" onSubmit={handleSubmit(submitHandler)}>
                    <div className="w-full flex items-center justify-between gap-x-4">
                        <Controller name="title" control={control} render={({ field }) => (
                            <InputBox className="w-[70%]" onChange={field.onChange} label="Title" value={field.value} error={errors.title?.message} placeholder="Enter announcement title" />
                        )}
                        />
                        <div className="">
                            <label className="block text-xs my-1 font-medium text-gray-700 dark:text-neutral-300">
                                Priority
                            </label>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="w-full rounded-[6px] px-2 text-sm dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-900 outline-none py-2.5" >
                                        <option value="LOW">Low</option>
                                        <option value="NORMAL">Normal</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                )}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300">
                            Content
                        </label>
                        <Controller
                            name="content"
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
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-neutral-300 dark:text-neutral-300">
                            Add tags
                        </label>
                        <Controller
                            name="tags"
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value = [] } }) => (
                                <div className="space-y-3 mt-2">
                                    <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-[6px] border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900">
                                        {value.map((tag: string) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500">
                                                {tag}
                                                <button aria-label="Close" type="button" onClick={() => onChange(value.filter((t: string) => t !== tag))} className="hover:text-yellow-900 dark:hover:text-yellow-400" >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e, value, onChange)} placeholder={value.length === 0 ? "Type tags and press Enter..." : "Add more tags..."} className="flex-1 min-w-[120px] text-xs outline-none bg-transparent placeholder:text-[12px] placeholder:text-neutral-400" />
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutralfinp-400">
                                        Press Enter or comma to add tags. Tags should be relevant to your organization's focus areas.
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                    <button type='submit' className="flex items-center justify-center gap-2 mt-3 bg-yellow-600 hover:bg-yellow-600/90 disabled:bg-yellow-600/90 disabled:cursor-not-allowed text-neutral-900 font-medium px-4 py-2.5 rounded-[8px] mx-auto w-full text-center text-xs" >
                        {isSubmitting ? 'Creating...' : 'Create announcement'}
                    </button>
                </form>
            </UtilityCard>
        </div>
    )
}