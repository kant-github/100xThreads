import { ChannelType, ChannelTypeType } from "types";
import OrganizationRegularchannelRenderer from "../AnnouncementChannelUI";

interface RegularChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: RegularChannelViewProps) {
    console.log("channel type is : ", channel.type);
    const type: ChannelTypeType = channel.type;
    switch (type) {
        case 'ANNOUNCEMENT':
            return <OrganizationRegularchannelRenderer channel={channel} />
        default:
            return null
    }
}


