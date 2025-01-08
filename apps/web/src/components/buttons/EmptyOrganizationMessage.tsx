import { useSetRecoilState } from "recoil";
import { createOrganizationAtom } from "@/recoil/atoms/atom";
import Image from "next/image";

const EmptyStateComponent = () => {
    const setCreateOrganizationModal = useSetRecoilState(createOrganizationAtom);

    return (
        <div className="flex flex-col sm:flex-col items-center justify-center gap-2 sm:gap-x-1 px-4 sm:px-0 sm:mr-16 h-full text-center sm:text-left max-w-[90%] mx-auto sm:max-w-none">
            <div className="bg-yellow-600/70 rounded-[12px]">
                <Image src="/images/empty.png" width={100} height={40} alt="empty" className="p-3" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-semibold tracking-wide text-zinc-400">Currently no organization</h1>
                <p className="text-xs font-normal tracking-wide text-zinc-400">Create your first organization and begin building your community today.</p>
                <button
                    onClick={() => setCreateOrganizationModal(true)}
                    type="button"
                    className="bg-zinc-500/30 text-xs px-4 py-1.5  text-[#f5a331] rounded-[6px] shadow-md shadow-zinc-900/40 hover:shadow-lg active:scale-95 transition-all duration-200 hover:-translate-y-0.5 mt-2">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default EmptyStateComponent;