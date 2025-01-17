import { Dispatch, SetStateAction } from "react";

interface ChatMessageInputProps {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    onChange: (e: any) => void; // Add onChange prop
    className?: string
}

export default function ChatMessageInput({ message, setMessage, onChange, className }: ChatMessageInputProps) {
    return (
        <input
            type="text"
            name="imp"
            placeholder="Type a message..."
            value={message}
            className={`${className} p-2 py-2.5 pl-4 font-light text-sm rounded-[8px] outline-none placeholder:text-black dark:bg-neutral-900 dark:text-gray-200 dark:placeholder:text-neutral-400 dark:placeholder:font-thin dark:placeholder:text-xs placeholder:font-light bg-neutral-900`}
            onChange={(e) => {
                setMessage(e.target.value);
                onChange(e);
            }}
        />
    )
}
