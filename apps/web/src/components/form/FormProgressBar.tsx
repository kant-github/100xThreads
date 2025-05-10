import { progressBarAtom, progressBarTotalLevelAtom } from '@/recoil/atoms/progressBarAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction } from 'react';

interface FormProgressBarProps {
  className?: string
  steps: {
    id: string,
    title: string
  }[];
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  totalLevels: number

}



export default function ({ className, steps, currentStep, setCurrentStep, totalLevels }: FormProgressBarProps) {

  return (
    <div className={`${className}`}>
      <div className="flex justify-between mb-2 ">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className={cn(
                "w-4 h-4 rounded-full cursor-pointer transition-colors duration-300",
                index < currentStep
                  ? "bg-primary"
                  : index === currentStep
                    ? "bg-primary ring-4 ring-primary/20"
                    : "bg-neutral-700"
              )}
              onClick={() => {

                if (index <= currentStep) {
                  setCurrentStep(index)
                }
              }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.span
              className={cn(
                "text-xs mt-1.5 hidden sm:block",
                index === currentStep ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {step.title}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2 bg-neutral-700">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

