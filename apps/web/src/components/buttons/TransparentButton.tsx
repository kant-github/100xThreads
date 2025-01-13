import { useState } from "react";

interface TransparentButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    color?: string
}

export default function ({ children, className, onClick, color }: TransparentButtonProps) {
    const [hovered, setHovered] = useState<boolean>(false);
    return (
        <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: `${hovered ? `${color}33` : `${color}1A`}`,
                color: `${color}`,
                border: `1px solid ${color}80`
            }} onClick={onClick} className={`${className} flex items-center tracking-wider justify-center gap-x-2 px-4 py-2 rounded-[8px] text-sm font-normal transition-all duration-200 hover:bg-zinc-800 focus:outline-none`} type="button">
            {children}
        </button>
    )
}