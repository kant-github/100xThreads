import { AnimatePresence, motion } from "framer-motion";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface UtilityOptionMenuCardProps {
    open: Boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
    className?: string
}

export default function ({ open, setOpen, children, className }: UtilityOptionMenuCardProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            };
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);


    return (
        <AnimatePresence>
            {
                open && (
                    <motion.div
                        ref={ref}
                        className={`${className} relative z-[100]`}
                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        {children}
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}