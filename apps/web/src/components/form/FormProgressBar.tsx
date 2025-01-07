import { progressBarAtom, progressBarTotalLevelAtom } from '@/recoil/atoms/progressBarAtom';
import { useRecoilState, useRecoilValue } from 'recoil';

interface FormProgressBarProps {
  className?: string;
}

export default function ({ className }: FormProgressBarProps) {
  const [currentLevel, setCurrentLevel] = useRecoilState(progressBarAtom);
  const totalLevels = useRecoilValue(progressBarTotalLevelAtom);

  return (
    <div className={`max-w-md mx-auto  ${className}`}>
      <div className="relative mb-8">
        <div className="h-2 bg-zinc-700 rounded-full">
          <div
            className="h-full bg-[#f5a331] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentLevel - 1) / (totalLevels - 1)) * 100}%` }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full flex justify-between -mt-2">
          {[1, 2, 3].map((level) => (
            <button
              type='button'
              onClick={() => setCurrentLevel(level)}
              key={level}
              className={`cursor-pointer w-6 h-6 rounded-full flex items-center justify-center text-sm
                transition-colors duration-300 border-2
                ${level <= currentLevel
                  ? 'bg-[#f5a331] border-[#f5a331] text-white'
                  : 'bg-zinc-700 border-zinc-600 text-zinc-300'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

