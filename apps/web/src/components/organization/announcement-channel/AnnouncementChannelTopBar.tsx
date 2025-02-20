import DesignButton from "@/components/buttons/DesignButton";
import CreateAnnouncementForm from "@/components/form/announcementForm/CreateAnnouncementForm";
import GuardComponent from "@/rbac/GuardComponent";
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
        <div className="mr-4 absolute top-6 right-3">

            <GuardComponent action={Action.CREATE} subject={Subject.ANNOUNCEMENT} >
                <DesignButton onClick={() => setCreateAnnouncementModal(prev => !prev)} className="group">
                    <CgMathPlus size={16} />
                    Create Announcement
                </DesignButton>
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