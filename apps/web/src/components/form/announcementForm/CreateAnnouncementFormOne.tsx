import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateAnnouncementFormSchemaType } from "./CreateAnnouncementForm";
import InputBox from "@/components/utility/InputBox";
import React from "react";

interface CreateAnnouncementFormOneProps {
    control: Control<CreateAnnouncementFormSchemaType>;
    errors: FieldErrors<CreateAnnouncementFormSchemaType>;
}

export default function ({ errors, control }: CreateAnnouncementFormOneProps) {
    return (
        <div className="flex flex-col gap-y-3">
            <Controller
                name="creator_name"
                control={control}
                render={({ field }) => (
                    <InputBox
                        disable={true}
                        label="Creator's Name"
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
        </div>
    )
}