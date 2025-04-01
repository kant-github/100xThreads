import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UtilityOptionMenuCard from "../utility/UtilityOptionMenuCard";
import UtilitySideBar from "../utility/UtilitySideBar";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectSelectedAtom } from "@/recoil/atoms/projects/projectSelectedAtom";
import DashboardComponentHeading from "../dashboard/DashboardComponentHeading";
import ProjectTasksTicker from "../utility/tickers/ProjectTasksTicker";
import { LiaTasksSolid } from "react-icons/lia";
import { organizationUsersAtom } from "@/recoil/atoms/organizationAtoms/organizationUsersAtom";
import { OrganizationUsersType, ProjectMemberRole, ProjectMemberType, ProjectTypes } from "types/types";
import OptionImage from "./OptionImage";
import Image from "next/image";

interface ProjectOptionMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    isAdmin?: boolean;
}

export default function ProjectOptionMenu({ open, setOpen, isAdmin = false }: ProjectOptionMenuProps) {
    const [openProjectMemberMenu, setOpenProjectMemberMenu] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useRecoilState<ProjectTypes | null>(projectSelectedAtom);
    const organizationUsers = useRecoilValue<OrganizationUsersType[]>(organizationUsersAtom);

    // State to track selected members by org_user_id
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [hasChanges, setHasChanges] = useState<boolean>(false);

    // Initialize selected members when the sidebar opens or project changes
    useEffect(() => {
        if (openProjectMemberMenu && selectedProject?.members) {
            // Extract org_user_id from project members
            setSelectedMembers(selectedProject.members.map(member => member.org_user_id));
        }
    }, [openProjectMemberMenu, selectedProject]);

    function addMemberController() {
        setOpen(false);
        setOpenProjectMemberMenu(true);
    }

    // Check if a user is a member of the current project
    const isMember = (orgUserId: number) => {
        return selectedMembers.includes(orgUserId);
    };

    // Handle checkbox change
    const handleMemberToggle = (orgUserId: number) => {
        let newSelectedMembers: number[];

        if (isMember(orgUserId)) {
            // Remove member
            newSelectedMembers = selectedMembers.filter(id => id !== orgUserId);
        } else {
            // Add member
            newSelectedMembers = [...selectedMembers, orgUserId];
        }

        setSelectedMembers(newSelectedMembers);
        setHasChanges(true);
    };

    // Save changes
    const handleSaveChanges = () => {
        // Here you would typically make an API call to update the project members
        if (selectedProject) {
            // Create new project member objects for the selected org users
            const updatedMembers: ProjectMemberType[] = selectedMembers.map(orgUserId => {
                // Check if this member already exists in the project
                const existingMember = selectedProject.members?.find(
                    member => member.org_user_id === orgUserId
                );

                // If the member exists, keep their data
                if (existingMember) {
                    return existingMember;
                }

                // Find the org user to get their details
                const orgUser = organizationUsers.find(user => user.id === orgUserId);

                // Create a new project member
                return {
                    id: 0, // This would be assigned by your backend
                    project_id: selectedProject.id,
                    org_user_id: orgUserId,
                    role: ProjectMemberRole.MEMBER, // Default role for new members
                    joined_at: new Date(),
                    organization_user: orgUser as OrganizationUsersType
                };
            });

            // Update the project with new members
            setSelectedProject({
                ...selectedProject,
                members: updatedMembers
            });

            setHasChanges(false);
            // Optionally close the sidebar after saving
            // setOpenProjectMemberMenu(false);
        }
    };

    // Cancel changes
    const handleCancel = () => {
        // Reset selected members to current project members
        if (selectedProject?.members) {
            setSelectedMembers(selectedProject.members.map(member => member.org_user_id));
        }
        setHasChanges(false);
    };

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
                    <div className="h-full flex flex-col px-5 py-4 min-w-[300px] relative">
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

                        <div className="mt-3 text-sm font-normal mb-4">
                            {selectedProject?.members?.length || 0} members
                        </div>

                        <div className="flex flex-col space-y-2 mt-2 max-h-[50vh] overflow-y-auto">
                            {organizationUsers.map((orgUser) => (
                                <div key={orgUser.id} className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md">
                                    <input
                                        type="checkbox"
                                        id={`user-${orgUser.id}`}
                                        checked={isMember(orgUser.id)}
                                        onChange={() => handleMemberToggle(orgUser.id)}
                                        className="mr-3 h-4 w-4 cursor-pointer"
                                        disabled={!isAdmin}
                                    />
                                    <label
                                        htmlFor={`user-${orgUser.id}`}
                                        className="flex items-center gap-x-2 cursor-pointer"
                                    >
                                        <OptionImage content={
                                            <Image
                                                className="rounded-full"
                                                src={orgUser.user.image}
                                                width={36}
                                                height={36}
                                                alt={orgUser.user.name}
                                            />
                                        }
                                            userId={orgUser.user.id} organizationId={orgUser.organization_id} />
                                        <div>
                                            <div className="text-sm font-medium">{orgUser.user?.name || "User"}</div>
                                            <div className="text-xs text-neutral-500">{orgUser.user?.email}</div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {isAdmin && (
                            <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 dark:text-neutral-300"
                                    disabled={!hasChanges}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50"
                                    disabled={!hasChanges}
                                >
                                    Confirm Changes
                                </button>
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