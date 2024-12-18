import { Dispatch, SetStateAction } from "react";
import CheckBox from "./CheckBox";

interface TermsAndConditionProps {
    termsAndconditionChecked: boolean;
    setTermsAndConditionchecked: Dispatch<SetStateAction<boolean>>;
}

export default function ({ termsAndconditionChecked, setTermsAndConditionchecked }: TermsAndConditionProps) {

    const handleTermAndconditionChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAndConditionchecked(event.target.checked);
    }

    return (
        <div className="flex items-start gap-x-3">
            <CheckBox checked={termsAndconditionChecked} onChange={handleTermAndconditionChangeHandler} />
            <p className="italic text-gray-700 dark:text-gray-200 text-[11px]">
                By checking this box, you agree to our <a href="/terms" className="underline">Terms and Conditions</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>



        </div>
    )
}