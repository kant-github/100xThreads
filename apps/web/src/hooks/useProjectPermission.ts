// src/hooks/useProjectPermission.ts

import { useRecoilValue } from "recoil";
import { userSessionAtom } from "@/recoil/atoms/atom";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { checkProjectPermission, ProjectPermission } from "@/rbac/projectPermissions";
import { ProjectTypes } from "types/types";


export function useProjectPermission(project: ProjectTypes | null) {
  const session = useRecoilValue(userSessionAtom);

  const organizationUser = useRecoilValue(organizationUserAtom);

  // Return a simple function to check permissions
  const hasPermission = (permission: ProjectPermission): boolean => {
    if (!organizationUser.id || !project || !organizationUser.role) {
      return false;
    }

    return checkProjectPermission(
      organizationUser.id,
      project.id,
      permission,
      organizationUser.role,
      project.members!
    );
  };

  return {
    hasPermission,
    canView: hasPermission(ProjectPermission.VIEW),
    canEdit: hasPermission(ProjectPermission.EDIT),
    canManage: hasPermission(ProjectPermission.MANAGE),
  };
}