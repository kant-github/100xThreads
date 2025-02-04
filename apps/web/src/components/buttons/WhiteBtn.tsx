"use client";

import { ReactNode } from "react";

interface ButtonProps {
    onClick?: () => void
    children: ReactNode;
    className?: string 
}

export const WhiteBtn = ({ onClick, children, className }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`flex items-center shadow-md justify-center gap-x-2 dark:text-[12px] bg-zinc-100 dark:bg-[#f5a331] text-black dark:border-[1px] dark:hover:bg-orange-300 dark:border-gray-700  py-2 px-5 text-xs rounded-[6px] font-semibold hover:bg-[#ededed] hover:shadow-lg transition-all duration-200 ease-in-out select-none ${className}`}
        >
            {children}
        </button>
    );
};
