import express, { NextFunction, Request, Response } from 'express';
import { Permission, Project, Task } from '../../database/root';
import { authAppend } from '../../middleware/auth-append';
import { authRequired } from '../../middleware/auth-required';
import { appendPermissionsToProject, findProjectPermissions } from '../services/permissions-service';
import {
  createNewProject,
  establishRole,
  findProject,
  getProjectsByUserId,
} from '../services/projects-service';
import { projectIsDefined, validateParam, validateProjectFields } from '../validation/project-validation';
import { sequelize } from '../../config/db-config';
import { ControlledError } from '../../classes/controlled-error';
import { ProjectAccessResponse } from 'reminders-shared/sharedTypes';

const router = express.Router();

router.post('/', authRequired, (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.project) {
    return next(new ControlledError('Invalid input', 400));
  }
  const { uid } = req.jwt.claims;

  const validatedFields = validateProjectFields(req.body.project);
  if (!validatedFields) {
    return next(new ControlledError('Invalid input', 400));
  }

  const newProject = {
    ...validatedFields,
    projectOwner: uid,
  };

  createNewProject(newProject)
    .then(() => res.status(201).end())
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:projectIdString', authAppend, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = validateParam(req.params.projectIdString);
    const matchedProject = await findProject(projectId);
    if (!matchedProject) {
      throw new ControlledError('No project found', 404);
    }
    const permissions = await findProjectPermissions(projectId);
    const role = req.jwt ? establishRole(permissions, matchedProject, req.jwt.claims.uid) : 'none';
    const { projectVisibility } = matchedProject;
    const response: ProjectAccessResponse = {
      role,
      projectVisibility,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.get('/', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { ownership } = req.query;
  if (typeof ownership !== 'string' || !['mine', 'others'].includes(ownership)) {
    return res.status(400).send('missing valid ownership query');
  }
  const { uid } = req.jwt.claims;
  if (ownership === 'mine') {
    try {
      const rawProjects = await getProjectsByUserId(uid);
      const projectsWithPermissions = await Promise.all(
        rawProjects.map(project => appendPermissionsToProject(project))
      );
      res.json({ projects: projectsWithPermissions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    try {
      const userPermissions = await Permission.findAll({ where: { permissionUid: uid } });
      const authorizedProjects = await Promise.all(
        userPermissions.map(permission => Project.findOne({ where: { projectId: permission.projectId } }))
      );
      const filterNulls = authorizedProjects.filter(projectIsDefined);
      const noSelfOwned = filterNulls.filter(project => project.projectOwner !== uid);
      const completedObjects = await Promise.all(noSelfOwned.map(proj => appendPermissionsToProject(proj)));
      res.json({ projects: completedObjects });
    } catch (err) {
      res.status(500).send('Database error');
    }
  }
});

router.put('/:projectId', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.jwt.claims;
  const { projectId } = req.params;
  const parsedId = parseInt(projectId, 10);

  if (isNaN(parsedId)) {
    return res.status(400).send('bad project id');
  }

  if (!req.body || !req.body.project || !req.body.project.projectVisibility) {
    return res.status(400).send('no body');
  }
  const { projectVisibility } = req.body.project;
  if (!['public', 'private', 'authorizedOnly'].includes(projectVisibility)) {
    return res.status(400).send('bad visibility');
  }

  const matchedProject = await Project.findOne({ where: { projectId: parsedId } });
  if (!matchedProject) {
    return res.status(404).send('no such project');
  }
  if (matchedProject.projectOwner !== uid) {
    return res.status(400).send('not product owner');
  }
  matchedProject.projectVisibility = projectVisibility;
  await matchedProject.save();
  res.status(204).end();
});

router.delete('/:projectId', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.jwt.claims;
  const { projectId } = req.params;
  const parsedId = parseInt(projectId, 10);

  if (isNaN(parsedId)) {
    return res.status(400).send('bad project id');
  }

  const matchedProject = await Project.findOne({ where: { projectId: parsedId } });
  if (!matchedProject) {
    return res.status(404).send('no such project');
  }
  if (matchedProject.projectOwner !== uid) {
    return res.status(400).send('not product owner');
  }

  const t = await sequelize.transaction();
  try {
    const projectId = matchedProject.projectId as number;
    await matchedProject.destroy({ transaction: t });
    await Permission.destroy({ where: { projectId }, transaction: t });
    await Task.destroy({ where: { projectId }, transaction: t });
    await t.commit();
    res.status(204).send('Project deleted');
  } catch (err) {
    res.status(500).send('DB error - could not delete project');
  }
});

export default router;
