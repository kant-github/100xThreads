import Image from "next/image";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { useEffect, useState } from "react";

export default function () {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setTheme(systemTheme);
        }
    }, []);

    useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        } else if (theme === "dark") {
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");
        } else if (theme === "system") {
            document.documentElement.classList.remove("light", "dark");
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.add("light");
            }
        }
    }, [theme])

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
    }

    return (
        <div className="text-zinc-100 pl-8 py-6 w-full">
            <DashboardComponentHeading description="Choose your preferred theme for a personalized experience.">Theme</DashboardComponentHeading>
            <div className="mt-4 flex flex-row justify-around">
                <div onClick={() => handleThemeChange("light")} className="flex flex-col items-center gap-y-2">
                    <Image
                        className={`${theme === 'light' && "border-[4px] border-blue-500 transform scale-105"} rounded-[6px] box-border`}
                        src={"/images/LightMode.svg"}
                        width={250}
                        height={400}
                        alt="light-mode"
                    />
                    <span className="text-xs">Light mode</span>
                </div>
                <div onClick={() => handleThemeChange("system")} className="flex flex-col items-center gap-y-2">
                    <Image
                        className={`${theme === 'system' && "border-[4px] border-blue-500 transform scale-105"} rounded-[6px] box-border`}
                        src={"/images/SystemDefault.svg"}
                        width={250}
                        height={400}
                        alt="system-default"
                    />
                    <span className="text-xs">System Default</span>
                </div>
                <div onClick={() => handleThemeChange("dark")} className="flex flex-col items-center gap-y-2">
                    <Image
                        className={`${theme === 'dark' && "border-[4px] border-blue-500 transform scale-105"} rounded-[6px] box-border`}
                        src={"/images/DarkMode.svg"}
                        width={250}
                        height={400}
                        alt="dark-mode"
                    />
                    <span className="text-xs">Dark mode</span>
                </div>
            </div>
        </div>

    )
}