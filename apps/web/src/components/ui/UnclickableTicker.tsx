interface UnclickableTickerProps {
    children: React.ReactNode;
    className?: string
}

export default function UnclickableTicker({ children, className }: UnclickableTickerProps) {
    return (
        <span className={`inline-flex items-center gap-x-2 text-[11px] px-2.5 py-1 rounded-full text-neutral-200 border-neutral-400 border bg-neutral-700 shadow-sm shadow-neutral-900 select-none whitespace-nowrap ${className}`}>
            {children}
        </span>
    )
}