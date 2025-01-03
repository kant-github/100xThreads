import { GoHomeFill } from "react-icons/go";
import { FaIndustry } from "react-icons/fa6";
import { IoMdBody, IoMdSettings } from "react-icons/io";
import ProfileOption from "../ui/ProfileOption";
import { useRecoilState } from "recoil";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";
import { FaUserFriends } from "react-icons/fa";
import { useState } from "react";
import UtilitySideBar from "../utility/UtilitySideBar";
import DashboardComponentHeading from "./DashboardComponentHeading";

export const baseDivStyles = "flex items-center justify-start gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[13px] text-gray-100 dark:text-[#d6d6d6] font-normal mt-0.5 tracking-wide hidden sm:block";

function Option({ isSelected, onClick, Icon, label }: {
    isSelected?: boolean;
    onClick: () => void;
    Icon: React.ComponentType<{ size: number }>;
    label: string;
}) {
    return (
        <div onClick={onClick} className={`${baseDivStyles} ${isSelected ? "bg-zinc-700 text-white" : "hover:bg-zinc-800"}`}>
            <Icon size={16} className="sm:hidden" />
            <Icon size={18} className="hidden sm:block" />
            <span className={`${textStyles}`}>{label}</span>
        </div>
    );
}

export default function () {
    const [renderOption, setRenderOption] = useRecoilState(dashboardOptionsAtom);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="h-auto sm:h-24 py-1 sm:py-2 rounded-[8px]">
            <ProfileOption />
            <div className="flex flex-row sm:flex-col justify-around sm:justify-start sm:mt-3 gap-x-1">
                <Option
                    isSelected={renderOption === RendererOption.Home}
                    onClick={() => setRenderOption(RendererOption.Home)}
                    Icon={GoHomeFill}
                    label="Home"
                />
                <Option
                    isSelected={renderOption === RendererOption.OwnedByYou}
                    onClick={() => setRenderOption(RendererOption.OwnedByYou)}
                    Icon={IoMdBody}
                    label="Owned by you"
                />
                <Option
                    isSelected={renderOption === RendererOption.AllOrganization}
                    onClick={() => setRenderOption(RendererOption.AllOrganization)}
                    Icon={FaIndustry}
                    label="All Organizations"
                />
                <Option
                    onClick={() => setOpen(prev => !prev)}
                    Icon={FaUserFriends}
                    label="Friends"
                />
                <Option
                    isSelected={renderOption === RendererOption.Settings}
                    onClick={() => setRenderOption(RendererOption.Settings)}
                    Icon={IoMdSettings}
                    label="Settings"
                />
            </div>
            <UtilitySideBar
                open={open}
                setOpen={setOpen}
                content={
                    <DashboardComponentHeading
                        className="pt-4 sm:pt-6 pl-4 sm:pl-8"
                        description="check list of friends you made"
                    >
                        Friends
                    </DashboardComponentHeading>
                }
            />
        </div>
    );
}