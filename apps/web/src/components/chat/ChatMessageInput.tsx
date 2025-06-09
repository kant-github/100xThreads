import { messageEditingState } from '@/recoil/atoms/chats/messageEditingStateAtom';
import React, { Dispatch, SetStateAction, KeyboardEvent, useState, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';

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
    const [editingState, setEditingState] = useRecoilState(messageEditingState);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        if (editingState && textareaRef.current) {
            textareaRef.current.focus();
            const length = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(length, length);
        }
    }, [editingState])

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape' && editingState) {
            e.preventDefault();
            setEditingState(null);
            setMessage('');
            return;
        }

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
            setRows(1);
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

        <div className="relative w-full mt-1">
            {editingState && (
                <div className="absolute -top-6 left-0 right-0 flex justify-between items-center text-xs text-neutral-400">
                    <button type='button' onClick={() => {
                        setEditingState(null);
                        setMessage('');
                    }} className="text-[10px] text-yellow-500 bg-[#f5a331]/10 py-[1px] px-2 rounded-[6px]" >
                        press esc to cancel
                    </button>
                </div>
            )}
            <textarea
                ref={textareaRef}
                name="imp"
                placeholder={editingState ? "Edit message..." : "Type a message..."}
                value={message}
                rows={rows}
                className={`${className} p-2 py-3 pl-4 font-light text-[13px] text-neutral-400 rounded-[8px] outline-none placeholder:text-black dark:bg-neutral-900 dark:text-gray-200 dark:placeholder:text-neutral-400 dark:placeholder:font-thin dark:placeholder:text-xs placeholder:font-light bg-neutral-900 resize-none`}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}