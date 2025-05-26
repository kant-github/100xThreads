import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { organizationLocationsAtom } from "@/recoil/atoms/organizationAtoms/organizationLocation/organizationLocationsAtom";
import { CreateEventFormSchema } from "@/validations/createEventFormSchema"
import Image from "next/image";
import { Control, Controller, FieldErrors } from "react-hook-form"
import { useRecoilValue } from "recoil";

interface CalendarEventfFormTwoProps {
    control: Control<CreateEventFormSchema>;
    errors: FieldErrors<CreateEventFormSchema>;
}

export default function CalendarEventfFormThree({ control, errors }: CalendarEventfFormTwoProps) {
    const organizationLocation = useRecoilValue(organizationLocationsAtom);

    return (
        <>
            <Controller
                control={control}
                name="location"
                render={({ field }) => {
                    const selectedLocation = organizationLocation.find(loc => loc.id === field.value);
                    const isOnlineMode = selectedLocation?.mode === 'ONLINE';

                    return (
                        <div className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex-1">
                                <label htmlFor="location-select" className="text-[12px] ml-1 font-light tracking-wider text-gray-700 dark:text-gray-200 block mb-1">
                                    Choose location
                                </label>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full" id="location-select">
                                        <SelectValue placeholder="Location" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-secDark">
                                        {organizationLocation.map((location) => (
                                            <SelectItem
                                                className="text-neutral-100"
                                                key={location.id}
                                                value={location.id}
                                            >
                                                {location.name}
                                                {location.address && ` - ${location.address}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {isOnlineMode && (
                                <span className="flex items-center justify-center mt-6">
                                    <Image
                                        src="/images/google-meet.png"
                                        height={28}
                                        width={28}
                                        alt="Google Meet"
                                        className="object-contain"
                                    />
                                </span>
                            )}
                        </div>
                    );
                }}
            />

            {errors.location && (
                <p className="text-sm text-red-500 mt-1 ml-1">
                    {errors.location.message}
                </p>
            )}
        </>
    )
}