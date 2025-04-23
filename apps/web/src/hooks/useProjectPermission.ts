import { useRecoilValue } from "recoil";
import { organizationUserAtom } from "@/recoil/atoms/organizationAtoms/organizationUserAtom";
import { checkProjectPermission, ProjectPermission } from "@/rbac/projectPermissions";
import { ProjectTypes } from "types/types";


export function useProjectPermission(project: ProjectTypes | null) {
  const organizationUser = useRecoilValue(organizationUserAtom);
  
  // Function to check specific permissions only when needed
  const checkSpecificPermission = (permission: ProjectPermission): boolean => {
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
    hasPermission: checkSpecificPermission,
    // These will only be calculated when the properties are accessed
    get canView() { return checkSpecificPermission(ProjectPermission.VIEW); },
    get canEdit() { return checkSpecificPermission(ProjectPermission.EDIT); },
    get canManage() { return checkSpecificPermission(ProjectPermission.MANAGE); },
  };
}