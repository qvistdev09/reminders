import { PermissionOrderSet, PermissionOrder, PermissionRole } from 'reminders-shared/sharedTypes';
import { ControlledError } from '../../classes/controlled-error';
import { Project } from '../../database/root';
import { getAllAppUsers } from '../services/user-service';

const checkRole = (str: string) => {
  if (typeof str === 'string' && ['viewer', 'editor'].includes(str)) {
    return str as PermissionRole;
  }
  return null;
};

const confirmUsers = (array: PermissionOrder[]): Promise<PermissionOrder[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userList = await getAllAppUsers();
      const filteredOrders = array.filter(order => {
        const match = userList.find(user => user.uid === order.permissionUid);
        if (match) {
          return true;
        }
        return false;
      });
      resolve(filteredOrders);
    } catch (err) {
      reject(err);
    }
  });
};

const filterOwner = (uid: string, array: PermissionOrder[]) =>
  array.filter(order => order.permissionUid !== uid);

const validateClientInput = (body: any): PermissionOrderSet | null => {
  const { orderSet } = body;
  if (!orderSet) {
    return null;
  }
  const { projectId, assignments } = orderSet;
  if (typeof projectId !== 'number' || !Array.isArray(assignments) || assignments.length === 0) {
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

  if (validatedAssignments.length === 0) {
    return null;
  }

  return {
    projectId,
    assignments: validatedAssignments,
  };
};

const validatePermissions = async (clientInput: any): Promise<PermissionOrderSet> => {
  const validatedInput = validateClientInput(clientInput);
  if (!validatedInput) {
    throw new ControlledError('Invalid permission orderset', 400);
  }

  const matchedProject = await Project.findOne({ where: { projectId: validatedInput.projectId } });
  if (!matchedProject) {
    throw new ControlledError('Project not found', 404);
  }

  const confirmedUsers = await confirmUsers(validatedInput.assignments);
  if (confirmedUsers.length === 0) {
    throw new ControlledError('No valid permission orders', 400);
  }
  return {
    projectId: validatedInput.projectId,
    assignments: filterOwner(matchedProject.projectOwner, confirmedUsers),
  };
};

export { validatePermissions };
