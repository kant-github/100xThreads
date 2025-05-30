import { cn } from "@/lib/utils";

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
            className={cn("fixed w-screen h-screen inset-0 bg-secDark bg-opacity-70 flex items-center justify-center z-50",
                className
            )}
            onClick={handleBackgroundClick}
        >
            {children}
        </div>
    );
}