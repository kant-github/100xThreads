interface BlackboardBackgroundProps {
    children: React.ReactNode
    className?: string
}

export default function ({ children, className }: BlackboardBackgroundProps) {
    return (
        <div className={`relative flex-grow overflow-hidden rounded-[8px] ${className}`}>
            <div className="absolute inset-0 bg-neutral-900 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_10%)] before:bg-repeat before:[background-size:8px_8px] before:opacity-50"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWZhNmIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-[0.15]"></div>
            <div className="relative">
                <div className="text-slate-100 font-chalk">
                    {children}
                </div>
            </div>
        </div>
    )
}