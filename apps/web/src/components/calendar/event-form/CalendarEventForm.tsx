import { Dispatch, SetStateAction, useState } from "react";
import DashboardComponentHeading from "../../dashboard/DashboardComponentHeading";
import OpacityBackground from "../../ui/OpacityBackground";
import UtilityCard from "../../utility/UtilityCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProgressBar from "../../form/FormProgressBar";
import ProgressBarButtons from "../../form/ProgressBarButtons";
import { useRecoilState } from "recoil";
import { eventFormProgressBarAtom } from "@/recoil/atoms/progressBarAtom";
import { motion } from 'framer-motion'
import CalendarEventfFormOne from "./CalendarEventfFormOne";
import { CreateEventFormSchema, createEventFormSchema } from "@/validations/createEventFormSchema";
import CalendarEventfFormTwo from "./CalendarEventfFormTwo";
import { EventChannelType } from "types/types";
import CalendarEventfFormThree from "./CalendarEventfFormThree";

interface CalendarEventFormProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    channel: EventChannelType;
    selectedDate: Date | null
}

const steps = [
    { id: "0", title: "Timings" },
    { id: "1", title: "Event metedata" },
    { id: "2", title: "location / users" },
];

export default function ({ isOpen, setIsOpen, channel, selectedDate }: CalendarEventFormProps) {

    function getDefaultstartTime() {
        if (selectedDate) {
            const startTime = new Date(selectedDate);
            const now = new Date();
            startTime.setHours(now.getHours(), 0, 0, 0);
            return startTime;
        }
        return new Date();
    }

    function getDefaultendTime() {
        const startTime = getDefaultstartTime();
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        return endTime;
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useRecoilState(eventFormProgressBarAtom);
    const { control, watch, reset, handleSubmit, formState: { errors } } = useForm<CreateEventFormSchema>({
        resolver: zodResolver(createEventFormSchema),
        defaultValues: {
            title: "",
            description: "",
            start_time: getDefaultstartTime(),
            end_time: getDefaultendTime(),
            location: "",
            meet_link: "",
            created_by: 1,
            event_room_id: "",
            status: "PENDING"
        }
    })

    function onSubmit(data: CreateEventFormSchema) {
        console.log("submitting");
        console.log("event data is : ", data);
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
                    New Calendar Event
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