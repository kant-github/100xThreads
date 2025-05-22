import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import { Button } from "@/components/ui/button";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { EventChannelType } from "types/types";

interface EventChannelTopBarProps {
    channel: EventChannelType;
}

export default function ({ channel }: EventChannelTopBarProps) {
    const organizationUser = useRecoilValue(organizationUserAtom);

    function handleConnect() {
        const currentUrl = window.location.href;
        const authUrl = `http://localhost:7001/api/auth/google?returnUrl=${encodeURIComponent(currentUrl)}`;
        window.location.href = authUrl;
    }

    const isConnected = Boolean(
        organizationUser?.user?.access_token &&
        organizationUser?.user?.refresh_token
    );

    const isTokenValid = organizationUser?.user?.token_expires_at
        ? new Date(organizationUser.user.token_expires_at) > new Date()
        : false;

    const isFullyConnected = isConnected && isTokenValid;

    return (
        <div className="flex items-center justify-between">
            <DashboardComponentHeading description={channel.description}>
                {channel.title}
            </DashboardComponentHeading>
            
        </div>
    )
}