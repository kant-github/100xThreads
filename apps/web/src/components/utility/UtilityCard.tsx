interface UtilityCardProps {
    children: React.ReactNode
    className?: string
}


export default function ({ children,className }: UtilityCardProps) {
    return (
        <div className={`${className} bg-white dark:bg-[#262629] dark:text-gray-200 rounded-[8px] p-6 `}>
            {children}
        </div>
    )
}