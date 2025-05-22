import { Dispatch, SetStateAction, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ProgressBarButtonsProps {
    className?: string;
    totalLevels: number;
    currentLevel: number;
    isSubmitting?: boolean;
    setCurrentLevel: Dispatch<SetStateAction<number>>
}

export default function ({ className, totalLevels, currentLevel, isSubmitting, setCurrentLevel }: ProgressBarButtonsProps) {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                handleBack();
            } else if (event.key === 'ArrowRight' && currentLevel < totalLevels) {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentLevel, totalLevels]);

    const handleNext = () => {
        if (currentLevel < totalLevels) {
            setCurrentLevel(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentLevel > 0) {
            setCurrentLevel(prev => prev - 1);
        }
    };

    return (
        <div className={`flex justify-between pt-6 pb-4 ${className}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentLevel === 0}
                    className="flex items-center gap-1 transition-all duration-300 rounded-2xl"
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant={"default"}
                    type="submit"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className={cn(
                        "flex items-center gap-1 transition-all duration-300 rounded-2xl bg-yellow-600 text-neutral-900",
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                        </>
                    ) : (
                        <>
                            {currentLevel === totalLevels ? "Submit" : "Next"}
                            {currentLevel === totalLevels ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </>
                    )}
                </Button>
            </motion.div>
        </div>
    );
}