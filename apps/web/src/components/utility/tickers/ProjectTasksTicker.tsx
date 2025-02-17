interface ProjectTasksTickerProps {
    children: React.ReactNode
}
export default function ({ children }: ProjectTasksTickerProps) {
    return (
        <div className="text-[11px] text-amber-400 tracking-wider flex items-center gap-x-1 border border-amber-500/60 rounded-[8px] py-0.5 px-2 bg-amber-500/10">
            {children}
        </div>
    )
}