import React, { Dispatch, SetStateAction, KeyboardEvent, useState } from 'react';

interface ChatMessageInputProps {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    className?: string;
    handleTyping: () => void;
    onSendMessage: () => void;
}

export default function ChatMessageInput({ 
    message, 
    setMessage, 
    className, 
    handleTyping,
    onSendMessage 
}: ChatMessageInputProps) {
    const [rows, setRows] = useState(1);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const newMessage = message.slice(0, start) + '\n' + message.slice(end);
            
            setMessage(newMessage);
            return;
        }
        
        if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            if (message.trim()) {
                onSendMessage();
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textareaLineHeight = 24;
        const previousRows = rows;
        const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);
        
        if (currentRows !== previousRows) {
            setRows(currentRows);
        }

        setMessage(e.target.value);
        handleTyping();
    };

    return (
        
        <textarea
            name="imp"
            placeholder="Type a message..."
            value={message}
            rows={rows}
            className={`${className} p-2 py-2.5 pl-4 font-light text-sm rounded-[8px] outline-none placeholder:text-black dark:bg-neutral-900 dark:text-gray-200 dark:placeholder:text-neutral-400 dark:placeholder:font-thin dark:placeholder:text-xs placeholder:font-light bg-neutral-900 resize-none`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    )
}