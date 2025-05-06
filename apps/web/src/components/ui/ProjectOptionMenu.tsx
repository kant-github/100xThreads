import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UtilityOptionMenuCard from "../utility/UtilityOptionMenuCard";
import UtilitySideBar from "../utility/UtilitySideBar";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import ProjectTasksTicker from "../utility/tickers/ProjectTasksTicker";
import { LiaTasksSolid } from "react-icons/lia";
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import {
    OrganizationUsersType,
    ProjectMemberRole,
    ProjectMemberType,
    ProjectTypes,
} from "types/types";
import OptionImage from "./OptionImage";
import Image from "next/image";
import SearchInput from "../utility/SearchInput";
import { useWebSocket } from "@/hooks/useWebsocket";
import InputBox from "../utility/InputBox";
import { WhiteBtn } from "../buttons/WhiteBtn";

interface ProjectOptionMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    isAdmin?: boolean;
}

export default function ProjectOptionMenu({
    open,
    setOpen,
    isAdmin = false,
}: ProjectOptionMenuProps) {
    const [openProjectMemberMenu, setOpenProjectMemberMenu] =
        useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useRecoilState<ProjectTypes | null>(
        projectSelectedAtom
    );
    const organizationUsers = useRecoilValue<OrganizationUsersType[]>(
        organizationUsersAtom
    );
    const { sendMessage } = useWebSocket();

    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Set selected members when sidebar opens or project changes
    useEffect(() => {
        if (openProjectMemberMenu && selectedProject?.members) {
            setSelectedMembers(
                selectedProject.members.map((member) => member.org_user_id)
            );
        }
    }, [openProjectMemberMenu, selectedProject]);

    const addMemberController = () => {
        setOpen(false);
        setOpenProjectMemberMenu(true);
    };

    const isMember = (orgUserId: number) => selectedMembers.includes(orgUserId);

    const handleMemberToggle = (orgUserId: number) => {
        const newSelectedMembers = isMember(orgUserId)
            ? selectedMembers.filter((id) => id !== orgUserId)
            : [...selectedMembers, orgUserId];

        setSelectedMembers(newSelectedMembers);
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        if (selectedProject) {
            const updatedMembers: ProjectMemberType[] = selectedMembers.map((orgUserId) => {
                const existingMember = selectedProject.members?.find(
                    (member) => member.org_user_id === orgUserId
                );

                if (existingMember) return existingMember;

                const orgUser = organizationUsers.find((user) => user.id === orgUserId);

                return {
                    id: 0,
                    project_id: selectedProject.id,
                    org_user_id: orgUserId,
                    role: ProjectMemberRole.MEMBER,
                    joined_at: new Date(),
                    organization_user: orgUser as OrganizationUsersType,
                };
            });

            setSelectedProject({
                ...selectedProject,
                members: updatedMembers,
            });

            const payload = {
                channelId: selectedProject.channel_id,
                project_id: selectedProject.id,
                members: selectedMembers.map((id) => ({ org_user_id: id })),
                projectName: selectedProject.title,
            };

            sendMessage(payload, selectedProject.channel_id, "project-member-change");

            setHasChanges(false);
            setOpenProjectMemberMenu(false);
        }
    };

    const handleCancel = () => {
        if (selectedProject?.members) {
            setSelectedMembers(
                selectedProject.members.map((member) => member.org_user_id)
            );
        }
        setHasChanges(false);
    };

    const filteredUsers = organizationUsers.filter((orgUser) => {
        const query = searchQuery.toLowerCase();
        const name = orgUser.user.name?.toLowerCase() || "";
        const email = orgUser.user.email?.toLowerCase() || "";
        return name.includes(query) || email.includes(query);
    });

    return (
        <>
            <UtilityOptionMenuCard open={open} setOpen={setOpen}>
                <div className="absolute z-[100] flex flex-col items-start w-36 right-0 rounded-[6px] text-[12px] overflow-hidden p-1 dark:bg-neutral-800 border-[0.5px] border-neutral-500 dark:text-neutral-300">
                    <button
                        onClick={addMemberController}
                        type="button"
                        className="px-3 py-1 w-full dark:hover:bg-[#2e2e2e] flex items-start rounded-[4px]"
                    >
                        Manage members
                    </button>
                </div>
            </UtilityOptionMenuCard>

            <UtilitySideBar
                content={
                    <div className="h-full flex flex-col gap-y-4 px-5 py-4 min-w-[300px] relative">
                        <div className="flex flex-row absolute top-4 right-4">
                            <ProjectTasksTicker>
                                <LiaTasksSolid size={14} />
                                {selectedProject?.tasks?.length || 0} tasks
                            </ProjectTasksTicker>
                        </div>

                        <DashboardComponentHeading
                            description={selectedProject?.description || ""}
                        >
                            {selectedProject?.title}
                        </DashboardComponentHeading>

                        <InputBox value={searchQuery} onChange={setSearchQuery} placeholder="Search for users" />
                        <div className="flex flex-col space-y-2 mt-2 max-h-[50vh] overflow-y-auto">
                            {filteredUsers.map((orgUser) => (
                                <div
                                    key={orgUser.id}
                                    className="flex items-center p-2 pl-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-[8px]"
                                >
                                    <input
                                        type="checkbox"
                                        id={`user-${orgUser.id}`}
                                        checked={isMember(orgUser.id)}
                                        onChange={() => handleMemberToggle(orgUser.id)}
                                        className="mr-3 cursor-pointer appearance-none h-4 w-4 rounded-md bg-gray-200 border border-gray-300 checked:bg-yellow-500 checked:border-yellow-500 checked:before:content-['✔'] checked:before:text-white checked:before:text-[10px] checked:before:font-bold checked:before:flex checked:before:justify-center checked:before:items-center transition-colors duration-200"
                                        disabled={!isAdmin}
                                    />
                                    <label
                                        htmlFor={`user-${orgUser.id}`}
                                        className="flex items-center gap-x-2 cursor-pointer"
                                    >
                                        <OptionImage
                                            content={
                                                <Image
                                                    className="rounded-full"
                                                    src={orgUser.user.image}
                                                    width={36}
                                                    height={36}
                                                    alt={orgUser.user.name}
                                                />
                                            }
                                            userId={orgUser.user.id}
                                            organizationId={orgUser.organization_id}
                                        />
                                        <div>
                                            <div className="text-sm font-medium">
                                                {orgUser.user?.name || "User"}
                                            </div>
                                            <div className="text-xs text-neutral-500">
                                                {orgUser.user?.email}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {isAdmin && (
                            <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm rounded-[8px] border border-neutral-300 dark:border-neutral-600 dark:text-neutral-300"
                                    disabled={!hasChanges}
                                >
                                    Cancel
                                </button>
                                <WhiteBtn
                                    onClick={handleSaveChanges}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-[8px] disabled:opacity-50"
                                    disabled={!hasChanges}
                                >
                                    Confirm Changes
                                </WhiteBtn>
                            </div>
                        )}
                    </div>
                }
                open={openProjectMemberMenu}
                setOpen={setOpenProjectMemberMenu}
                width="1/4"
            />
        </>
    );
}
