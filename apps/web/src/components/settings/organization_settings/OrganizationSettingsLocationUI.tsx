import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { organizationLocationsAtom } from '@/recoil/atoms/organizationAtoms/organizationLocation/organizationLocationsAtom';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LocationMode, OrganizationLocationTypes } from 'types/types';
import { MapPinIcon, Plus } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import LocationForm from '@/components/form/locationForm/LocationForm';
import { BsThreeDotsVertical } from "react-icons/bs";
import LocationOptionMenu from './LocationOptionMenu';
import axios from 'axios';
import { ORGANIZATION_SETTINGS } from '@/lib/apiAuthRoutes';
import { userSessionAtom } from '@/recoil/atoms/atom';
import { organizationIdAtom } from '@/recoil/atoms/organizationAtoms/organizationAtom';

export default function OrganizationSettingsLocationUI() {
    const [openAddLocationDropdown, setAddLocationDropdown] = useState<boolean>(false);
    const [organizationLocations, setOrganizationLocation] = useRecoilState(organizationLocationsAtom);
    const session = useRecoilValue(userSessionAtom);
    const organizationId = useRecoilValue(organizationIdAtom);

    async function handleDeleteLocation(locationId: string) {
        try {
            const { data } = await axios.delete(`${ORGANIZATION_SETTINGS}/location/${organizationId}/${locationId}`, {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`
                }
            })
            if (data.flag === 'SUCCESS') {
                setOrganizationLocation(prev => prev.filter(location => location.id !== locationId));
            }
        } catch (err) {
            console.error("Error while deleting location id");
        }
    }

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
                        <Option handleDeleteLocation={handleDeleteLocation} key={location.id || location.name} className='group' location={location} />
                    ))
                }
            </div>
        </motion.div>
    );
}

interface OptionProps {
    className?: string;
    location: OrganizationLocationTypes;
    handleDeleteLocation: (locationId: string) => void
}

function Option({ className, location, handleDeleteLocation }: OptionProps) {
    const [locationOptionMenu, setLocationOptionMenu] = useState<boolean>(false);



    return (
        <div
            className={`bg-neutral-900 rounded-xl p-4 py-4 shadow text-sm font-medium flex justify-between items-center ${className}`}
        >
            <div className='flex gap-x-3 items-center'>
                {location.mode === LocationMode.ONLINE ? (
                    <Image
                        src="/images/google-meet.webp"
                        height={32}
                        width={32}
                        // quality={100}
                        unoptimized
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
            <div className='flex items-center justify-center gap-x-4 relative'>
                {
                    location.address && (
                        <span className="flex items-center text-neutral-500 text-xs gap-1 underline">
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
                <BsThreeDotsVertical
                    onClick={() => setLocationOptionMenu(true)}
                    className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 text-neutral-100 cursor-pointer"
                />
                {locationOptionMenu && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                        <LocationOptionMenu
                            location={location}
                            open={locationOptionMenu}
                            setOpen={setLocationOptionMenu}
                            handleDeleteLocation={handleDeleteLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}