import InputBox from "@/components/utility/InputBox";
import { CreateLocationFormSchema } from "@/validations/createLocationFormSchema";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface LocationEventfFormOneProps {
    control: Control<CreateLocationFormSchema>;
    errors: FieldErrors<CreateLocationFormSchema>
}

export default function LocationFormOne({ control, errors }: LocationEventfFormOneProps) {
    return (
        <div className="flex flex-col gap-y-3">
            <div className="flex flex-row gap-x-3">
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <InputBox
                            label="Choose a name"
                            placeholder="name for location"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.name?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                        <InputBox
                            label="City"
                            placeholder="Choose city"
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
            <Controller
                control={control}
                name="address"
                render={({ field }) => (
                    <InputBox
                        label="Address"
                        placeholder="Enter venue address"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />

        </div>
    )
}