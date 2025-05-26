import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { organizationLocationsAtom } from '@/recoil/atoms/organizationAtoms/organizationLocation/organizationLocationsAtom';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { LocationMode, OrganizationLocationTypes } from 'types/types';
import { MapPinIcon, Plus } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import LocationForm from '@/components/form/locationForm/LocationForm';
import { BsThreeDotsVertical } from "react-icons/bs";

interface OrganizationSettingsLocationUIProps { }

export default function OrganizationSettingsLocationUI() {
    const [openAddLocationDropdown, setAddLocationDropdown] = useState<boolean>(false);
    const [organizationLocations, setOrganizationLocations] = useRecoilState(organizationLocationsAtom);
    console.log("orgazanition locations are : ", organizationLocations);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col gap-y-2 h-full"
        >
            <div className='flex justify-end w-full'>
                <div className='flex items-center justify-center gap-x-4 relative'>
                    <div className="relative">
                        <Button
                            className="flex items-center justify-center gap-x-2 border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300"
                            onClick={() => {
                                setAddLocationDropdown(true);
                            }}
                            variant={"outline"}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add location
                        </Button>
                        {openAddLocationDropdown && (
                            <div className="absolute top-full right-0 mt-2 z-50">
                                <LocationForm
                                    open={openAddLocationDropdown}
                                    setOpen={setAddLocationDropdown}
                                />
                            </div>
                        )}
                    </div>
                    <div className="relative w-full max-w-xs">
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            className={cn(
                                `pl-8 pr-2 py-1 text-xs font-light text-neutral-100 placeholder:text-neutral-100 placeholder:text-xs`,
                                `outline-none border border-neutral-700 rounded-[8px]`,
                                `w-full`
                            )}
                            placeholder="Search location"
                        />
                    </div>
                </div>
            </div>
            <div className="h-full overflow-y-auto p-4 space-y-4 bg-secDark rounded-[10px] border-[1px] dark:border-neutral-700 scrollbar-hide">
                {
                    organizationLocations.map((location: OrganizationLocationTypes) => (
                        <Option key={location.id || location.name} className='group'>
                            <div className='flex gap-x-3 items-center'>
                                {location.mode === LocationMode.ONLINE ? (
                                    <Image
                                        src="/images/google-meet.png"
                                        height={32}
                                        width={32}
                                        alt="Google Meet"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-[#ff4a4a] flex items-center justify-center text-sm font-medium text-neutral-950">
                                        {location.name[0]}
                                    </div>
                                )}

                                <span className='dark:text-neutral-100'>
                                    {location.name}
                                </span>
                            </div>
                            <div className='flex items-center justify-center gap-x-4'>
                                {
                                    location.address && (
                                        <span className="flex items-center text-neutral-500 text-sm gap-1 underline">
                                            <MapPinIcon className="h-3.5 w-3.5 text-red-500" />
                                            {location.address}
                                        </span>
                                    )
                                }

                                <span className={`px-2 py-1 rounded-[8px] text-xs font-medium border ${location.mode === 'ONLINE'
                                    ? 'bg-green-500/10 border-green-600 text-green-600'
                                    : 'bg-gray-500/20 border-gray-600 text-gray-600'}`}>
                                    {location.mode === 'ONLINE' ? 'Online' : 'Offline'}
                                </span>
                                <BsThreeDotsVertical   className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 text-neutral-100" />
                            </div>
                        </Option>
                    ))
                }
            </div>
        </motion.div>
    );
}

interface OptionProps {
    children: React.ReactNode;
    className?: string;
}

function Option({ children, className }: OptionProps) {
    return (
        <div
            className={`bg-terDark rounded-xl p-4 py-6 shadow text-sm font-medium flex justify-between items-center ${className}`}
        >
            {children}
        </div>
    )
}