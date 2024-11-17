type props = {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string | null
}
export default function BlackBtn({ onClick, children, className }: props) {
    return (
        <button
            className={`px-5 py-3 text-xs font-thin rounded-[5px] select-none 
                bg-black text-white hover:bg-gray-800
                 dark:text-gray-200 dark:hover:bg-[#1c1c1c]
                transition-colors duration-300 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
