import PinnedCard from "@/components/cards/PinnedCard";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import BlackboardBackground from "@/components/ui/BlackboardBackground";
import { useState } from "react";
import { ChannelType } from "types";
import TransparentButton from "../buttons/TransparentButton";
import { CgMathPlus } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { organizationAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";

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
    },
    {
        id: "123e4567-e89b-12d3-a456-426614174000",
        channel_id: "abc123-channel-id-1",
        title: "New Office Space!",
        content: "We're excited to announce that we'll be moving to our new office space starting next month. The new location features better amenities, more meeting rooms, and a larger cafeteria. Please read the attached guidelines for the transition process.",
        priority: "LOW",
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
        priority: "HIGH",
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
    const [createAnnoucementModal, setCreateAnnouncementModal] = useState<boolean>(false);
    const organization = useRecoilValue(organizationAtom);
    return (
        <div className="bg-[#171717] h-full flex flex-col items-start w-full p-6 relative">
            <TransparentButton className="absolute top-6 right-3 group mr-4" color={organization?.organizationColor}>
                <CgMathPlus size={16} />
                Create Announcement
            </TransparentButton>
            <DashboardComponentHeading description={channel.description!}> {channel.title} </DashboardComponentHeading>
            <BlackboardBackground className='p-8 w-full'>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 relative'>
                    {sampleAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="relative">
                            <PinnedCard announcement={announcement} />
                        </div>
                    ))}
                </div>
            </BlackboardBackground>
        </div >
    );
}


