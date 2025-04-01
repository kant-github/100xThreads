type Props = {
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean
    className?: string | null;
    type?: "button" | "submit" | "reset"
}

export default function ({ onClick, children, disabled, className = "", type = "button" }: Props) {
    return (
        <button
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={`${className} flex items-center gap-x-2 
                ${disabled 
                    ? 'bg-neutral-400/30 text-[#9d6e2c] cursor-not-allowed shadow-none transform-none hover:shadow-none hover:translate-y-0 active:scale-100' 
                    : 'bg-neutral-500/30 text-[#f5a331] shadow-md shadow-zinc-900/40 hover:shadow-lg active:scale-95 hover:-translate-y-0.5'
                } 
                text-xs px-4 py-2 rounded-[6px] transition-all duration-200 mt-2`}>
            {children}
        </button>
    );
}