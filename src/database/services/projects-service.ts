import { Project } from '../schemas/project';

const getProjectsByUserId = async (userId: string) => {
  const usersProjects = await Project.findAll({
    where: {
      projectOwner: userId,
    },
  });
  return usersProjects;
};

export { getProjectsByUserId };
