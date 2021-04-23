import { ControlledError } from '../../classes/controlled-error';
import { Project } from '../../database/root';
import { NewProject } from '../../types';

const getProjectsByUserId = (userId: string) =>
  Project.findAll({
    where: {
      projectOwner: userId,
    },
  });

const createNewProject = (newProject: NewProject) => {
  const { projectTitle, projectOwner, projectVisibility } = newProject;
  return Project.create({
    projectTitle,
    projectOwner,
    projectVisibility,
  });
};

const userIsOwner = async (projectOwner: string, projectId: number) => {
  const matchedProject = await Project.findOne({ where: { projectId, projectOwner } }).catch(() => {
    throw new ControlledError('Database malfunction', 500);
  });
  if (!matchedProject) {
    throw new ControlledError('Unauthorized', 401);
  }
};

export { getProjectsByUserId, createNewProject, userIsOwner };
