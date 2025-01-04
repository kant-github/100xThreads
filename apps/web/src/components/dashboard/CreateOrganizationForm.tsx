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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { progressBarAtom } from "@/recoil/atoms/progressBarAtom";
import { formSchema } from "@/validations/createOrganizationFormSchema";
import { Dispatch, SetStateAction, useState } from "react";
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

export default function CreateRoom({ open, setOpen }: CreateRoomProps) {
    const currentStep = useRecoilValue(progressBarAtom);
    const session = useRecoilValue(userSessionAtom);
    const setOwnedOrganization = useSetRecoilState(userCreatedOrganizationAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, watch, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    });

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

            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else {
                    formData.append(key, String(value));
                }
            });

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