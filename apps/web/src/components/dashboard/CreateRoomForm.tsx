import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardComponentHeading from "./DashboardComponentHeading";
import FormProgressBar from "../form/FormProgressBar";
import ProgressBarButtons from "../form/ProgressBarButtons";
import FirstComponent, { presetColors } from "../form/FirstComponent";
import SecondComponent from "../form/SecondComponent";
import ThirdComponent from "../form/ThirdComponent";
import { useRecoilValue } from "recoil";
import { progressBarAtom } from "@/recoil/atoms/progressBarAtom";


interface CreateRoomProps {
    open: boolean;
}

const formSchema = z.object({
    ownerName: z.string().min(1, "Can't be empty"),
    organizationName: z.string().min(1, "Can't be empty"),
    image: z
        .custom<FileList>()
        .optional()
        .refine(
            (files) => !files || files?.[0]?.type.startsWith("image/"),
            "Only image files are allowed"
        ),
    organizationColor: z.string().optional().refine(
        (color) => !color || presetColors.some((preset) => preset.value === color),
        "Invalid color selection"
    ),
});

export type FormValues = z.infer<typeof formSchema>;


export default function CreateRoom({ open }: CreateRoomProps) {
    const currentStep = useRecoilValue(progressBarAtom);
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    const renderComponent = () => {
        switch (currentStep) {
            case 1:
                return <FirstComponent control={control} errors={errors} />;
            case 2:
                return <SecondComponent control={control} errors={errors} />;
            case 3:
                return <ThirdComponent control={control} errors={errors} />;
            default:
                return null;
        }
    }

    const onSubmit = (data: FormValues) => {
        console.log("hi")
        console.log(data);
    };

    return (
        <>
            {open && (
                <OpacityBackground className="">
                    <UtilityCard className="w-5/12 px-12 relative pb-12 pt-8">
                        <ProgressBarButtons />
                        <DashboardComponentHeading description="start creating organization with your preferred choice">Create Organization</DashboardComponentHeading>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <FormProgressBar className="mt-8" />
                            {renderComponent()}
                        </form>
                    </UtilityCard>
                </OpacityBackground>
            )}
        </>
    );
}



// const handleOrganizationNameChangeDebounced = useCallback(
//     debounce(async (organizationName: string) => {

//         if (organizationName.length > 0) {
//             try {
//                 setIsLoading(true);
//                 const data = await axios.get(`${ORGANIZATION}-by-search`, {
//                     headers: {
//                         authorization: `Bearer ${session?.user?.token}`,
//                     },
//                     params: {
//                         name: organizationName
//                     }
//                 })
//                 console.log("data is : ", data.data.exists);
//                 setOrganizationNameAvailable(data.data.exists);
//             } catch (err) {
//                 console.error("Error checking organization name", err);
//                 setOrganizationNameAvailable(false);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     }, 500), [session]
// )

// const handleOrganizationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newOrganizationName = e.target.value;
//     setOrganizationName(newOrganizationName);
//     handleOrganizationNameChangeDebounced(newOrganizationName);
// };
