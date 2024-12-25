interface WhiteTextProps {
    children: React.ReactNode;
    className?: string;
}

export default function ({ children, className }: WhiteTextProps) {
    return (
        <span className={`${className} text-zinc-400`}>{children}</span>
    )
}