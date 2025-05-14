import { UserRole, ProjectMemberRole, ProjectMemberType } from "types/types";

export enum ProjectPermission {
  VIEW = "view",
  EDIT = "edit",
  MANAGE = "manage",
  DELETE = 'delete'
}

const PROJECT_PERMISSIONS = {
  [ProjectMemberRole.ADMIN]: [
    ProjectPermission.VIEW,
    ProjectPermission.EDIT,
    ProjectPermission.MANAGE,
    ProjectPermission.DELETE
  ],
  [ProjectMemberRole.MEMBER]: [
    ProjectPermission.VIEW,
    ProjectPermission.EDIT,
    ProjectPermission.MANAGE,
  ]
};

const ORG_ROLE_OVERRIDES = {
  [UserRole.ADMIN]: [ProjectPermission.VIEW, ProjectPermission.EDIT, ProjectPermission.MANAGE],
  [UserRole.MODERATOR]: [ProjectPermission.VIEW, ProjectPermission.EDIT],
  [UserRole.IT_SUPPORT]: [ProjectPermission.VIEW, ProjectPermission.EDIT],
  [UserRole.OBSERVER]: [ProjectPermission.VIEW]
};

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

  console.log("organization user id : ", organizationUserId);
  console.log("permission is : ", permission);
  console.log("project members are : ", projectMembers);

  const userProjectMember = projectMembers.find(member => member.org_user_id === organizationUserId);

  if (!userProjectMember) {
    return false;
  }

  if (!PROJECT_PERMISSIONS[userProjectMember.role]) {
    return false
  };

  return PROJECT_PERMISSIONS[userProjectMember.role]?.includes(permission) || false;
}