import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import AppLogo from "../heading/AppLogo";

interface UtilitySideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    content: React.ReactNode;
}

export default function ({ open, setOpen, content }: UtilitySideBarProps) {
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [open, setOpen]);
    return (
        <>
            <div ref={ref} className={`fixed top-0 right-0 h-screen w-[350px] bg-[#f2f2f2] border-l-[1px] dark:border-zinc-800 dark:bg-neutral-900 dark:text-gray-200 shadow-xl z-50 rounded-xl transform transition-transform ease-in-out duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                {content}
                <div className="mt-2 bottom-4 absolute  mx-4">
                    <AppLogo />
                    <p className="text-[11px] font-thin mx-3 my-2 mb-4 italic">
                        100xThreads is the go-to solution for managing group chats and rooms. Customize, organize, and stay connected with ease.
                    </p>
                </div>
            </div>
        </>
    )
}