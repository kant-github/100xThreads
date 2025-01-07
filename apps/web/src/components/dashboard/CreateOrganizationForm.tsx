import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardComponentHeading from "./DashboardComponentHeading";
import FormProgressBar from "../form/FormProgressBar";
import ProgressBarButtons from "../form/ProgressBarButtons";
import FirstComponent from "../form/FirstComponent";
import SecondComponent from "../form/SecondComponent";
import ThirdComponent from "../form/ThirdComponent";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { progressBarAtom } from "@/recoil/atoms/progressBarAtom";
import { formSchema, hashPassword } from "@/validations/createOrganizationFormSchema";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { userSessionAtom } from "@/recoil/atoms/atom";
import moment from "moment";
import { toast } from "sonner";
import { userCreatedOrganizationAtom } from "@/recoil/atoms/organizationsAtom";

interface CreateRoomProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export type FormValues = z.infer<typeof formSchema>;

export default function ({ open, setOpen }: CreateRoomProps) {
    const [currentStep, setCurrentStep] = useRecoilState(progressBarAtom);
    const session = useRecoilValue(userSessionAtom);
    const setOwnedOrganization = useSetRecoilState(userCreatedOrganizationAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, watch, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ownerName: session.user?.name || "Your Name"
        }
    });

    useEffect(() => {
        if (session.user?.name) {
            reset({
                ownerName: session.user.name
            });
        }
    }, [session.user?.name, reset]);

    const renderComponent = () => {
        switch (currentStep) {
            case 1:
                return <FirstComponent control={control} errors={errors} />;
            case 2:
                return <SecondComponent control={control} errors={errors} />;
            case 3:
                return <ThirdComponent control={control} errors={errors} watch={watch} />;
            default:
                return null;
        }
    };

    const onSubmit = async (data: FormValues) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (!session?.user?.token) {
                throw new Error("No authentication token found");
            }

            const processedData = { ...data };

            if ('password' in processedData) {
                processedData.password = hashPassword(processedData.password!);
            }

            const formData = new FormData();

            Object.entries(processedData).forEach(([key, value]) => {

                if (key === 'image' && value instanceof FileList) {
                    const file = value.item(0);
                    if (file) {
                        formData.append('image', file);
                    }
                }
                else if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(key, item);
                    });
                }
                else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axios.post(`${ORGANIZATION}`, formData, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setOwnedOrganization(prev => [response.data.data, ...prev]);
            toast.success("Organization created successfully!", {
                description: moment().format("dddd, MMMM D, YYYY"),
            });
            setCurrentStep(1);
            reset();
            setOpen(false);

        } catch (error) {
            const errorMessage = "Failed to create organization. Please try again.";
            toast.error(errorMessage, {
                description: "Please check your input and try again.",
            });
            console.error("Organization creation error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return open ? (
        <OpacityBackground onBackgroundClick={() => setOpen(false)} >
            <UtilityCard open={open} setOpen={setOpen} className="w-5/12 px-12 relative pb-20 pt-8" >
                <DashboardComponentHeading description="start creating organization with your preferred choice" >
                    Create Organization
                </DashboardComponentHeading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ProgressBarButtons />
                    <FormProgressBar className="mt-8" />
                    {renderComponent()}
                </form>
            </UtilityCard>
        </OpacityBackground>
    ) : null;
}