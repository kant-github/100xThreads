import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputBox from "@/components/utility/InputBox";
import { CreateLocationFormSchema } from "@/validations/createLocationFormSchema";
import Image from "next/image";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface LocationEventFormTwoProps {
    control: Control<CreateLocationFormSchema>;
    errors: FieldErrors<CreateLocationFormSchema>;
}

export default function LocationFormTwo({ control, errors }: LocationEventFormTwoProps) {
    return (
        <div className="flex flex-col gap-y-4">
            {/* <Controller
                control={control}
                name="mode"
                render={({ field }) => (
                    <div className="flex items-center justify-between gap-x-8 w-full">
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Event mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-secDark text-xs text-neutral-100">
                                <SelectItem value="OFFLINE">Offline</SelectItem>
                                <SelectItem value="ONLINE">Online</SelectItem>
                            </SelectContent>
                        </Select>
                        {field.value === 'ONLINE' && (
                            <div>
                                <Image
                                    src="/images/google-meet.png"
                                    height={45}
                                    width={45}
                                    alt="Google Meet"
                                />
                            </div>
                        )}
                        {field.value === 'OFFLINE' && (
                            <div className="bg-gray-500/20 border-gray-600 text-gray-600 px-2 py-1 rounded-[8px] text-xs font-medium border">
                                Offline
                            </div>
                        )}
                    </div>
                )}
            /> */}
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
