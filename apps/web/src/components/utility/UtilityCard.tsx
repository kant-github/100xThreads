interface UtilityCardProps {
    children: React.ReactNode
    className?: string;
}


export default function ({ children, className }: UtilityCardProps) {
    return (
        <div className={`${className} bg-white dark:bg-zinc-800 dark:text-gray-200 rounded-[8px] `}>
            {children}
        </div>
    )
}