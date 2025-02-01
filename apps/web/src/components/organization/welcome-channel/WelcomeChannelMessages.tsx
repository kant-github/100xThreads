import UtilityCard from "@/components/utility/UtilityCard";

interface WelcomeChannelMessagesProps {
    className?: string    
}

export default function ({className}: WelcomeChannelMessagesProps) {
    return (
        <UtilityCard className={`mt-4 overflow-hidden bg-white dark:bg-neutral-900 w-full overflow-y-auto scrollbar-hide ${className}`}>
            skjbv
        </UtilityCard>
    )
}