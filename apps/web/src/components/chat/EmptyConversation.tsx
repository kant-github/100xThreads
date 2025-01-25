import { HiLightBulb } from "react-icons/hi";

interface EmptyConversationProps {
    show: boolean;
    className?: string
}

export default function ({ show, className }: EmptyConversationProps) {
    if (show) {
        return (
            <div className={`flex items-center justify-center select-none ${className}`}>
                <span className="flex items-center justify-center gap-2 bg-blue-200 dark:bg-yellow-500 dark:text-neutral-900 text-xs px-6 py-1.5 rounded-[5px] shadow-md">
                    <HiLightBulb size={20} />
                    No messages yet, Be the first to start the conversation !!
                </span>
            </div>
        )
    }
};
