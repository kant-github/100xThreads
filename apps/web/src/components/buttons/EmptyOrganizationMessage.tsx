import { useSetRecoilState } from "recoil";
import WhiteText from "../heading/WhiteText";
import { createOrganizationAtom } from "@/recoil/atoms/atom";

const EmptyStateComponent = () => {
    const setCreateOrganizationModal = useSetRecoilState(createOrganizationAtom);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-x-1 px-4 sm:px-0 sm:mr-16 h-full text-center sm:text-left max-w-[90%] mx-auto sm:max-w-none">
            <WhiteText className="text-xs">
                There are currently no organization in your profile.
            </WhiteText>
            <div className="flex items-center gap-x-1">
                <button
                    onClick={() => setCreateOrganizationModal(true)}
                    type="button"
                    className="bg-zinc-500/30 text-xs px-3 py-1  text-[#f5a331] rounded-[6px] shadow-md shadow-zinc-900/40 hover:shadow-lg active:scale-95 transition-all duration-200 hover:-translate-y-0.5">
                    Get Started
                </button>
                <WhiteText className="text-xs">
                    by creating one.
                </WhiteText>
            </div>
        </div>
    );
};

export default EmptyStateComponent;