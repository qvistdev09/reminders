import { Project } from '../../database/schemas/project';

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

export { getProjectsByUserId, createNewProject };
