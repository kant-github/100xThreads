import { Button } from "../ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function GoogleCalendarConnectionDialog() {
    function handleConnect() {
        const currentUrl = window.location.href;
        const authUrl = `http://localhost:7001/api/auth/google?returnUrl=${encodeURIComponent(currentUrl)}`;
        window.location.href = authUrl;
    }
    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-5 shadow-lg border dark:border-neutral-700 rounded-[9px] bg-white dark:bg-secDark animate-in slide-in-from-bottom fade-in duration-700">
            <div className="mb-4 ">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Connect Google Calendar
                </h3>
                <p className="text-xs mt-1 bg-yellow-950/40 text-yellow-400 border border-yellow-600 rounded-[8px] px-2 py-2">
                    Sync your events and stay organized with automatic updates.
                </p>
            </div>

            <div className="flex gap-2 text-neutral-100">
                <Button
                    onClick={handleConnect}
                    className="bg-neutral-700/70 rounded-[6px] px-4 flex items-center gap-x-3 w-full"
                    variant={"ghost"}
                >
                    <Image
                        src={"/images/google-calendar.png"}
                        height={18}
                        width={18}
                        alt="google calendar"
                    />
                    <span className="text-neutral-100 text-[12px] tracking-wide font-normal">
                        Connect Google calendar
                    </span>
                    <ExternalLink />
                </Button>
            </div>
        </div>
    );
}
