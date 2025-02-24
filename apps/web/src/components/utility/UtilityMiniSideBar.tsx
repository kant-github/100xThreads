import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface UtilityMiniSideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    content: React.ReactNode
}

export default function ({ open, setOpen, content }: UtilityMiniSideBarProps) {
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            console.log("clicked");
            if (ref.current && !ref.current.contains(event.target as Node)) {
                console.log("clicked outiside");
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
        <div ref={ref} className={`fixed bottom-0 right-0 h-[40vh] w-4/12 bg-[#f2f2f2] border-l-[1px] border-t-[1px] dark:border-zinc-800 bg-gradient-to-b from-neutral-900 via-neutral-900/80 to-neutral-900 dark:bg-neutral-900/80 dark:text-neutral-200 shadow-lg shadow-black/50 z-50 rounded-tl-xl transform transition-transform ease-in-out duration-300 ${open ? "translate-y-0 translate-x-0" : "translate-y-full translate-x-full"}`}>
            {content}
        </div>
    )
}