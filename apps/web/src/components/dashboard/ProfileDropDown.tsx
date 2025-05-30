"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import LogOutDialogBox from "../utility/LogOutDialogBox";
import { FaGithub } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import AccountInfoDropDown from "../utility/AccountInfoDropDown";
import { handleClickOutside } from "@/lib/handleClickOutside";
import { Settings2 } from "lucide-react";
import { useSetRecoilState } from "recoil";
import { dashboardOptionsAtom, RendererOption } from "@/recoil/atoms/DashboardOptionsAtom";
import { settingsOptionAtom, settingsOptionEnum } from "@/recoil/atoms/SettingsOptionAtom";

export default function () {
    const [dropDown, setDropDown] = useState<boolean>(false);
    const [logoutDropdown, setLogoutDropDown] = useState<boolean>(false);
    const [accountInfoDropDown, setAccountInfoDropDown] = useState(false);
    const { data: session } = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const setDashboardOptions = useSetRecoilState(dashboardOptionsAtom);
    const setSettingOption = useSetRecoilState(settingsOptionAtom);

    function accountInfoHandler() {
        setAccountInfoDropDown(true);
        setDropDown(false);
    }

    function handleLogout() {
        setLogoutDropDown(true);
        setDropDown(false);
    }

    function handleOpenSettings() {
        setDashboardOptions(RendererOption.Settings);
        setSettingOption(settingsOptionEnum.Profile);
    }

    useEffect(() => {
        function clickHandler(event: MouseEvent) {
            handleClickOutside(event, dropdownRef, setDropDown);
        }

        if (dropDown) {
            document.addEventListener("mousedown", clickHandler);
            return () => {
                document.removeEventListener("mousedown", clickHandler);
            };
        }
    }, [dropDown]);

    return (
        <div ref={dropdownRef}>
            <div>
                {session?.user && (
                    <Image
                        onClick={() => setDropDown(prev => !prev)}
                        className="rounded-full select-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
                        src={session.user.image!}
                        width={32}
                        height={32}
                        alt="user"
                    />
                )}
            </div>

            {dropDown && (
                <div className="absolute border-[1px] border-neutral-700 cursor-pointer right-8 mt-2 w-48 font-light dark:bg-neutral-900 bg-white rounded-[4] shadow-lg ring-1 ring-black ring-opacity-5 select-none z-50 overflow-hidden">
                    <div>
                        <div className="px-4 py-[11px] text-xs font-normal text-gray-700 dark:text-neutral-100 border-b-[1px] border-neutral-700 cursor-default">My Profile</div>
                        <div className="px-4 py-[11px] text-xs font-extralight text-gray-700 dark:hover:bg-secDark hover:bg-gray-200 dark:text-neutral-100">Docs</div>
                        <div onClick={accountInfoHandler} className="px-4 py-[11px] text-xs font-extralight text-gray-700 dark:hover:bg-secDark hover:bg-gray-200 dark:text-neutral-100">Accounts Info</div>

                        <div
                            onClick={handleOpenSettings}
                            className="px-4 py-[11px] text-xs font-extralight text-gray-700 dark:hover:bg-secDark hover:bg-gray-200 dark:text-neutral-100 border-b-[1px] border-neutral-700 flex justify-between"
                        >
                            Settings
                            <Settings2 size={14} />
                        </div>
                        <a
                            href="https://github.com/kant-github/100xThreads"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-[11px] text-xs font-extralight text-gray-700 dark:hover:bg-secDark hover:bg-gray-200 dark:text-neutral-100 border-b-[1px] border-neutral-700 flex justify-between"
                        >
                            Github
                            <GithubSvg />
                        </a>
                        <div
                            onClick={handleLogout}
                            className="px-4 py-[11px] text-xs font-normal text-red-500 dark:hover:bg-secDark hover:bg-gray-200 flex justify-between"
                        >
                            Sign Out
                            <LogOutSvg />
                        </div>
                    </div>
                </div>
            )}
            {logoutDropdown && (
                <LogOutDialogBox
                    logoutDropdown={logoutDropdown}
                    setLogoutDropDown={setLogoutDropDown}
                />
            )}

            {
                accountInfoDropDown && (
                    <AccountInfoDropDown setAccountInfoDropDown={setAccountInfoDropDown} session={session!} />
                )
            }
        </div>
    );
}

function GithubSvg() {
    return (
        <FaGithub size={16} />
    );
}

function LogOutSvg() {
    return (
        <IoLogOutOutline size={16} />
    );
}
