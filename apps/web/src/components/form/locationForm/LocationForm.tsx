import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import OpacityBackground from "@/components/ui/OpacityBackground";
import UtilityCard from "@/components/utility/UtilityCard";
import { createLocationFormSchema, CreateLocationFormSchema } from "@/validations/createLocationFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import FormProgressBar from "../FormProgressBar";
import ProgressBarButtons from "../ProgressBarButtons";
import { motion } from 'framer-motion'
import { useRecoilState, useRecoilValue } from "recoil";
import { locationFormProgressBarAtom } from "@/recoil/atoms/progressBarAtom";
import LocationFormOne from "./LocationFormOne";
import LocationFormTwo from "./LocationFormTwo";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import axios from "axios";
import { ORGANIZATION_SETTINGS } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationLocationsAtom } from "@/recoil/atoms/organizationAtoms/organizationLocation/organizationLocationsAtom";

interface LocationFormProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const steps = [
    { id: "0", title: "Owner info" },
    { id: "1", title: "Org metadata" },
];

export default function LocationForm({ setOpen, open }: LocationFormProps) {
    const session = useRecoilValue(userSessionAtom);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const organizationId = useRecoilValue(organizationIdAtom);
    const [currentStep, setCurrentStep] = useRecoilState(locationFormProgressBarAtom);
    const [orgLocations, setOrgLocations] = useRecoilState(organizationLocationsAtom);

    const { reset, handleSubmit, control, formState: { errors } } = useForm<CreateLocationFormSchema>({
        resolver: zodResolver(createLocationFormSchema),
        defaultValues: {
            organization_id: organizationId!,
            mode: 'OFFLINE'
        }
    })

    function renderComponent() {
        switch (currentStep) {
            case 0:
                return <LocationFormOne errors={errors} control={control} />
            case 1:
                return <LocationFormTwo errors={errors} control={control} />
        }
    }

    async function onSubmit(payload: CreateLocationFormSchema) {
        try {
            const { data } = await axios.post(`${ORGANIZATION_SETTINGS}/location/${organizationId}`, payload, {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`
                }
            })
            setOrgLocations(prev => [data.data, ...prev]);
            setOpen(false);
            reset();
            console.log(data.data);
        } catch (err) {
            console.error("Error while storing locations");
        }
    }

    return (
        <OpacityBackground onBackgroundClick={() => setOpen(false)}>
            <UtilityCard
                open={open}
                setOpen={setOpen}
                className="w-[28rem] px-12 pt-8 pb-5 dark:bg-neutral-900 dark:border-neutral-600 border-[1px]"
            >
                <DashboardComponentHeading description="Provide details to set up a new location under your organization">
                    Create New Location
                </DashboardComponentHeading>
                <form key={open.toString()} onSubmit={handleSubmit(onSubmit)}>
                    <FormProgressBar
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        totalLevels={1}
                        steps={steps}
                        className="mt-8"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4"
                    >
                        {renderComponent()}
                    </motion.div>
                    <ProgressBarButtons
                        isSubmitting={isSubmitting}
                        currentLevel={currentStep}
                        setCurrentLevel={setCurrentStep}
                        totalLevels={1}
                        className="w-full"
                    />
                </form>
            </UtilityCard>
        </OpacityBackground>
    )
}