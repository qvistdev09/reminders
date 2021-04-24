import express, { NextFunction, Request, Response } from 'express';
import { authAppend } from '../../middleware/auth-append';
import { authRequired } from '../../middleware/auth-required';
import {
  attachPermissionsToProjects,
  destroyPermissionsByProjectId,
  findPermissionsByUserId,
  findProjectPermissions,
} from '../services/permissions-service';
import {
  attachOwnersToManyProjects,
  createNewProject,
  destroyProject,
  establishRole,
  findProject,
  findProjectsByPermissions,
  getProjectsByUserId,
  structureProjectsDataForClient,
} from '../services/projects-service';
import {
  validateOwnershipQuerystring,
  validateParam,
  validateProjectFields,
  validateProjectVisibillity,
} from '../validation/project-validation';
import { sequelize } from '../../config/db-config';
import { ControlledError } from '../../classes/controlled-error';
import { ProjectAccessResponse } from 'reminders-shared/sharedTypes';
import { appendNamesToManyProjects, getAllAppUsers, getNameFromOkta } from '../services/user-service';
import { destroyTasksByProjectId } from '../services/tasks-service';

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
  try {
    const userCatalog = await getAllAppUsers();
    const ownership = validateOwnershipQuerystring(req.query.ownership);
    const { uid } = req.jwt.claims;
    if (ownership === 'mine') {
      const ownerUserObj = await getNameFromOkta(uid);
      const projects = await getProjectsByUserId(uid)
        .then(attachPermissionsToProjects)
        .then(projects => appendNamesToManyProjects(projects, userCatalog))
        .then(projects => structureProjectsDataForClient(projects, ownerUserObj));
      res.json({ projects });
    } else {
      const projects = await findPermissionsByUserId(uid)
        .then(findProjectsByPermissions)
        .then(attachPermissionsToProjects)
        .then(projects => appendNamesToManyProjects(projects, userCatalog))
        .then(projects => attachOwnersToManyProjects(projects, userCatalog))
        .then(structureProjectsDataForClient);
      res.json({ projects });
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:projectId', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.jwt.claims;
    const projectId = validateParam(req.params.projectId);
    const newVisibility = validateProjectVisibillity(req.body);
    const matchedProject = await findProject(projectId);
    if (!matchedProject) {
      throw new ControlledError('Not found', 404);
    }
    if (matchedProject.projectOwner !== uid) {
      throw new ControlledError('Unauthorized', 401);
    }
    matchedProject.projectVisibility = newVisibility;
    await matchedProject.save();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.delete('/:projectId', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.jwt.claims;
    const projectId = validateParam(req.params.projectId);
    const matchedProject = await findProject(projectId);
    if (!matchedProject) {
      throw new ControlledError('Not found', 404);
    }
    if (matchedProject.projectOwner !== uid) {
      throw new ControlledError('Unauthorized', 401);
    }
    const transaction = await sequelize.transaction();
    await Promise.all([
      destroyProject(matchedProject, transaction),
      destroyPermissionsByProjectId(projectId, transaction),
      destroyTasksByProjectId(projectId, transaction),
    ]);
    await transaction.commit();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
