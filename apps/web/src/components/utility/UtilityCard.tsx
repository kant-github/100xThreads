import { Dispatch, ForwardedRef, SetStateAction, useRef } from "react";

interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    ref?: ForwardedRef<HTMLDivElement>;
}

export default function UtilityCard({ children, className, open, ref }: UtilityCardProps) {
    return (
        <div ref={ref} className={`${className} dark:text-gray-200 rounded-[16px] z-50`} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    );
}