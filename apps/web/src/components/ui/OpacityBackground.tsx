interface OpacityBackgroundProps {
    children: React.ReactNode,
    className?: string
}

export default function ({ children, className }: OpacityBackgroundProps) {
    return (
        <div className={`fixed w-screen h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
            {children}
        </div>
    )
}