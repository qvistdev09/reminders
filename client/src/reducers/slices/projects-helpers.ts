import { ProjectObject } from 'reminders-shared/sharedTypes';

const findProject = (projectId: number, projectsArray: ProjectObject[]) => {
  return projectsArray.find(project => project.projectId === projectId);
};

const findPermission = (projectId: number, uid: string, projectsArray: ProjectObject[]) => {
  const matchedProject = findProject(projectId, projectsArray);
  if (matchedProject) {
    return matchedProject.permissions.find(permission => permission.uid === uid);
  }
  return null;
};

export { findProject, findPermission };
