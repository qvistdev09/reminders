import { Project } from '../../database/root';
import { NewProject } from '../../types/index';

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
  const matchedProject = await Project.findOne({ where: { projectId, projectOwner } });
  if (matchedProject) {
    return true;
  }
  return false;
};

export { getProjectsByUserId, createNewProject, userIsOwner };
