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

  // Find the user's role in this specific project
  const userProjectMember = projectMembers.find(member => member.org_user_id === organizationUserId);

  if (!userProjectMember) {
    return false; // User is not a member of this project
  }

  if (!PROJECT_PERMISSIONS[userProjectMember.role]) {
    return false
  };

  return PROJECT_PERMISSIONS[userProjectMember.role]?.includes(permission) || false;
}