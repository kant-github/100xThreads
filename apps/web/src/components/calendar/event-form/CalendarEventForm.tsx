import { Dispatch, SetStateAction, useState } from "react";
import DashboardComponentHeading from "../../dashboard/DashboardComponentHeading";
import OpacityBackground from "../../ui/OpacityBackground";
import UtilityCard from "../../utility/UtilityCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProgressBar from "../../form/FormProgressBar";
import ProgressBarButtons from "../../form/ProgressBarButtons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { eventFormProgressBarAtom } from "@/recoil/atoms/progressBarAtom";
import { motion } from 'framer-motion'
import CalendarEventfFormOne from "./CalendarEventfFormOne";
import { CreateEventFormSchema, createEventFormSchema } from "@/validations/createEventFormSchema";
import CalendarEventfFormTwo from "./CalendarEventfFormTwo";
import { EventStatus } from "types/types";
import CalendarEventfFormThree from "./CalendarEventfFormThree";
import axios from "axios";
import { EVENT_URL } from "@/lib/apiAuthRoutes";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { useToast } from "@/hooks/useToast";
import { eventsForChannel } from "@/recoil/atoms/events/eventsForChannel";
import { singleEventAtom } from "@/recoil/atoms/events/singleEventAtom";
import { eventTagsAtom } from "@/recoil/atoms/events/eventTagsAtom";
import { useAbility } from "@/rbac/abilityContext";
import { Action, Subject } from "types/permission";
import { useGoogleAuthStatus } from "@/hooks/useGoogleAuthStatus";

interface CalendarEventFormProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    channelId: string;
    selectedDate?: Date;

    id?: string;
    start_time?: Date;
    end_time?: Date;
    status?: EventStatus;
    title?: string;
    description?: string;
    tags?: string[];
    location?: string;
    isEditMode: Boolean;
}

const steps = [
    { id: "0", title: "Timings" },
    { id: "1", title: "Event metedata" },
    { id: "2", title: "location / users" },
];

export default function ({ isOpen, setIsOpen, channelId, selectedDate, start_time, end_time, status, title, description, tags, location, isEditMode, id }: CalendarEventFormProps) {
    const ability = useAbility();
    const googleAuthStatus = useGoogleAuthStatus();
    const organizationId = useRecoilValue(organizationIdAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setSingleEvent = useSetRecoilState(singleEventAtom)
    const singleEventTags = useSetRecoilState(eventTagsAtom);
    const session = useRecoilValue(userSessionAtom);
    const [currentStep, setCurrentStep] = useRecoilState(eventFormProgressBarAtom);
    const setEvents = useSetRecoilState(eventsForChannel);
    const { toast } = useToast();

    function getDefaultstartTime() {
        if (isEditMode && start_time) {
            return start_time;
        }
        if (selectedDate) {
            const startTime = new Date(selectedDate);
            const now = new Date();
            startTime.setHours(now.getHours(), 0, 0, 0);
            return startTime;
        }
        return new Date();
    }

    function getDefaultendTime() {
        if (isEditMode && end_time) {
            return end_time;
        }
        const startTime = getDefaultstartTime();
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        return endTime;
    }


    const { control, reset, handleSubmit, formState: { errors } } = useForm<CreateEventFormSchema>({
        resolver: zodResolver(createEventFormSchema),
        defaultValues: {
            title: title || "",
            description: description || "",
            start_time: getDefaultstartTime(),
            end_time: getDefaultendTime(),
            location: location || "",
            meet_link: "",
            created_by: Number(session.user?.id),
            event_room_id: channelId,
            status: status || EventStatus.PENDING,
            linkedTags: tags
        }
    })



    async function onSubmit(payload: CreateEventFormSchema) {

        if (!googleAuthStatus) {
            toast({
                title: "Google token expired or missing",
                description: "Please reconnect your Google account to create or update events.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        if (!session.user?.token) return;
        if (isEditMode) {
            if (ability.cannot(Action.UPDATE, Subject.EVENT)) return;
            try {
                const { data } = await axios.put(`${EVENT_URL}/${organizationId}/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${session.user?.token}`
                    }
                })
                console.log(data);
                setCurrentStep(0);
                reset();
                setIsOpen(false);
                if (data.success) {
                    toast({
                        title: 'Event created successfully',
                        description: data.message
                    })
                    setSingleEvent(data.data);
                    singleEventTags(data.tags);
                    setEvents(prev => [data.data, ...prev]);
                }
            } catch (err) {
                console.error("Error in creating event");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            if (ability.cannot(Action.CREATE, Subject.EVENT)) return;
            try {
                const { data } = await axios.post(`${EVENT_URL}/${organizationId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${session.user?.token}`
                    }
                })
                console.log(data);
                setCurrentStep(0);
                reset();
                setIsOpen(false);
                if (data.success) {
                    toast({
                        title: 'Event created successfully',
                        description: data.message
                    })
                    setEvents(prev => [data.data, ...prev]);
                }
            } catch (err) {
                console.error("Error in creating event");
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    const onError = (errors: any) => {
        console.log("Form validation errors:", errors);
    };

    function renderComponent() {
        switch (currentStep) {
            case 1:
                return <CalendarEventfFormOne control={control} errors={errors} />
            case 0:
                return <CalendarEventfFormTwo control={control} errors={errors} />
            case 2:
                return <CalendarEventfFormThree control={control} errors={errors} />
        }
    }


    return (
        <OpacityBackground onBackgroundClick={() => setIsOpen(false)}>
            <UtilityCard open={isOpen} setOpen={setIsOpen} className="w-4/12 px-12 relative py-5 dark:bg-neutral-900 dark:border-neutral-600 border-[1px]">
                <DashboardComponentHeading description="Quickly add details for your new event.">
                    {isEditMode ? (`Edit ${title}`) : ('New Calendar Event')}
                </DashboardComponentHeading>

                <form key={isOpen.toString()} onSubmit={handleSubmit(onSubmit, onError)}>
                    <FormProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} totalLevels={2} steps={steps} className="mt-8" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4"
                    >
                        {renderComponent()}
                    </motion.div>
                    <ProgressBarButtons isSubmitting={isSubmitting} currentLevel={currentStep} setCurrentLevel={setCurrentStep} totalLevels={2} className="w-full" />
                </form>
            </UtilityCard>
        </OpacityBackground>
    )
}