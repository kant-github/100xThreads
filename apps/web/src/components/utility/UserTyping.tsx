import TypingDots from "../loaders/TypingDots";
import React from 'react';
interface UserTypingProps {
    usersTyping: string[];
}
export default function ({ usersTyping }: UserTypingProps) {
    return (
        <div className='text-sm text-neutral-400 flex items-center justify-between px-2'>
            <div>
                {usersTyping.length > 0 && (
                    <div className='text-[10px] text-yellow-500 flex items-center justify-start'>
                        <TypingDots />
                        {usersTyping.map((username, index) => (
                            <React.Fragment key={username}>
                                {index > 0 && index === usersTyping.length - 1 ? ' and ' : index > 0 ? ', ' : ''}
                                {username}
                            </React.Fragment>
                        ))}
                        {usersTyping.length === 1 ? ' is' : ' are'} typing...
                    </div>
                )}
            </div>
            <div className="text-[10px] text-yellow-500 bg-[#f5a331]/10 py-[1px] px-2 mb-1 rounded-[6px]">Press Shift + Enter to add a line break</div>
        </div>
    )
}