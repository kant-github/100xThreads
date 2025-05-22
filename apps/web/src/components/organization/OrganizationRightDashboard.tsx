import { useState } from 'react';
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom"
import { CiAlignRight } from "react-icons/ci";
import { MdAirplanemodeActive } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { OrganizationUsersType } from "types/types"
import ProfileOption from "../ui/ProfileOption";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";
import OrganizationRolesTickerRenderer from "../utility/tickers/organization_roles_tickers/OrganizationRolesTickerRenderer";
import OptionImage from "../ui/OptionImage";
import Image from 'next/image';
import OrganizationNotificationsRenderer from '../notifications/Notifications';
import { selectedChannelIdAtom } from '@/recoil/atoms/organizationAtoms/organizationDashboardManagement';

const baseDivStyles = "flex items-center justify-between gap-x-2 sm:gap-x-3 py-1.5 sm:py-1 px-2 sm:px-3 rounded-[8px] cursor-pointer select-none";
const textStyles = "text-[12px] sm:text-[12px] text-gray-100 dark:text-[#d6d6d6] font-semibold mt-0.5 tracking-wide hidden sm:block";

export default function () {
    const [isExpanded, setIsExpanded] = useState(true);
    const [notificatioPanel, setNotificationPanel] = useState<boolean>(false);
    const organizationUsers = useRecoilValue<OrganizationUsersType[]>(organizationUsersAtom);
    const setSelectedChannelId = useSetRecoilState(selectedChannelIdAtom);
    function toggleSidebar() {
        setIsExpanded(!isExpanded);
    };

    function notificationPanelHandler() {
        setNotificationPanel(true);
    }

    function openSettingHandler() {
        console.log("tapped");
        setSelectedChannelId('org_settings');
    }

    return (
        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'w-[30%]' : 'w-[120px]'} h-screen overflow-hidden bg-white dark:bg-neutral-900  border-b-[1px] md:border-b-0 md:border-l-[1px] dark:border-zinc-800 flex flex-col justify-between`}>
            <div className='flex flex-col gap-y-2 px-4 pt-4'>
                <div className={`flex flex-row items-center ${isExpanded ? 'justify-between px-4' : 'justify-center'} pb-2`}>
                    <CiAlignRight
                        size={20}
                        className={`text-neutral-100 cursor-pointer transform transition-transform ${isExpanded ? '' : 'rotate-180'}`}
                        onClick={toggleSidebar}
                    />
                    {isExpanded && <IoIosNotifications onClick={notificationPanelHandler} size={20} className="text-neutral-100 cursor-pointer" />}
                    {isExpanded && <IoMdSettings onClick={openSettingHandler} size={18} className="text-neutral-100 cursor-pointer" />}
                    {isExpanded && <MdAirplanemodeActive size={18} className="text-neutral-100" />}
                </div>

                {isExpanded && <ProfileOption />}
                <div className={`flex flex-col justify-start gap-y-2 rounded-[14px] bg-forDark overflow-hidden`}>
                    {
                        organizationUsers.map((user) => (
                            <Option
                                key={user.id}
                                user={user}
                                isExpanded={isExpanded}
                            />
                        ))
                    }
                </div>

                <OrganizationNotificationsRenderer open={notificatioPanel} setOpen={setNotificationPanel} />
            </div>
        </div>
    )
}

function Option({ isSelected, onClick, user, isExpanded }: {
    isSelected?: boolean;
    onClick?: () => void;
    user: OrganizationUsersType;
    isExpanded: boolean;
}) {
    const organization = useRecoilValue(organizationAtom);
    return (

        <OptionImage
            content={
                <div onClick={onClick} style={{ ['--hover-color' as string]: `${organization?.organizationColor}66` }}
                    className={`${isExpanded ? baseDivStyles : 'flex justify-center items-center py-1.5'} ${isSelected
                        ? "bg-zinc-700 text-white"
                        : "transition-colors duration-200"
                        } hover:[background-color:var(--hover-color)]`} >
                    <div className={`flex items-center ${isExpanded ? 'gap-x-2' : ''}`}>
                        <span className="relative shrink-0 w-8 h-8">
                            <span className="bg-green-500 absolute bottom-1 right-1 translate-x-1/4 translate-y-1/4 rounded-full border-2 border-zinc-800 z-10 h-2.5 w-2.5"/>
                            <Image
                                src={user.user.image || '/default-avatar.png'}
                                alt={`${user.user.name}'s profile picture`}
                                fill
                                className="rounded-full object-cover"
                            />
                        </span>

                        {isExpanded && <span className={`${textStyles}`}>{user.user.name}</span>}
                    </div>

                    {isExpanded && <OrganizationRolesTickerRenderer tickerText={user.role} />}
                </div>
            }
            userId={user.user_id}
            organizationId={organization?.id!}
        />

    );
}