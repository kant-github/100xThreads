interface CompanyTagTickerProps {
    children: React.ReactNode
}
export default function ({ children }: CompanyTagTickerProps) {
    return (
        <div>
            <div className="flex items-center gap-x-1 text-yellow-500 text-[10px] rounded-full bg-yellow-500/20 px-2 py-0.5 select-none">{children}</div>
        </div>
    )
}