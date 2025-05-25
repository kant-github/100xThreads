import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputBox from "@/components/utility/InputBox";
import { CreateLocationFormSchema } from "@/validations/createLocationFormSchema";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface LocationEventFormTwoProps {
    control: Control<CreateLocationFormSchema>;
    errors: FieldErrors<CreateLocationFormSchema>;
}

export default function LocationFormTwo({ control, errors }: LocationEventFormTwoProps) {
    return (
        <div className="flex flex-col gap-y-4">
            <Controller
                control={control}
                name="mode"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Event mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-secDark text-xs text-neutral-100">
                            <SelectItem value="OFFLINE">Offline</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
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
    );
}
