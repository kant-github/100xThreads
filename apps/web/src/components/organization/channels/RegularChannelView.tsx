import PinnedCard from "@/components/cards/PinnedCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import BlackboardBackground from "@/components/ui/BlackboardBackground";
import { ChannelType } from "types";

const sampleAnnouncements = [
    {
        id: "123e4567-e89b-12d3-a456-426614174000",
        channel_id: "abc123-channel-id-1",
        title: "New Office Space!",
        content: "We're excited to announce that we'll be moving to our new office space starting next month. The new location features better amenities, more meeting rooms, and a larger cafeteria. Please read the attached guidelines for the transition process.",
        priority: "NORMAL",
        tags: ["Office", "Important", "Facilities"],
        created_by: 1,
        created_at: "2024-01-10T09:00:00Z",
        expires_at: "2024-02-10T09:00:00Z",
        is_pinned: true,
        requires_ack: true,
        AckStatus: [
            { id: 1, user_id: 1, acked_at: "2024-01-10T10:30:00Z" },
            { id: 2, user_id: 2, acked_at: "2024-01-10T11:15:00Z" }
        ]
    },
    {
        id: "223e4567-e89b-12d3-a456-426614174001",
        channel_id: "abc123-channel-id-1",
        title: "System Maintenance Notice",
        content: "Our servers will undergo routine maintenance this weekend. Expected downtime: 2 hours. Time: Saturday, 2 AM - 4 AM EST",
        priority: "URGENT",
        tags: ["Technical", "Maintenance", "Downtime"],
        created_by: 2,
        created_at: "2024-01-11T15:30:00Z",
        expires_at: "2024-01-14T04:00:00Z",
        is_pinned: false,
        requires_ack: true,
        AckStatus: [
            { id: 3, user_id: 1, acked_at: "2024-01-11T16:00:00Z" }
        ]
    }
];

interface RegularChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: RegularChannelViewProps) {
    console.log(channel);
    return (
        <div className="bg-[#171717] h-full flex flex-col w-full p-6">
            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>
            <BlackboardBackground className='px-8 py-8 w-full'>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12'>
                    {
                        sampleAnnouncements.map((announcement) => (
                            <PinnedCard announcement={announcement} className="w-64" />
                        ))
                    }
                </div>

            </BlackboardBackground>
        </div>
    );
}


