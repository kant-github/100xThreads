import DesignButton from "@/components/buttons/DesignButton";
import DashboardComponentHeading from "@/components/dashboard/DashboardComponentHeading";
import CreateAnnouncementForm from "@/components/form/announcementForm/CreateAnnouncementForm";
import { Button } from "@/components/ui/button";
import GuardComponent from "@/rbac/GuardComponent";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { CgMathPlus } from "react-icons/cg";
import { Action, Subject } from "types/permission";
import { ChannelType } from "types/types";

interface AnnouncementChannelTopBarProps {
    channel: ChannelType;
    createAnnoucementModal: boolean;
    setCreateAnnouncementModal: Dispatch<SetStateAction<boolean>>;
}

export default function ({ channel, createAnnoucementModal, setCreateAnnouncementModal }: AnnouncementChannelTopBarProps) {
    return (
        <div className="flex flex-row relative justify-between w-full">


            <DashboardComponentHeading description={channel.description!}>{channel.title}</DashboardComponentHeading>

            <GuardComponent action={Action.CREATE} subject={Subject.ANNOUNCEMENT}>
                <Button
                    onClick={() => setCreateAnnouncementModal(prev => !prev)}
                    className="flex items-center justify-center border-[1px] border-neutral-700 text-xs rounded-[8px] text-neutral-300 group"
                    variant={"outline"}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Announcement
                </Button>
            </GuardComponent>

            {createAnnoucementModal && (
                <CreateAnnouncementForm
                    channel={channel}
                    createAnnoucementModal={createAnnoucementModal}
                    setCreateAnnouncementModal={setCreateAnnouncementModal}
                    className="z-50"
                />
            )}
        </div>
    )
}