import { AiOutlineConsoleSql } from "react-icons/ai";
import { UserRole, ProjectMemberRole, ProjectMemberType } from "types/types";

// A simpler set of actions that can be performed within a project
export enum ProjectPermission {
  VIEW = "view",
  EDIT = "edit",
  MANAGE = "manage" // Full control over project
}

// Define the permissions map for project roles
const PROJECT_PERMISSIONS = {
  [ProjectMemberRole.ADMIN]: [
    ProjectPermission.VIEW,
    ProjectPermission.EDIT,
    ProjectPermission.MANAGE
  ],
  [ProjectMemberRole.MEMBER]: [
    ProjectPermission.VIEW,
    ProjectPermission.EDIT
  ]
};

// Define which organization roles have special access to projects regardless of project membership
const ORG_ROLE_OVERRIDES = {
  [UserRole.ADMIN]: [ProjectPermission.VIEW, ProjectPermission.EDIT, ProjectPermission.MANAGE],
  [UserRole.MODERATOR]: [ProjectPermission.VIEW, ProjectPermission.EDIT],
  [UserRole.IT_SUPPORT]: [ProjectPermission.VIEW, ProjectPermission.EDIT],
  [UserRole.OBSERVER]: [ProjectPermission.VIEW]
  // Other roles don't have special project permissions by default
};

/**
 * Check if a user has a specific permission for a project
 */


export function checkProjectPermission(
  organizationUserId: number,
  projectId: string,
  permission: ProjectPermission,
  userOrgRole: UserRole,
  projectMembers: ProjectMemberType[]
): boolean {
  // Check if user has organization-level override
  // if (ORG_ROLE_OVERRIDES[userOrgRole]?.includes(permission)) {
  //   return true;
  // }
  console.log("------------------------------------------------------------ >");
  console.log("organization user id is : ", organizationUserId);
  console.log("project id is : ", projectId);
  console.log("permission is : ", permission);
  console.log("project members are : ", projectMembers);

  // Find the user's role in this specific project
  const userProjectMember = projectMembers.find(member => member.org_user_id === organizationUserId);
  console.log("whether current user exists ? ", userProjectMember);
  console.log("and its role is : ", userProjectMember?.role);
  if (!userProjectMember) {
    return false; // User is not a member of this project
  }

  const check = PROJECT_PERMISSIONS[userProjectMember.role]?.includes(permission);
  console.log("check is : ", check);

  // Check if the user's project role grants the permission
  return PROJECT_PERMISSIONS[userProjectMember.role]?.includes(permission) || false;
}