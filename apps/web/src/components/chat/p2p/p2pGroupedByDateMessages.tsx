import React from "react"
import { ChatMessageOneToOneType } from "types/types"
import P2pMessages from "./P2pMessages";

interface GroupedByDateMessagesProps {
    groupedMessages: Array<[string, ChatMessageOneToOneType[]]>;
}

export default function ({ groupedMessages }: GroupedByDateMessagesProps) {
    return groupedMessages.map(([date, dayMessages]) => (
        <React.Fragment key={date}>
            <div className='w-full flex justify-center sticky top-0 z-[99] select-none'>
                <span className="text-center flex items-center justify-center dark:bg-neutral-900 z-50 px-3 py-1.5 dark:text-neutral-300 text-[10px] rounded-full">
                    {new Date(date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                        day: 'numeric'
                    })}
                </span>
            </div>
            {dayMessages.map((message) => (
                <P2pMessages key={message.id} message={message} />
            ))}
        </React.Fragment>
    ))
}