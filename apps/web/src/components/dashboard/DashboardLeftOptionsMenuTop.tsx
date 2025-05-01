import { GoHomeFill } from "react-icons/go";
import { FaIndustry } from "react-icons/fa6";
import { IoMdBody, IoMdSettings, IoIosNotifications } from "react-icons/io";
import ProfileOption from "../ui/ProfileOption";
import { useRecoilState } from "recoil";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";
import { FaUserFriends } from "react-icons/fa";
import { useState } from "react";
import UtilitySideBar from "../utility/UtilitySideBar";
import DashboardComponentHeading from "./DashboardComponentHeading";
import OrganizationNotificationsRenderer from "../notifications/Notifications";

export const baseDivStyles = "flex items-center justify-start gap-x-2 sm:gap-x-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[13px] text-lightText dark:text-neutral-100 font-normal mt-0.5 tracking-wide hidden sm:block";

function Option({ isSelected, onClick, Icon, label }: {
    isSelected?: boolean;
    onClick: () => void;
    Icon: React.ComponentType<{ size: number }>;
    label: string;
}) {
    return (
        <div onClick={onClick} className={`${baseDivStyles} ${isSelected ? "dark:bg-neutral-700 bg-[#d9d3cc] dark:text-darkText text-lightText" : "dark:hover:bg-neutral-800 hover:bg-secondLight"}`}>
            <Icon size={16} className="sm:hidden" />
            <Icon size={18} className="hidden sm:block" />
            <span className={`${textStyles}`}>{label}</span>
        </div>
    );
}

export default function () {
    const [renderOption, setRenderOption] = useRecoilState(dashboardOptionsAtom);
    const [friendOptionMenu, setFriendOptionMenu] = useState<boolean>(false);
    const [notificationMenu, setNotificationMenu] = useState<boolean>(false);
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
                    isSelected={renderOption === RendererOption.Notification}
                    onClick={() => setNotificationMenu(prev => !prev)}
                    Icon={IoIosNotifications}
                    label="Notifications"
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
                    onClick={() => setFriendOptionMenu(prev => !prev)}
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
                bottomLogo={true}
                width="3/12"
                open={friendOptionMenu}
                setOpen={setFriendOptionMenu}
                content={
                    <DashboardComponentHeading className="pt-4 sm:pt-6 pl-4 sm:pl-8" description="check list of friends you made" >
                        Friends
                    </DashboardComponentHeading>
                }
            />
            <OrganizationNotificationsRenderer open={notificationMenu} setOpen={setNotificationMenu} />
        </div>
    );
}