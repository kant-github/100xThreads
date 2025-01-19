import { Dispatch, SetStateAction, useRef } from "react";

interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function UtilityCard({ children, className, open }: UtilityCardProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={ref} className={`${className} bg-white dark:bg-neutral-800 dark:text-gray-200 rounded-[16px] z-50`} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    );
}