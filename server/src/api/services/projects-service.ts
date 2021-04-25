import { PermissionRole, ProjectObject, UserInPermissionsGrid, UserObj } from 'reminders-shared/sharedTypes';
import { Transaction } from 'sequelize/types';
import { ControlledError } from '../../classes/controlled-error';
import { Project } from '../../database/root';
import { PermissionInstance } from '../../database/schemas/permission';
import { ProjectInstance } from '../../database/schemas/project';
import { NewProject } from '../../types';
import { getAllAppUsers } from './user-service';

export const getProjectsByUserId = (userId: string) =>
  Project.findAll({
    where: {
      projectOwner: userId,
    },
    order: [['createdAt', 'ASC']],
  });

export const createNewProject = (newProject: NewProject) => {
  const { projectTitle, projectOwner, projectVisibility } = newProject;
  return Project.create({
    projectTitle,
    projectOwner,
    projectVisibility,
  });
};

export const userIsOwner = async (projectOwner: string, projectId: number) => {
  const matchedProject = await Project.findOne({ where: { projectId, projectOwner } }).catch(() => {
    throw new ControlledError('Database malfunction', 500);
  });
  if (!matchedProject) {
    throw new ControlledError('Unauthorized', 401);
  }
};

export const findProject = (projectId: number) => Project.findOne({ where: { projectId } });

export const establishRole = (
  permissions: PermissionInstance[],
  project: ProjectInstance,
  uid: string
): PermissionRole | 'owner' | 'none' => {
  if (project.projectOwner === uid) {
    return 'owner';
  }
  const matchedPermission = permissions.find(permission => permission.permissionUid === uid);
  if (matchedPermission) {
    return matchedPermission.permissionRole;
  }
  return 'none';
};

export const structureProjectsDataForClient = (
  projects: { project: ProjectInstance; permissions: UserInPermissionsGrid[]; owner?: UserObj }[],
  userOwningAll?: UserObj
): ProjectObject[] => {
  return projects.map(({ project, permissions, owner }) => ({
    projectTitle: project.projectTitle,
    projectId: project.projectId as number,
    permissions,
    projectVisibility: project.projectVisibility,
    projectOwner: userOwningAll ? userOwningAll : (owner as UserObj),
  }));
};

const projectIsDefined = (project: ProjectInstance | null): project is ProjectInstance => {
  return project !== null;
};

export const findProjectsByPermissions = (permissions: PermissionInstance[]) => {
  return Promise.all(
    permissions.map(async permission => {
      try {
        return await Project.findOne({ where: { projectId: permission.projectId } });
      } catch (err) {
        throw err;
      }
    })
  ).then(projects => projects.filter(projectIsDefined));
};

export const attachOwnersToManyProjects = async (
  projects: { project: ProjectInstance; permissions: UserInPermissionsGrid[] }[],
  catalog?: UserObj[]
) => {
  try {
    const users = catalog ? catalog : await getAllAppUsers();
    return projects.map(({ project, permissions }) => {
      const matchedOwner = users.find(user => user.uid === project.projectOwner);
      if (!matchedOwner) {
        throw new ControlledError('Cannot find owner for project', 500);
      }
      return {
        project,
        permissions,
        owner: matchedOwner,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const destroyProject = (project: ProjectInstance, transaction: Transaction) => {
  return project.destroy({ transaction });
};
