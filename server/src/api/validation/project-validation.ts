import { NewProjectFields, ProjectVisibility } from 'reminders-shared/sharedTypes';
import { ControlledError } from '../../classes/controlled-error';
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

export const validateParam = (param: any) => {
  if (param && typeof param === 'string') {
    const parsed = parseInt(param, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  throw new ControlledError('Invalid param', 400);
};

export const validateOwnershipQuerystring = (query: any) => {
  const ownerships = ['mine', 'others'];
  if (query && typeof query === 'string' && ownerships.includes(query)) {
    return query;
  }
  throw new ControlledError('Invalid query string', 400);
};

export const validateProjectVisibillity = (body: any) => {
  if (!body || !body.project || !body.project.projectVisibility) {
    throw new ControlledError('Invalid input', 400);
  }
  const { projectVisibility } = body.project;
  const validSettings = ['authorizedOnly', 'public', 'private'];
  if (typeof projectVisibility !== 'string' || !validSettings.includes(projectVisibility)) {
    throw new ControlledError('Invalid input', 400);
  }
  return projectVisibility as ProjectVisibility;
};
