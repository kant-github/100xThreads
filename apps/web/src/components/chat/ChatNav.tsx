"use client";
import DarkMode from "../base/DarkMode";
import ProfileDropDown from "../dashboard/ProfileDropDown";
import AppLogo from "../heading/AppLogo";
import Version from "../buttons/Version";
import Greetings from "../utility/Greetings";


export default function () {
    return (
        <div className="flex bg-white dark:bg-[#171717] flex-row justify-between items-center w-full px-8 py-4 border-b dark:border-zinc-700 dark:shadow-[40px]">
            <div className="flex items-center gap-x-2">
                <AppLogo />
                <Version />
            </div>
            <div className="flex flex-row justify-center items-center gap-x-8">
                <Greetings/>
                <DarkMode />
                <ProfileDropDown />
            </div>
        </div>
    );
}
