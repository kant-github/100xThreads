import UtilityCard from "./UtilityCard";
import { Button } from "../ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default function GoogleCalendarConnectionDialog() {
    return (
        <UtilityCard className="fixed bottom-6 right-6 z-50 max-w-sm p-5 shadow-lg border dark:border-neutral-700 rounded-[8px] bg-white dark:bg-secDark">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Connect Google Calendar
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Sync your events and stay organized with automatic updates.
                </p>
            </div>

            <div className="flex gap-2">
                <Button
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
        </UtilityCard>
    );
}
