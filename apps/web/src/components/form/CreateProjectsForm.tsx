import { Dispatch, SetStateAction } from "react";
import OpacityBackground from "../ui/OpacityBackground";
import UtilityCard from "../utility/UtilityCard";

interface CreateProjectsFormProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ({ open, setOpen }: CreateProjectsFormProps) {
    return (
        <OpacityBackground onBackgroundClick={() => setOpen(false)} >
            <UtilityCard open={open} setOpen={setOpen} className="w-5/12 px-12 relative pb-20 pt-8 dark:bg-neutral-800 dark:border-neutral-600 border" >
                hi
            </UtilityCard>
        </OpacityBackground>
    )
}