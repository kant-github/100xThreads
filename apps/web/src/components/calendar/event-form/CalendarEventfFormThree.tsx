import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Checkbox from "@/components/utility/CheckBox";
import OrganizationTagTicker from "@/components/utility/tickers/OrganizationTagTicker";
import { cn } from "@/lib/utils";
import { organizationLocationsAtom } from "@/recoil/atoms/organizationAtoms/organizationLocation/organizationLocationsAtom";
import { organizationTagsAtom } from "@/recoil/atoms/tags/organizationTagsAtom";
import { CreateEventFormSchema } from "@/validations/createEventFormSchema";
import Image from "next/image";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { motion } from 'framer-motion'
import ToolTipComponent from "@/components/ui/ToolTipComponent";
import { IoIosInformationCircleOutline } from "react-icons/io";

interface CalendarEventfFormTwoProps {
    control: Control<CreateEventFormSchema>;
    errors: FieldErrors<CreateEventFormSchema>;
}

export default function CalendarEventfFormThree({ control, errors }: CalendarEventfFormTwoProps) {
    const organizationLocation = useRecoilValue(organizationLocationsAtom);
    const organizationTags = useRecoilValue(organizationTagsAtom);

    return (
        <>
            <Controller
                control={control}
                name="location"
                render={({ field }) => {
                    const selectedLocation = organizationLocation.find(loc => loc.id === field.value);
                    const isOnlineMode = selectedLocation?.mode === "ONLINE";

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

            <Controller
                name="linkedTags"
                control={control}
                render={({ field }) => {
                    const { value = [], onChange } = field;

                    const toggleTag = (tagId: string) => {
                        if (value.includes(tagId)) {
                            onChange(value.filter((id) => id !== tagId));
                        } else {
                            onChange([...value, tagId]);
                        }
                    };

                    return (
                        <div className="mt-4">

                            <div className='flex justify-between items-center w-full'>
                                <label className="text-[12px] ml-1 font-light tracking-wider text-gray-700 dark:text-gray-200 block mb-2">
                                    Choose user tags
                                </label>
                                <ToolTipComponent content={<span>Only users with the selected tags will be notified about this event</span>}><IoIosInformationCircleOutline size={25} className="hover:text-primary/70 p-[3px] rounded-[4px] text-primary transition-colors ease-in" /></ToolTipComponent>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="z-10 w-48 max-h-[9rem] overflow-y-auto px-4 flex flex-col gap-y-2 pt-2 pb-2 dark:bg-neutral-900 dark:border-neutral-600 border-[1px] rounded-[8px] scrollbar-hide"
                            >
                                {organizationTags.map((tag, index) => (
                                    <div
                                        key={tag.id}
                                        className={cn(
                                            "text-xs w-full pb-1 cursor-pointer",
                                            "flex items-center justify-start gap-x-2",
                                            index !== organizationTags.length - 1 && "border-b border-neutral-700"
                                        )}
                                    >
                                        <Checkbox
                                            checked={value.includes(tag.id)}
                                            onChange={() => toggleTag(tag.id)}
                                        />
                                        <OrganizationTagTicker tag={tag} />
                                    </div>
                                ))}
                            </motion.div>
                            {errors.linkedTags && (
                                <p className="text-xs text-red-500 mt-2 ml-2">
                                    {errors.linkedTags.message}
                                </p>
                            )}
                        </div>
                    );
                }}
            />
        </>
    );
}
