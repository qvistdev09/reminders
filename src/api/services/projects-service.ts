import { Project } from '../../database/root';

const getProjectsByUserId = (userId: string) =>
  Project.findAll({
    where: {
      projectOwner: userId,
    },
  });

const createNewProject = (userId: string, projectTitle: string) =>
  Project.create({
    projectTitle,
    projectOwner: userId,
  });

const userIsOwner = async (projectOwner: string, projectId: number) => {
  const matchedProject = await Project.findOne({ where: { projectId, projectOwner } });
  if (matchedProject) {
    return true;
  }
  return false;
};

export { getProjectsByUserId, createNewProject, userIsOwner };
