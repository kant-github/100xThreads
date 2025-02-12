interface TickerProps {
    tickerText: string;
}

export default function Ticker({ tickerText }: TickerProps) {
    switch (tickerText) {
        case 'ADMIN':
            return <AdminTicker tickerText={tickerText} />
        case 'EVENT_MANAGER':
            return <EventManagerTicker tickerText={tickerText} />
        case 'MODERATOR':
            return <ModeratorTicker tickerText={tickerText} />
        case 'MEMBER':
            return <MemberTicker tickerText={tickerText} />
        case 'GUEST':
            return <GuestTicker tickerText={tickerText} />
        case 'ORGANIZER':
            return <OrganizerTicker tickerText={tickerText} />
        case 'OBSERVER':
            return <ObserverTicker tickerText={tickerText} />
        case 'IT_SUPPORT':
            return <ITSupportTicker tickerText={tickerText} />
        case 'HR_MANAGER':
            return <HRManagerTicker tickerText={tickerText} />
        case 'FINANCE_MANAGER':
            return <FinanceManagerTicker tickerText={tickerText} />
        default:
            return <GuestTicker tickerText={tickerText} />
    }
}

export function AdminTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-purple-600 text-[10px] rounded-[6px] bg-purple-500/10 border-[0.5px] border-purple-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function EventManagerTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-blue-500 text-[10px] rounded-[6px] bg-blue-500/10 border-[0.5px] border-blue-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function ModeratorTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-red-500 text-[10px] rounded-[6px] bg-red-500/10 border-[0.5px] border-red-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function GuestTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-green-500 text-[10px] rounded-[6px] bg-green-500/10 border-[0.5px] border-green-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function MemberTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-yellow-500 text-[10px] rounded-[6px] bg-yellow-500/10 border-[0.5px] border-yellow-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function OrganizerTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-orange-500 text-[10px] rounded-[6px] bg-orange-500/10 border-[0.5px] border-orange-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function ObserverTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-teal-500 text-[10px] rounded-[6px] bg-teal-500/10 border-[0.5px] border-teal-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function ITSupportTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-indigo-500 text-[10px] rounded-[6px] bg-indigo-500/10 border-[0.5px] border-indigo-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function HRManagerTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-pink-500 text-[10px] rounded-[6px] bg-pink-500/10 border-[0.5px] border-pink-600 px-2 py-0.5 select-none">{tickerText}</div>
}

export function FinanceManagerTicker({ tickerText }: TickerProps) {
    return <div className="flex items-center gap-x-1 text-amber-500 text-[10px] rounded-[6px] bg-amber-500/10 border-[0.5px] border-amber-600 px-2 py-0.5 select-none">{tickerText}</div>
}