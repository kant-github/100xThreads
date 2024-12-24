interface DashboardComponentHeadingProps {
    children: React.ReactNode,
    description: string
}


export default function ({ children, description }: DashboardComponentHeadingProps) {
    return (
        <span className="flex flex-col pt-4 pl-12">
            <span className="text-lg font-bold text-gray-100 dark:text-[#d6d6d6] tracking-wide">{children}</span>
            <span className="text-xs font-normal text-gray-100 dark:text-[#d6d6d6] tracking-wide">{description}</span>
        </span>
    )
}