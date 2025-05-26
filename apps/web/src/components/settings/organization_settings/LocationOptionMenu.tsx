import UtilityOptionMenuCard from "@/components/utility/UtilityOptionMenuCard";
import { Dispatch, SetStateAction } from "react";
import { OrganizationLocationTypes } from "types/types";

interface LocationOptionMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleDeleteLocation: (locationId: string) => void
    location: OrganizationLocationTypes;
}

export default function LocationOptionMenu({ open, setOpen, handleDeleteLocation, location }: LocationOptionMenuProps) {

    return (
        <UtilityOptionMenuCard
            className="absolute top-full right-full  mt-1 z-50 bg-secDark"
            open={open}
            setOpen={setOpen}
        >
            <div>
                <div className={`absolute z-[100] flex flex-col items-start w-20 rounded-[6px] text-[12px] overflow-hidden p-1 dark:bg-neutral-800 border-[0.5px] border-neutral-500 text-neutral-100`}>
                    <button type="button" className="px-3 py-1 w-full dark:hover:bg-[#2e2e2e] flex items-start rounded-[4px]">
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteLocation(location.id)}
                        type="button"
                        disabled={location.mode === 'ONLINE'}
                        className={`
    px-3 py-1 w-full flex items-start rounded-[4px]
    ${location.mode === 'ONLINE'
                                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                : 'hover:bg-red-600 text-red-500 dark:hover:text-white cursor-pointer'}
  `}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </UtilityOptionMenuCard>
    )
}