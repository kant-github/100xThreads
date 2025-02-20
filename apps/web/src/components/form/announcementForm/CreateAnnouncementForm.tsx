import UtilityCard from "@/components/utility/UtilityCard";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormProgressBar from "../FormProgressBar";
import ProgressBarButtons from "../ProgressBarButtons";
import CreateAnnouncementFormOne from "./CreateAnnouncementFormOne";
import CreateAnnouncementFormTwo from "./CreateAnnouncementFormTwo";
import CreateAnnouncementFormThree from "./CreateAnnouncementFormThree";
import axios from "axios";
import { API_URL } from "@/lib/apiAuthRoutes";
import { ChannelType } from "types/types";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessagesAtom";
import { progressBarAtom } from "@/recoil/atoms/progressBarAtom";

const PriorityEnum = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]);

const createAnnouncementFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10000 characters"),
    priority: PriorityEnum.default('LOW'),
    tags: z.array(z.string()).default([]).transform(tags => tags.filter(tag => tag.length > 0)),
    expires_at: z.string().min(1, 'Select the date'),
    creator_name: z.string()
})

export type CreateAnnouncementFormSchemaType = z.infer<typeof createAnnouncementFormSchema>;

interface CreateAnnouncementFormProps {
    className?: string;
    createAnnoucementModal: boolean;
    setCreateAnnouncementModal: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType
}


export default function ({ className, createAnnoucementModal, setCreateAnnouncementModal, channel }: CreateAnnouncementFormProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useRecoilState(progressBarAtom);
    const setAnnouncementChannelMessages = useSetRecoilState(announcementChannelMessgaes);
    const session = useRecoilValue(userSessionAtom);
    const organizationId = useRecoilValue(organizationIdAtom);
    const { control, reset, handleSubmit, formState: { errors } } = useForm<CreateAnnouncementFormSchemaType>({
        resolver: zodResolver(createAnnouncementFormSchema),
        defaultValues: {
            creator_name: session.user?.name!
        }
    })

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setCreateAnnouncementModal(false);
            }
        }

        if (createAnnoucementModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [createAnnoucementModal])

    async function submitHandler(formData: CreateAnnouncementFormSchemaType) {
        try {
            setIsSubmitting(true);
            const { data } = await axios.post(`${API_URL}/organizations/${organizationId}/channels/${channel.id}/announcement-channel`, formData, {
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

    function renderComponent() {
        switch (currentStep) {
            case 1:
                return <CreateAnnouncementFormOne control={control} errors={errors} />;
            case 2:
                return <CreateAnnouncementFormTwo control={control} errors={errors} />;
            case 3:
                return <CreateAnnouncementFormThree control={control} errors={errors} />;
            default:
                return null;
        }
    }

    return (
        <div ref={ref}>
            <UtilityCard className="absolute z-[100] top-[4rem] right-0 w-[24rem] bg-white dark:bg-neutral-900 rounded-[14px] px-6 py-4 cursor-pointer border dark:border-neutral-700">
                <div className="text-sm dark:text-neutral-200 font-semibold tracking-wider">Create announcement</div>
                <form className="w-full flex flex-col gap-y-2" onSubmit={handleSubmit(submitHandler)} >
                    <FormProgressBar className="mt-6 w-full" />
                    {renderComponent()}
                    <ProgressBarButtons className="flex flex-row w-full justify-end" />
                </form>
            </UtilityCard>
        </div>
    )
}