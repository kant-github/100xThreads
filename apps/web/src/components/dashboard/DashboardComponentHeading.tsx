interface DashboardComponentHeadingProps {
    children: React.ReactNode,
    description: string
    className?: string
}


export default function ({ children, description, className }: DashboardComponentHeadingProps) {
    return (
        <span className={`${className} text-gray-100 dark:text-[#d6d6d6]  flex flex-col`}>
            <span className="text-lg font-bold tracking-wide">{children}</span>
            <span className="text-xs font-normal  tracking-wide">{description}</span>
        </span>
    )
}