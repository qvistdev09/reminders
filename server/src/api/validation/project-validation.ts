import { NewProjectFields, ProjectVisibility } from 'reminders-shared/sharedTypes';
import { ProjectInstance } from '../../database/schemas/project';

const validVisibility = (str: string): str is ProjectVisibility => {
  return ['authorizedOnly', 'public', 'private'].includes(str);
};

export const validateProjectFields = (clientInput: any): NewProjectFields | null => {
  const { projectTitle, projectVisibility } = clientInput;
  if (!projectTitle || !projectVisibility) {
    return null;
  }
  if (typeof projectTitle !== 'string' || typeof projectVisibility !== 'string') {
    return null;
  }
  if (!validVisibility(projectVisibility)) {
    return null;
  }
  return {
    projectTitle,
    projectVisibility,
  };
};

export const projectIsDefined = (project: ProjectInstance | null): project is ProjectInstance => {
  return project !== null;
};
