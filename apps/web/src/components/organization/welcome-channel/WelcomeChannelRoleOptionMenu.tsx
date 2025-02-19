import UtilityOptionMenuCard from "@/components/utility/UtilityOptionMenuCard";
import { Dispatch, SetStateAction } from "react";

interface WelcomeChannelRoleOptionMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const UserRoleArray = [
    'ADMIN',
    'EVENT_MANAGER',
    'MODERATOR',
    'MEMBER',
    'GUEST',
    'ORGANIZER',
    'OBSERVER',
    'IT_SUPPORT',
    'HR_MANAGER',
    'FINANCE_MANAGER'
]

export default function ({ open, setOpen }: WelcomeChannelRoleOptionMenuProps) {

    return (
        <UtilityOptionMenuCard className="" open={open} setOpen={setOpen}>
            <div className={`absolute z-[100] flex flex-col items-start "right-0" rounded-[6px] text-[12px] overflow-hidden p-1 dark:bg-neutral-800 border-[0.5px] border-neutral-500`}>
                {
                    UserRoleArray.map((role) => (
                        <button type="button" className="px-3 py-1.5 w-full dark:hover:bg-[#2e2e2e] flex items-start rounded-[4px]">
                            {role}
                        </button>
                    ))
                }
            </div>
        </UtilityOptionMenuCard >
    )
}