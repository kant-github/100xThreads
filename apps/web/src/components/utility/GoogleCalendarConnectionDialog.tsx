import { Button } from "../ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { RxCross1 } from "react-icons/rx";
import UtilityCard from "./UtilityCard";
import { API_URL } from "@/lib/apiAuthRoutes";

interface GoogleCalendarConnectionDialogProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function GoogleCalendarConnectionDialog({
    setOpen,
}: GoogleCalendarConnectionDialogProps) {

    function handleConnect() {
        const currentUrl = window.location.href;
        const authUrl = `${API_URL}/oauth/google?returnUrl=${encodeURIComponent(
            currentUrl
        )}`;
        window.location.href = authUrl;
    }

    return (
        <UtilityCard className="fixed bottom-6 right-6 z-50 max-w-sm shadow-lg border dark:border-neutral-700 rounded-[6px] bg-white dark:bg-neutral-900 animate-in slide-in-from-bottom fade-in duration-700">
            <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute -top-2 -left-2 bg-white dark:bg-neutral-700/30 border border-gray-300 dark:border-neutral-600 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-neutral-600 transition"
            >
                <RxCross1 className="w-3 h-3 text-gray-700 dark:text-gray-200" />
            </button>

            <div className="p-5">
                <div className="mb-4">
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
                            unoptimized
                            priority
                            alt="google calendar"
                        />
                        <span className="text-neutral-100 text-[12px] tracking-wide font-normal">
                            Connect Google calendar
                        </span>
                        <ExternalLink />
                    </Button>
                </div>
            </div>
        </UtilityCard>
    );
}
