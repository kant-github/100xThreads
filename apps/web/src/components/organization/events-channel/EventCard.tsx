import UtilityCard from "@/components/utility/UtilityCard";
import { Calendar, Clock, Dot, ExternalLink, Map } from "lucide-react";
import Image from "next/image";
import { EventType } from "types/types";
import { formatDistanceStrict } from "date-fns";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface EventCardProps {
    event: EventType;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    onEventClick?: (eventId: string) => void;
}

export function getStatusText(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function getStatusColor(status: string) {
    switch (status) {
        case 'LIVE':
            return 'bg-green-600/20 text-green-500 border-green-600';
        case 'PENDING':
            return 'bg-yellow-600/20 text-yellow-500 border-yellow-600';
        case 'CANCELED':
            return 'bg-red-600/20 text-red-500 border-red-600';
        case 'COMPLETED':
            return 'bg-neutral-600/20 text-neutral-500 border-neutral-600';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

export default function EventCard({ event, setOpen, onEventClick }: EventCardProps) {

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
        <UtilityCard className="p-5 bg-terDark rounded-[6px] border-[1px] border-neutral-700 overflow-hidden cursor-pointer shadow-lg">
            <div onClick={handleCardClick} className="flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-base font-semibold text-neutral-100">
                        {event.title}
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                            {getStatusText(event.status)}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-neutral-400">
                            {formatDate(event.start_time)}
                        </span>
                    </div>

                    <div className="ml-0.5">
                        {event.end_time && (
                            <span className="text-xs font-medium text-neutral-300 flex items-center gap-x-1">
                                <span className="flex items-center gap-x-2">
                                    <Clock size={14} />
                                    {getDuration(event.start_time, event.end_time)}
                                </span>
                                <Dot size={12} />
                                <span className="">
                                    {event.attendees?.length ?? 0} attending..
                                </span>
                            </span>
                        )}
                        <span className="text-xs font-medium text-neutral-300">
                            starts at {formatTime(event.start_time)}
                        </span>
                    </div>
                </div>
                {
                    event.location?.mode === 'ONLINE' ? (
                        <Link 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            href={event.meet_link!} 
                            className="flex items-center gap-x-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src="/images/google-meet.png"
                                height={19}
                                width={19}
                                unoptimized
                                alt="Google Meet"
                                className="object-contain"
                            />
                            <span className="mb-[1px] text-xs text-neutral-100">{event.location.name}</span>
                            <ExternalLink size={14} />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <Map size={18} className="text-amber-500/80" />
                            <span className="text-xs text-neutral-100">{event.location?.name} - {event.location?.address}</span>
                        </div>
                    )
                }
            </div>
        </UtilityCard>
    );
}