import { Dispatch, ForwardedRef, SetStateAction } from "react";

interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    ref?: ForwardedRef<HTMLDivElement>;
}

export default function UtilityCard({ children, className, ref }: UtilityCardProps) {
    return (
        <div ref={ref} className={`${className} dark:text-gray-200 rounded-[16px] z-40`} onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    );
}