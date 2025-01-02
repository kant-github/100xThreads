interface OpacityBackgroundProps {
    children: React.ReactNode;
    className?: string;
    onBackgroundClick?: () => void;
}

export default function OpacityBackground({ children, className, onBackgroundClick }: OpacityBackgroundProps) {
    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onBackgroundClick) {
            onBackgroundClick();
        }
    };

    return (
        <div 
            className={`fixed w-screen h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 ${className}`}
            onClick={handleBackgroundClick}
        >
            {children}
        </div>
    );
}