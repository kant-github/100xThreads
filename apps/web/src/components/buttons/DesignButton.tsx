type Props = {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string | null;
    type?: "button" | "submit" | "reset"
}

export default function ({ onClick, children, className = "", type = "button" }: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${className} bg-neutral-500/30 text-xs px-4 py-2 text-[#f5a331] rounded-[6px] shadow-md shadow-zinc-900/40 hover:shadow-lg active:scale-95 transition-all duration-200 hover:-translate-y-0.5 mt-2`}>
            {children}
        </button>
    );
}