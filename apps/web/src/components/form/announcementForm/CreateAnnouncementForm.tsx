"use client"
import UtilityCard from "@/components/utility/UtilityCard";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form"
import { z } from "zod"
import FormProgressBar from "../FormProgressBar";
import ProgressBarButtons from "../ProgressBarButtons";
import CreateAnnouncementFormOne from "./CreateAnnouncementFormOne";
import CreateAnnouncementFormTwo from "./CreateAnnouncementFormTwo";
import CreateAnnouncementFormThree from "./CreateAnnouncementFormThree";
import { AnnouncementType, ChannelType, Priority } from "types/types";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { announcementFormProgressBarAtom } from "@/recoil/atoms/progressBarAtom";
import { useWebSocket } from "@/hooks/useWebsocket";
import { announcementChannelMessgaes } from "@/recoil/atoms/organizationAtoms/announcementChannelMessagesAtom";
import { v4 as uuidv4 } from 'uuid';
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";

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
const steps = [
    { id: "0", title: "creator" },
    { id: "1", title: "tags / priority" },
    { id: "2", title: "metadata" },
];
interface CreateAnnouncementFormProps {
    className?: string;
    createAnnoucementModal: boolean;
    setCreateAnnouncementModal: Dispatch<SetStateAction<boolean>>;
    channel: ChannelType
}


export default function ({ createAnnoucementModal, setCreateAnnouncementModal, channel }: CreateAnnouncementFormProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [currentStep, setCurrentStep] = useRecoilState(announcementFormProgressBarAtom);
    const session = useRecoilValue(userSessionAtom);
    const setAnnouncementMessages = useSetRecoilState(announcementChannelMessgaes);

    const organizationUser = useRecoilValue(organizationUserAtom);
    const { sendMessage } = useWebSocket();
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

    function submitHandler(formData: CreateAnnouncementFormSchemaType) {

        const tempId = uuidv4();
        const optimisticAnnouncement: AnnouncementType = {
            id: tempId,
            channel_id: channel.id,
            title: formData.title,
            content: formData.content,
            priority: formData.priority as Priority,
            tags: formData.tags,
            creator_org_user_id: organizationUser.id,
            creator: {
                id: organizationUser.id,
                organization_id: organizationUser.organization_id,
                user_id: Number(session.user!.id),
                role: organizationUser.role,
                user: {
                    id: Number(session.user!.id),
                    name: session.user!.name!,
                    username: session.user!.username || "",
                    image: session.user!.image!,
                    email: session.user!.email!,
                    provider: session.user!.provider!,
                    bio: "",
                    created_at: "",
                    oauth_id: ""
                },
            },
            created_at: new Date(),
            expires_at: new Date(formData.expires_at),
            is_pinned: false,
            requires_ack: false,
            AckStatus: []
        };

        setAnnouncementMessages(prev => [optimisticAnnouncement, ...prev]);
        sendMessage({ optimisticAnnouncement, userId: session.user?.id, }, channel.id, 'new-announcement');
        setCurrentStep(0);
        reset();
        setCreateAnnouncementModal(false);
    }

    function renderComponent() {
        switch (currentStep) {
            case 0:
                return <CreateAnnouncementFormOne control={control} errors={errors} />;
            case 1:
                return <CreateAnnouncementFormTwo control={control} errors={errors} />;
            case 2:
                return <CreateAnnouncementFormThree control={control} errors={errors} />;
            default:
                return null;
        }
    }

    return (
        <div ref={ref} className="absolute right-0 top-12 z-50">
            <UtilityCard className="top-[4rem] w-[24rem] bg-white dark:bg-neutral-900 rounded-[14px] px-6 py-4 cursor-pointer border dark:border-neutral-700">
                {/* <div className="text-sm dark:text-neutral-200 font-semibold tracking-wider">Create announcement</div> */}
                <form className="w-full flex flex-col gap-y-2" onSubmit={handleSubmit(submitHandler)} >
                    <FormProgressBar setCurrentStep={setCurrentStep} currentStep={currentStep} totalLevels={2} steps={steps} className="mt-6 w-full" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4"
                    >
                        {renderComponent()}
                    </motion.div>
                    <ProgressBarButtons
                        setCurrentLevel={setCurrentStep}
                        currentLevel={currentStep}
                        totalLevels={2}
                        className="flex flex-row w-full justify-end"
                    />
                </form>
            </UtilityCard>
        </div>
    )
}