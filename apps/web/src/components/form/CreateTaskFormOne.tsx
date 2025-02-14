
import { Control, Controller, FieldErrors } from "react-hook-form";
import { CreateTaskFormType } from "./CreateTaskForm";
import InputBox from "../utility/InputBox";

interface CreateTaskFormOneProps {
    control: Control<CreateTaskFormType>;
    errors: FieldErrors<CreateTaskFormType>;
}

export default function ({ control, errors }: CreateTaskFormOneProps) {
    return (
        <>
            <Controller
                control={control}
                name='title'
                render={({ field }) => (
                    <InputBox className="" onChange={field.onChange} label="Title" value={field.value} error={errors.title?.message} placeholder="Enter Task title" />
                )}
            />
            <Controller
                control={control}
                name='description'
                render={({ field }) => (
                    <InputBox className="" onChange={field.onChange} label="Description" value={field.value} error={errors.title?.message} placeholder="Enter Task Description" />
                )}
            />
        </>
    )
}