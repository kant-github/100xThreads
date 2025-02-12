import { ChannelType, ChannelTypeType } from "types";
import AnnouncementChannelUI from "./AnnouncementChannelUI";
import GeneralChatChannelUI from "./GeneralChatChannelUI";
import ResourcesChannelUI from "./ResourcesChannelUI";
import HelpDeskChannelUI from "./HelpDeskChannelUI";
import ProjectsChannelUI from "./ProjectsChannelUI";
import LearningChannelUI from "./LearningChannelUI";

interface RegularChannelViewProps {
    channel: ChannelType;
}

export default function ({ channel }: RegularChannelViewProps) {
    const type: ChannelTypeType = channel.type;
    switch (type) {
        case 'ANNOUNCEMENT':
            return <AnnouncementChannelUI channel={channel} />
        case 'GENERAL':
            return <GeneralChatChannelUI channel={channel} />
        case 'RESOURCE':
            return <ResourcesChannelUI channel={channel} />
        case 'HELP_DESK':
            return <HelpDeskChannelUI channel={channel} />
        case 'PROJECT':
            return <ProjectsChannelUI channel={channel} />
        case 'LEARNING':
            return <GeneralChatChannelUI channel={channel} />
        default:
            return null
    }
}


