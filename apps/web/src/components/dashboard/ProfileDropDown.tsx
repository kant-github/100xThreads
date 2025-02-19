"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import LogOutDialogBox from "../utility/LogOutDialogBox";
import { ChatGroupType } from "types/types";
import { FaGithub } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import AccountInfoDropDown from "../utility/AccountInfoDropDown";
import { toast } from "sonner";
import { globalRoomHandler } from "@/lib/globalRoomHandler";
import { globalGroupId } from "./DashNav";
import { useRouter } from "next/navigation";
import { handleClickOutside } from "@/lib/handleClickOutside";


interface props {
    groups?: ChatGroupType[];
}

export default function UserMenu({ groups }: props) {
    const [dropDown, setDropDown] = useState<boolean>(false);
    const [logoutDropdown, setLogoutDropDown] = useState<boolean>(false);
    const [accountInfoDropDown, setAccountInfoDropDown] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    function accountInfoHandler() {
        setAccountInfoDropDown(true);
        setDropDown(false);
    }

    async function globalRoomButtonHandler() {

        if (!session?.user?.id) {
            toast.error("User not authenticated");
            return;
        }
        await globalRoomHandler(globalGroupId, session.user.id, router);
    }

    function handleLogout() {
        setLogoutDropDown(true);
        setDropDown(false);
    }

    useEffect(() => {

        const clickHandler = (event: MouseEvent) => {
            handleClickOutside(event, dropdownRef, setDropDown)
        }

        if (dropDown) {
            document.addEventListener("mousedown", clickHandler);
        } else {
            document.removeEventListener("mousedown", clickHandler);
        }

        return () => {
            document.removeEventListener("mousedown", clickHandler);
        };

    }, [dropDown, setDropDown]);

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
                <div className="absolute border-[1px] dark:border-zinc-800 cursor-pointer right-8 mt-2 w-36 font-light dark:bg-[#1c1c1c] bg-white rounded-[4] shadow-lg ring-1 ring-black ring-opacity-5 select-none z-50">
                    <div className="">
                        <div className="px-4 py-2 text-xs font-extralight text-gray-700 dark:hover:bg-[#262629] hover:bg-gray-200 dark:text-gray-200">Docs</div>
                        <div onClick={accountInfoHandler} className="px-4 py-2 text-xs font-extralight text-gray-700 dark:hover:bg-[#262629] hover:bg-gray-200 dark:text-gray-200">Accounts Info</div>
                        <div onClick={globalRoomButtonHandler} className="px-4 py-2 text-xs font-extralight text-gray-700 dark:hover:bg-[#262629] hover:bg-gray-200 dark:text-gray-200">Global Room</div>
                        <a
                            href="https://github.com/kant-github/chat-app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row justify-between px-4 py-2 text-xs text-blue-500 dark:text-blue-200 bg-blue-50 dark:bg-blue-600 dark:hover:bg-blue-500 hover:bg-blue-100"
                        >
                            Github
                            <GithubSvg />
                        </a>
                        <div
                            onClick={handleLogout}
                            className="flex justify-between px-4 py-2 text-xs text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-600 dark:hover:bg-red-500 hover:bg-red-100"
                        >
                            Logout
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
