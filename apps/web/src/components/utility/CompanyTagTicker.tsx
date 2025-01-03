interface CompanyTagTickerProps {
    children: React.ReactNode
}
export default function ({ children }: CompanyTagTickerProps) {
    return (
        <div>
            <div className="flex items-center gap-x-1 text-yellow-500 text-[12px] font-medium rounded-full bg-yellow-500/20 hover:bg-yellow-500/40 px-2 py-0.5 select-none">{children}</div>
        </div>
    )
}