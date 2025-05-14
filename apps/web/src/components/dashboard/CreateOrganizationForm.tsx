"use client";
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardComponentHeading from "./DashboardComponentHeading";
import FormProgressBar from "../form/FormProgressBar";
import ProgressBarButtons from "../form/ProgressBarButtons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { progressBarAtom } from "@/recoil/atoms/progressBarAtom";
import { formSchema } from "@/validations/createOrganizationFormSchema";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import moment from "moment";
import { toast } from "sonner";
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";
import { hashPassword } from "@/authentication/organizationAuthentication";
import CreateOrganizationFormOne from "../form/organizationForm/CreateOrganizationFormOne";
import CreateOrganizationFormSecond from "../form/organizationForm/CreateOrganizationFormSecond";
import CreateOrganizationFormThree from "../form/organizationForm/CreateOrganizationFormThree";
import CreateOrganizationFormFour from "../form/organizationForm/CreateOrganizationFormFour";

interface CreateRoomProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}


export type FormValues = z.infer<typeof formSchema>;


const steps = [
    { id: "0", title: "Owner info" },
    { id: "1", title: "Org metadata" },
    { id: "2", title: "Preset channels" },
    { id: "3", title: "Security & privacy" },
];

export default function CreateOrganization({ open, setOpen }: CreateRoomProps) {
    const [currentStep, setCurrentStep] = useRecoilState(progressBarAtom);
    const session = useRecoilValue(userSessionAtom);
    const setOwnedOrganization = useSetRecoilState(userCreatedOrganizationAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, watch, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ownerName: session.user?.name!,
            ownerEmail: session.user?.email!,
            hasPassword: true
        }
    });


    useEffect(() => {
        if (session.user?.name && session.user?.email) {
            reset({ ownerName: session.user.name, ownerEmail: session.user.email });
        }
    }, [session.user?.name, session.user?.email, reset]);

    const renderComponent = () => {
        switch (currentStep) {
            case 0:
                return <CreateOrganizationFormOne control={control} errors={errors} />;
            case 1:
                return <CreateOrganizationFormSecond control={control} errors={errors} />;
            case 2:
                return <CreateOrganizationFormThree control={control} errors={errors} />;
            case 3:
                return <CreateOrganizationFormFour control={control} errors={errors} watch={watch} />
            default:
                return null;
        }
    };

    async function onSubmit(data: FormValues) {
        console.log(" called -- >");
        console.log(isSubmitting);
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (!session?.user?.token) {
                throw new Error("No authentication token found");
            }

            const processedData = { ...data };

            if ("password" in processedData) {
                processedData.password = hashPassword(processedData.password!);
            }

            const formData = new FormData();
            Object.entries(processedData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => formData.append(key, item));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            const response = await axios.post(`${ORGANIZATION}`, formData, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setOwnedOrganization((prev) => [response.data.data, ...prev]);
            toast.success("Organization created successfully!", {
                description: moment().format("dddd, MMMM D, YYYY")
            });

            setCurrentStep(1);
            reset();
            setOpen(false);
        } catch (error) {
            toast.error("Failed to create organization. Please try again.", {
                description: "Please check your input and try again."
            });
            console.error("Organization creation error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;
    return (
        <OpacityBackground onBackgroundClick={() => setOpen(false)}>
            <UtilityCard
                open={open}
                setOpen={setOpen}
                className="w-5/12 px-12 relative pt-8 pb-5 dark:bg-neutral-900 dark:border-neutral-600 border-[1px]"
            >
                <DashboardComponentHeading description="Start creating organization with your preferred choice">
                    Create Organization
                </DashboardComponentHeading>
                <form key={open.toString()} onSubmit={handleSubmit(onSubmit)}>
                    <FormProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} totalLevels={3} steps={steps} className="mt-8" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4"
                    >
                        {renderComponent()}
                    </motion.div>
                    <ProgressBarButtons isSubmitting={isSubmitting} currentLevel={currentStep} setCurrentLevel={setCurrentStep} totalLevels={3} className="w-full" />
                </form>
            </UtilityCard>
        </OpacityBackground>
    );
}
