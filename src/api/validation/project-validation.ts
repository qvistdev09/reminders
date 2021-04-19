import { NewProjectFields, ProjectVisibility } from '../../types/index';

const validVisibility = (str: string): str is ProjectVisibility => {
  return ['authorizedOnly', 'public', 'private'].includes(str);
};

const validateProjectFields = (clientInput: any): NewProjectFields | null => {
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

export { validateProjectFields };
