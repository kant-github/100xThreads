import { Dispatch, ForwardedRef, SetStateAction } from "react";
import { motion } from 'framer-motion'

interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    ref?: ForwardedRef<HTMLDivElement>;
}

export default function UtilityCard({ children, className, ref }: UtilityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={ref} className={`${className} dark:text-gray-200 rounded-[6px] z-40`} onClick={(e) => e.stopPropagation()}>
            {children}
        </motion.div>
    );
}