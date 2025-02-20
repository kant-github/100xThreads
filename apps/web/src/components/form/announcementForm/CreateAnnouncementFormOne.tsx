import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateAnnouncementFormSchemaType } from "./CreateAnnouncementForm";
import InputBox from "@/components/utility/InputBox";

interface CreateAnnouncementFormOneProps {
    control: Control<CreateAnnouncementFormSchemaType>;
    errors: FieldErrors<CreateAnnouncementFormSchemaType>;
}

export default function ({ errors, control }: CreateAnnouncementFormOneProps) {
    return (
        <>
            <Controller
                name="creator_name"
                control={control}
                render={({ field }) => (
                    <InputBox
                        disable={true}
                        label="Owner's Name"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.creator_name?.message}
                    />
                )}
            />
            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <InputBox
                        label={"Title"}
                        placeholder="Enter announcement title"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.title?.message}
                    />
                )}
            />
        </>
    )
}