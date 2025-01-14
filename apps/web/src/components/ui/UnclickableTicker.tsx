interface UnclickableTickerProps {
    children: React.ReactNode;
    className?: string
}

export default function ({ children, className }: UnclickableTickerProps) {
    return (
        <span className={`flex flex-row gap-x-1 mx-auto text-[11px] px-2.5 py-1 rounded-full text-neutral-200 border-neutral-400 border-[0.5px] bg-neutral-700 shadow-sm shadow-neutral-900 select-none ${className}`}>
            {children}
        </span>
    )
}