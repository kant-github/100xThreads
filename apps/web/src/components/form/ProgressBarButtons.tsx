import { progressBarAtom, progressBarTotalLevelAtom } from "@/recoil/atoms/progressBarAtom";
import { useEffect } from "react";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import BlackBtn from "../buttons/BlackBtn";

export default function ProgressNavigation() {
    const totalLevels = useRecoilValue(progressBarTotalLevelAtom);
    const [currentLevel, setCurrentLevel] = useRecoilState(progressBarAtom);

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
        if (currentLevel > 1) {
            setCurrentLevel(prev => prev - 1);
        }
    };

    return (
        <div className="flex justify-center items-center gap-4 absolute bottom-6 right-8">
            <button
                onClick={handleBack}
                disabled={currentLevel === 1}
                className={`px-4 py-2 rounded-md transition-colors ${currentLevel === 1
                    ? 'bg-zinc-700 cursor-not-allowed'
                    : 'bg-zinc-900 text-white hover:bg-black'
                    }`}
            >
                <MdChevronLeft className={`${currentLevel === 1 ? "text-zinc-300" : "text-white"}`} />
            </button>

            {currentLevel === totalLevels ? (
                <BlackBtn type="submit">Submit</BlackBtn>
            ) : (
                <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-black transition-colors"
                >
                    <MdChevronRight />
                </button>
            )}
        </div>
    );
}