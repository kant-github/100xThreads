"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import LogOutDialogBox from "../utility/LogOutDialogBox";
import MyRooms from "./MyRooms";
import { GroupChatType } from "types";
import { FaGithub } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

interface props {
    groups?: GroupChatType[];
}

export default function UserMenu({ groups }: props) {
    const [dropDown, setDropDown] = useState<boolean>(false);
    const [logoutDropdown, setLogoutDropDown] = useState<boolean>(false);
    const [myRoomDropdown, setMyRoomDropDown] = useState<boolean>(false);
    const { data: session } = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropDown(false);
        }
    };

    function handleLogout() {
        setLogoutDropDown(true);
        setDropDown(false);
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                <div className="absolute border-[1px] dark:border-zinc-800 cursor-pointer right-8 mt-2 w-36 font-light dark:bg-[#1c1c1c] bg-white rounded-[4] shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <div className="block px-4 py-2 text-xs font-thin text-gray-700 dark:text-gray-200">
                            <i>Hi {session?.user?.name?.split(" ")[0]}</i>
                        </div>
                        <hr className="border-gray-300 dark:border-gray-700" />

                        <div
                            onClick={() => {
                                setDropDown(false);
                                setMyRoomDropDown(true);
                            }}
                            className="px-4 py-2 text-[12px] font-extralight text-gray-700 dark:hover:bg-[#262629] hover:bg-gray-200 dark:text-gray-200"
                        >
                            My rooms
                        </div>
                        <a
                            href="https://github.com/kant-github/chat-app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row justify-between px-4 py-2 text-xs text-blue-400 dark:text-blue-300 bg-blue-50 dark:bg-blue-600 dark:hover:bg-blue-500 hover:bg-blue-100"
                        >
                            Github
                            <GithubSvg />
                        </a>
                        <div
                            onClick={handleLogout}
                            className="flex justify-between px-4 py-2 text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-600 dark:hover:bg-red-500 hover:bg-red-100"
                        >
                            Logout
                            <LogOutSvg />
                        </div>
                    </div>
                </div>
            )}
            <MyRooms
                myRoomDropdown={myRoomDropdown}
                setMyRoomDropDown={setMyRoomDropDown}
                groups={groups!}
            />
            {logoutDropdown && (
                <LogOutDialogBox
                    logoutDropdown={logoutDropdown}
                    setLogoutDropDown={setLogoutDropDown}
                />
            )}
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
