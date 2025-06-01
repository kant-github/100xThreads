import { useRecoilValue } from "recoil";
import Userdata from "./user/UserData";
import { userProfileAtom } from "@/recoil/atoms/users/userProfileAtom";
import { Button } from "../ui/button";
import Image from "next/image";
import { myEventsAtom } from "@/recoil/atoms/events/myEventsAtom";
import MiniEventCard from "../organization/events-channel/MiniEventCard";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";

export default function () {
    const userProfileData = useRecoilValue(userProfileAtom);
    const events = useRecoilValue(myEventsAtom);
    return (
        <div className="w-full py-6 px-8 text-zinc-100">
            <div className="flex flex-col gap-y-4">
                <Userdata userProfileData={userProfileData} />
                <hr className="border-t border-zinc-600 border-0 h-px bg-zinc-500" />
                <Button className="bg-neutral-700/70 rounded-[6px] px-4 w-fit flex items-center gap-x-3" variant="ghost">
                    <Image
                        src={"/images/google-calendar.png"}
                        height={18}
                        width={18}
                        alt="google calendar"
                    />
                    <span className="text-neutral-100 text-[12px] tracking-wide font-normal">Connect Google calendar</span>
                </Button>
                <hr className="border-t border-zinc-600 border-0 h-px bg-zinc-500" />
                <DashboardComponentHeading className="mt-2" description="Stay on top of your schedule">Upcoming Events</DashboardComponentHeading>
                <div className="flex items-center justify-start gap-x-5">

                    {events.length > 0 && events?.slice(0, 3).map((event) => <MiniEventCard event={event} />)}
                </div>
            </div>
        </div>
    )

}