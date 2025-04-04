import UtilityOptionMenuCard from "@/components/utility/UtilityOptionMenuCard";
import { Dispatch, SetStateAction } from "react";
import { AnnouncementType } from "types/types";

interface AnnouncementOptionMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    announcement: AnnouncementType;
}

export default function ({ announcement, open, setOpen }: AnnouncementOptionMenuProps) {
    return (
        <UtilityOptionMenuCard open={open} setOpen={setOpen}>
            <div>
                <div className={`absolute z-[100] flex flex-col items-start w-20 "right-0" rounded-[6px] text-[12px] overflow-hidden p-1 dark:bg-neutral-800 border-[0.5px] border-neutral-500`}>
                    <button type="button" className="px-3 py-1 w-full dark:hover:bg-[#2e2e2e] flex items-start rounded-[4px]">
                        Edit
                    </button>
                    <button type="button" className="px-3 py-1 hover:bg-red-600 w-full flex items-start rounded-[4px]" >
                        Delete
                    </button>
                </div>
            </div>
        </UtilityOptionMenuCard>
    )
}