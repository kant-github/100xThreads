import DesignButton from "@/components/buttons/DesignButton";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface EmpytyAnnouncementChannelMessageProps {
    setCreateAnnouncementModal: Dispatch<SetStateAction<boolean>>;
}

export default function ({ setCreateAnnouncementModal }: EmpytyAnnouncementChannelMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center max-w-[90%] mx-auto">
            <div className="bg-yellow-600/70 rounded-[12px]">
                <Image src="/images/empty.png" width={100} height={40} alt="empty" className="p-3" />
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-semibold tracking-wide text-zinc-400">Currently no announcement</h1>
                <p className="text-xs font-normal tracking-wide text-zinc-400">Start creating announcement to be more .</p>
                <DesignButton
                    onClick={() => setCreateAnnouncementModal(true)}
                    type="button">
                    Create announcement
                </DesignButton>
            </div>
        </div >
    );
};