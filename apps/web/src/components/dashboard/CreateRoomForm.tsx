import { Dispatch, SetStateAction, useCallback, useState } from "react";
import InputBox from "../utility/InputBox";
import BigBlackButton from "../buttons/BigBlackButton";
import PhotoUploadIcon from "../ui/PhotoUploadIcon";
import CrossButton from "../utility/CrossButton";
import Spinner from "../loaders/Spinner";
import RemoveIconCrossButton from "../ui/RemoveIconCrossButton";
import SelectBox from "../utility/SelectBox";
import CheckBox from "../utility/CheckBox";
import { IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";
import { ORGANIZATION } from "@/lib/apiAuthRoutes";
import { CustomSession } from "app/api/auth/[...nextauth]/options";
import InputBoxCalls from "../utility/InputBoxCalls";
import { debounce } from "@/lib/debounce";
import TermsAndCondition from "../utility/TermsAndCondition";
import { FaUser } from "react-icons/fa6";
import { OrganizationType } from "./CreateChatCard";
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";
import { FileUpload } from "../ui/file-upload";
import { z } from "zod"
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardComponentHeading from "./DashboardComponentHeading";
import FormProgressBar from "../utility/FormProgressBar";

interface SelectedGroups {
    generalChat: boolean;
    adminPage: boolean;
    projectsChannel: boolean;
    events: boolean;
    announcements: boolean;
}

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
        )
});

type FormValues = z.infer<typeof formSchema>;


export default function CreateRoom({ open }: CreateRoomProps) {

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = (data: FormValues) => {
        console.log("hi")
        console.log(data);
    };

    return (
        <>
            {open && (
                <OpacityBackground className="">
                    <UtilityCard className="w-5/12 px-12">
                        <DashboardComponentHeading description="start creating organization with your preferred choice">Create Organization</DashboardComponentHeading>
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <FormProgressBar />
                            <div>
                                <div className="flex flex-row items-center justify-center mt-4">
                                    <Controller
                                        name="image"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.image?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="ownerName"
                                        control={control}
                                        render={({ field }) => (
                                            <InputBox
                                                label="owner's name"
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.ownerName?.message}
                                            />
                                        )}
                                    />

                                </div>
                                <div className="flex flex-row items-center justify-start gap-x-2 mt-2">
                                    <span className="px-3 py-2 mt-4 border-zinc-600 bg-zinc-900 text-xs text-zinc-400">/orgs/</span>
                                    <Controller
                                        name="organizationName"
                                        control={control}
                                        render={({ field }) => (
                                            <InputBox
                                                label="organization's name"
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.organizationName?.message}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded"> Submit</button>
                            </div>
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
