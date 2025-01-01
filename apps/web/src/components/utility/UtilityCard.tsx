import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface UtilityCardProps {
    children: React.ReactNode
    className?: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}


export default function ({ children, className, open, setOpen }: UtilityCardProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {

        const checkOutsideClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', checkOutsideClick);
        } else {
            document.removeEventListener('mousedown', checkOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', checkOutsideClick);
        }

    }, [open, setOpen])

    return (
        <div ref={ref} className={`${className} bg-white dark:bg-zinc-800 dark:text-gray-200 rounded-[8px] `}>
            {children}
        </div>
    )
}