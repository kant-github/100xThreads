"use client";

import { ReactNode } from "react";

interface ButtonProps {
    onClick?: () => void
    children: ReactNode;
    className?: string
}

export default function ({ onClick, children, className }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`flex items-center shadow-md justify-center gap-x-2 dark:text-[12px] bg-zinc-100 dark:bg-neutral-800 text-neutral-300 dark:border-[1px] dark:hover:bg-neutral-900/20 dark:border-neutral-700  py-2 px-5 text-xs rounded-[6px] font-semibold hover:bg-[#ededed] hover:shadow-lg transition-all duration-200 ease-in-out select-none ${className}`}
        >
            {children}
        </button>
    );
};
