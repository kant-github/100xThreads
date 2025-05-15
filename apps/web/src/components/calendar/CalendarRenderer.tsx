import Calendar from "./Calendar";

interface CalendarRenderedProps {
    className?: string
}

export default function ({ className }: CalendarRenderedProps) {
    return (
        <div className={`${className}`}>
            <Calendar />
        </div>
    )
}