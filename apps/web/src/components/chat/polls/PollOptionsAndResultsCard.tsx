import UtilityCard from "@/components/utility/UtilityCard";
import { Dispatch, SetStateAction, useRef } from "react";
import { PollTypes } from "types";

interface PolloptionsAndResultsProps {
    pollOptioncCard: boolean;
    setPollOptionCard: Dispatch<SetStateAction<boolean>>;
    poll: PollTypes;
}

export default function ({ pollOptioncCard, setPollOptionCard, poll }: PolloptionsAndResultsProps) {

    const PolloptionsAndResultsRef = useRef<HTMLDivElement | null>(null);


    return (
        <div ref={PolloptionsAndResultsRef} className={`sticky bottom-0 z-[100] max-w-[40%]`}>
            <UtilityCard className={`bg-white dark:bg-neutral-900 px-4 py-3  border-[0.5px] border-neutral-700 `}>
                
            </UtilityCard>
        </div>
    )
}