import UtilityCard from "@/components/utility/UtilityCard";
import { formatDistanceStrict } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import { EventType } from "types/types";
import { getStatusColor, getStatusText } from "./EventCard";
import { Option } from "lucide-react";
import { PiDotsThreeBold } from "react-icons/pi";
import WhiteText from "@/components/heading/WhiteText";

interface MiniEventCardProps {
    event: EventType
    setOpen?: Dispatch<SetStateAction<boolean>>;
    onEventClick?: (eventId: string) => void;
}

export default function MiniEventCard({ event, setOpen, onEventClick }: MiniEventCardProps) {
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    function formatTime(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    function getDuration(start: string, end: string) {
        return formatDistanceStrict(new Date(start), new Date(end));
    }

    const handleCardClick = () => {
        if (setOpen) {
            setOpen(false);
        }
        if (onEventClick) {
            onEventClick(event.id);
        }
    };
    return (
        <UtilityCard className="max-w-[16rem] w-[40rem] overflow-hidden rounded-[6px] border-[1px] dark:bg-zinc-700/50 border-zinc-600">
            <div onClick={handleCardClick} className=" px-6 py-4 flex flex-col gap-y-1">
                <div className="flex flex-row justify-between">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[10px] w-fit font-medium border ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                    </div>
                    <PiDotsThreeBold />
                </div>
                <WhiteText className="text-sm font-bold">{event.title}</WhiteText>
                <div className="flex flex-row gap-x-1">
                    <span className="text-purple-500 text-xs">upcoming:</span>
                    <WhiteText className="text-xs">{formatDate(event.start_time)}</WhiteText>
                </div>
            </div>
        </UtilityCard>
    )
}