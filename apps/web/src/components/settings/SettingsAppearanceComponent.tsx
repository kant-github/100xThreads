import Image from "next/image";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { useEffect, useState } from "react";

export default function () {
    const [theme, setTheme] = useState<string>("system");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
            setTheme(storedTheme);
        } else {
            setTheme("system");
            localStorage.setItem("theme", "system");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);

        document.documentElement.classList.remove("light", "dark");

        if (theme === "light") {
            document.documentElement.classList.add("light");
        } else if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else if (theme === "system") {
            const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (isDarkSystem) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.add("light");
            }
        }
    }, [theme]);

    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            document.documentElement.classList.remove("light", "dark");
            if (e.matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.add("light");
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, [theme]);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    return (
        <div className="text-zinc-100 pl-8 py-6 w-full">
            <DashboardComponentHeading description="Choose your preferred theme for a personalized experience.">
                Theme
            </DashboardComponentHeading>
            <div className="mt-4 flex flex-row justify-around">
                <div onClick={() => handleThemeChange("light")} className="flex flex-col items-center gap-y-2 cursor-pointer transition-transform hover:scale-102" >
                    <Image
                        className={`${theme === 'light'
                            ? "border-4 border-blue-500 transform scale-105"
                            : "border-2 border-transparent"
                            } rounded-[8px] box-border transition-all duration-200`}
                        src="/images/LightMode.svg"
                        width={250}
                        height={400}
                        alt="light-mode"
                    />
                    <span className="text-xs">Light mode</span>
                </div>

                <div onClick={() => handleThemeChange("system")} className="flex flex-col items-center gap-y-2 cursor-pointer transition-transform hover:scale-102">
                    <Image
                        className={`${theme === 'system'
                            ? "border-4 border-blue-500 transform scale-105"
                            : "border-2 border-transparent"
                            } rounded-[8px] box-border transition-all duration-200`}
                        src="/images/SystemDefault.svg"
                        width={250}
                        height={400}
                        alt="system-default"
                    />
                    <span className="text-xs">System Default</span>
                </div>

                <div onClick={() => handleThemeChange("dark")} className="flex flex-col items-center gap-y-2 cursor-pointer transition-transform hover:scale-102">
                    <Image
                        className={`${theme === 'dark'
                            ? "border-4 border-blue-500 transform scale-105"
                            : "border-2 border-transparent"
                            } rounded-[8px] box-border transition-all duration-200`}
                        src="/images/DarkMode.svg"
                        width={250}
                        height={400}
                        alt="dark-mode"
                    />
                    <span className="text-xs">Dark mode</span>
                </div>
            </div>
        </div>
    );
}