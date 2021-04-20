import { PermissionOrderSet, PermissionOrder, PermissionRole } from 'reminders-shared/sharedTypes';
import { Project } from '../../database/root';
import { getAllAppUsers } from '../services/user-service';

const checkRole = (str: string) => {
  if (typeof str === 'string' && ['viewer', 'editor', 'delete'].includes(str)) {
    return str as PermissionRole;
  }
  return null;
};

const confirmUsers = async (array: PermissionOrder[]) => {
  const userList = await getAllAppUsers();
  const checkedUsers = array.map(user => {
    const match = userList.find(oktaUser => oktaUser.uid === user.permissionUid);
    if (match) {
      return { ...user, exists: true };
    }
    return { ...user, exists: false };
  });
  return checkedUsers;
};

const validatePermissions = async (clientInput: any): Promise<PermissionOrderSet | null> => {
  const { orderSet } = clientInput;
  if (!orderSet) {
    return null;
  }
  const { projectId, assignments } = orderSet;
  if (typeof projectId !== 'number' || !Array.isArray(assignments) || assignments.length === 0) {
    return null;
  }
  const matchedProject = await Project.findOne({ where: { projectId } });
  if (!matchedProject) {
    return null;
  }
  const validatedAssignments: PermissionOrder[] = [];
  assignments.forEach((assignment: any) => {
    const { permissionUid, permissionRole } = assignment;
    const validatedRole = checkRole(permissionRole);
    if (typeof permissionUid === 'string' && validatedRole) {
      validatedAssignments.push({
        permissionUid,
        permissionRole: validatedRole,
      });
    }
  });
  const confirmedUsers = await confirmUsers(validatedAssignments)
    .then(list => list.filter(user => user.exists))
    .then(filteredList =>
      filteredList.map(confirmedUser => ({
        permissionUid: confirmedUser.permissionUid,
        permissionRole: confirmedUser.permissionRole,
      }))
    );
  if (confirmedUsers.length === 0) {
    return null;
  }
  // remove owner
  const confirmedUsersWithoutProjectOwner = confirmedUsers.filter(
    user => user.permissionUid !== matchedProject.projectOwner
  );
  return {
    projectId,
    assignments: confirmedUsersWithoutProjectOwner,
  };
};

export { validatePermissions };
