import { Project } from '../../database/schemas/project';
import { ProjectInstance } from '../../database/schemas/project';

const getProjectsByUserId = (userId: string) =>
  Project.findAll({
    where: {
      projectOwner: userId,
    },
  }).then((projects: ProjectInstance[]) =>
    projects.map(project => ({ projectTitle: project.projectTitle }))
  );

const createNewProject = (userId: string, projectTitle: string) =>
  Project.create({
    projectTitle,
    projectOwner: userId,
  });

export { getProjectsByUserId, createNewProject };
