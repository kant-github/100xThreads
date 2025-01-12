interface PriorityTickerProps {
    tickerText: string
    className?: string
}


export default function ({ tickerText, className }: PriorityTickerProps) {
    switch (tickerText) {
        case 'LOW':
            return <LowPriorityTicker className={className} />;
        case 'NORMAL':
            return <NormalPriorityTicker className={className} />;
        case 'HIGH':
            return <HighPriorityTicker className={className} />
        case 'URGENT':
            return <UrgentPriorityTicker className={className} />
        default: return null
    }
}

export function LowPriorityTicker({ className }: { className?: string }) {
    return (
        <div className={`bg-green-500/20 text-green-500 px-2 py-1 rounded-[6px] text-[10px] font-semibold inline-block select-none ${className}`}>
            LOW
        </div>
    )
}

export function NormalPriorityTicker({ className }: { className?: string }) {
    return (
        <div className={`bg-blue-600/20 text-blue-600 px-2 py-1 rounded-[6px] text-[10px] font-semibold inline-block select-none ${className}`}>
            NORMAL
        </div>
    )
}

export function HighPriorityTicker({ className }: { className?: string }) {
    return (
        <div className={`bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-[6px] text-[10px] font-semibold inline-block select-none ${className}`}>
            HIGH
        </div>
    )
}

export function UrgentPriorityTicker({ className }: { className?: string }) {
    return (
        <div className={`bg-red-500/20 text-red-500 px-2 py-1 rounded-[6px] text-[10px] font-semibold inline-block select-none ${className}`}>
            URGENT
        </div>
    )
}