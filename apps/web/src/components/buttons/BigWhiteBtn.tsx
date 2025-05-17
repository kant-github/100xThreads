"use client";  // This makes only the WhiteBtn a client component

import { ReactNode } from "react";

interface ButtonProps {
    onClick: () => void
    children: ReactNode;
    className?: string
}

export default function ({ onClick, children, className }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`dark:text-gray-200 flex items-center justify-center py-2 gap-2 text-xs rounded-[3px] font-normal hover:bg-[#ededed] dark:hover:bg-zinc-800 hover:shadow-lg transition-all duration-100 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
};
