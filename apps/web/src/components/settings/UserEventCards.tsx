import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import { PiDotsThreeBold } from "react-icons/pi";
import ActiveButton from "../utility/ActiveTicker";
import WhiteText from "../heading/WhiteText";
import ActiveTicker from "../utility/ActiveTicker";
import CancelTicker from "../utility/CancelTicker";

interface UserEventCardsProps {
    className?: string
}

export default function ({ className }: UserEventCardsProps) {
    return (
        <div className={`${className}`}>
            <DashboardComponentHeading description="See all upcoming events">Events</DashboardComponentHeading>

            <div className="flex flex-row items-center gap-x-6 justify-start mt-4">
                {/* card-1 */}
                <div className="border-[1px] dark:bg-zinc-700 border-zinc-600 rounded-[8px] w-3/12 px-6 py-4 flex flex-col gap-y-1">
                    <div className="flex flex-row justify-between">
                        <ActiveTicker />
                        <PiDotsThreeBold />
                    </div>
                    <WhiteText className="text-sm font-bold">US meet</WhiteText>
                    <div className="flex flex-row gap-x-1">
                        <span className="text-purple-500 text-xs">upcoming:</span>
                        <WhiteText className="text-xs">Monday, 4PM</WhiteText>
                    </div>
                </div>

                {/* card-2 */}
                <div className="border-[1px] dark:bg-zinc-700 border-zinc-600 rounded-[8px] w-3/12 px-6 py-4 flex flex-col gap-y-1">
                    <div className="flex flex-row justify-between">
                        <CancelTicker/>
                        <PiDotsThreeBold />
                    </div>
                    <WhiteText className="text-sm font-bold">US meet</WhiteText>
                    <div className="flex flex-row gap-x-1">
                        <span className="text-purple-500 text-xs">upcoming:</span>
                        <WhiteText className="text-xs">Monday, 4PM</WhiteText>
                    </div>
                </div>
            </div>
        </div>
    )
}