import { useRecoilValue } from 'recoil';
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { organizationUserAtom } from '@/recoil/atoms/organizationAtoms/organizationUserAtom';
import isExpiredtoken from '@/lib/isExpiredToken';

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



export default function EventGoogleConnectProgressBar({ className, steps, currentStep, setCurrentStep, totalLevels }: FormProgressBarProps) {
    const organizationUser = useRecoilValue(organizationUserAtom);
    const disableAtfirstStep = !organizationUser.user.token_expires_at || isExpiredtoken(organizationUser.user.token_expires_at)

    function handleNext() {
        if (currentStep < totalLevels) {
            setCurrentStep(prev => prev + 1);
        }
    }

    function handleBack() {
        if (currentStep >= 0) {
            setCurrentStep(prev => prev - 1);
        }
    }

    return (
        <div className='flex items-center justify-between px-6'>
            <div className={`${className} min-w-[8rem]`}>
                <div className="flex justify-between mb-2">
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
                                    index === currentStep ? "text-primary font-medium" : "text-neutral-100"
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


            <div className='flex items-center gap-x-2'>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 ? disableAtfirstStep : false}
                    className="flex items-center gap-1 transition-all duration-300 rounded-2xl text-neutral-300"
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentStep === 0 ? disableAtfirstStep : false}
                    className="flex items-center gap-1 transition-all duration-300 rounded-2xl text-neutral-300"
                >
                    Next <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div >
    );
};

