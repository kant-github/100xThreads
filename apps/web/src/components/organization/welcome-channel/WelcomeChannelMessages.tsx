import UtilityCard from "@/components/utility/UtilityCard";
import { welcomeChannelMessagesAtom } from "@/recoil/atoms/organizationAtoms/welcomeChannelMessagesAtom";
import { useRecoilValue } from "recoil";

interface WelcomeChannelMessagesProps {
    className?: string
}

export default function ({ className }: WelcomeChannelMessagesProps) {
    const welcomeChannelMessages = useRecoilValue(welcomeChannelMessagesAtom);
    return (
        <UtilityCard className={`mt-4 overflow-hidden bg-white dark:bg-neutral-900 w-full overflow-y-auto scrollbar-hide ${className}`}>
            {
                welcomeChannelMessages.map((message) => {
                    return <div>
                        <div>{message.user.name}</div>
                        <div>{message.message}</div>
                    </div>
                })
            }
        </UtilityCard>
    )
}