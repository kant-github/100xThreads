import { progressBarAtom, progressBarTotalLevelAtom } from "@/recoil/atoms/progressBarAtom";
import { useEffect } from "react";
import { MdChevronRight } from "react-icons/md";
import { MdChevronLeft } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";

export default function () {

    const totalLevels = useRecoilValue(progressBarTotalLevelAtom);
    const [currentLevel, setCurrentLevel] = useRecoilState(progressBarAtom);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                handleBack();
            } else if (event.key === 'ArrowRight') {
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
        <div className="flex justify-center gap-4 absolute bottom-6 right-8">
            <button
                onClick={handleBack}
                disabled={currentLevel === 1}
                className={`px-4 py-2 rounded-md ${currentLevel === 1
                    ? 'bg-zinc-700'
                    : 'bg-zinc-900 text-white hover:bg-black'
                    }`}
            >
                <MdChevronLeft className={`${currentLevel === 1 && "text-zinc-300"}`} />
            </button>
            <button
                onClick={handleNext}
                disabled={currentLevel === totalLevels}
                className={`px-4 py-2 rounded-md ${currentLevel === totalLevels
                    ? 'bg-zinc-700'
                    : 'bg-zinc-900 text-white hover:bg-black'
                    }`}
            >
                <MdChevronRight />
            </button>
        </div>
    )
}