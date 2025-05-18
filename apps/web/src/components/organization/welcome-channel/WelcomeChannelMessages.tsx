import UtilityCard from "@/components/utility/UtilityCard";
import { welcomeChannelMessagesAtom } from "@/recoil/atoms/organizationAtoms/welcomeChannelMessagesAtom";
import { useRecoilValue } from "recoil";
import WelcomeChannelData from "./WelcomeChannelData";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationIdAtom } from "@/recoil/atoms/organizationAtoms/organizationAtom";

interface WelcomeChannelMessagesProps {
    className?: string;
}

export default function WelcomeChannelMessages({ className }: WelcomeChannelMessagesProps) {
    const welcomeChannelMessages = useRecoilValue(welcomeChannelMessagesAtom);
    const organizationId = useRecoilValue(organizationIdAtom);
    const session = useRecoilValue(userSessionAtom);
    return (
        <UtilityCard className={`mt-4 overflow-hidden bg-white dark:bg-secDark w-full shadow-lg shadow-black/20 ${className}`}>
            <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
                {
                    welcomeChannelMessages.map((message) => <WelcomeChannelData key={message.id} message={message} session={session} organizationId={organizationId!} />)
                }
            </div>
        </UtilityCard>
    );
}
