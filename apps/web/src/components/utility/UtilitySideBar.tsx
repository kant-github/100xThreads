import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import AppLogo from "../heading/AppLogo";

interface UtilitySideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ({ open, setOpen }: UtilitySideBarProps) {
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
            <div ref={ref} className={`fixed top-0 right-0 h-screen w-[350px] bg-[#f2f2f2] border-l-[1px] dark:border-zinc-800 dark:bg-[#1c1c1c] dark:text-gray-200 shadow-xl z-50 rounded-xl transform transition-transform ease-in-out duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                
            </div>
        </>
    )
}