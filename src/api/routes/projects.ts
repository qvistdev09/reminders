import express, { NextFunction, Response } from 'express';
import RequestJwt from '../../types/request-jwt';
import { authRequired } from '../../middleware/auth-required';
import { authAppend } from '../../middleware/auth-append';
import { createNewProject, getProjectsByUserId } from '../services/projects-service';
import { appendPermissionsToProject } from '../services/permissions-service';
import { Project } from '../../database/root';
import { validateProjectFields } from '../validation/project-validation';

const router = express.Router();

router.post('/', authRequired, (req: RequestJwt, res: Response, next: NextFunction) => {
  if (!req.jwt) {
    return res.status(401).end();
  }
  if (!req.body.project) {
    return res.status(400).end();
  }
  const { uid } = req.jwt.claims;
  if (typeof uid !== 'string') {
    return res.status(400).end();
  }

  const validatedFields = validateProjectFields(req.body.project);
  if (!validatedFields) {
    return res.status(400).end();
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

router.get('/:projectIdString', authAppend, async (req: RequestJwt, res: Response, next: NextFunction) => {
  const { projectIdString } = req.params;
  const projectId = parseInt(projectIdString, 10);
  if (isNaN(projectId)) {
    return res.status(404).end();
  }
  const matchedProject = await Project.findOne({ where: { projectId } });
  if (!matchedProject) {
    return res.status(404).end();
  }
});

router.get('/', authRequired, async (req: RequestJwt, res: Response, next: NextFunction) => {
  if (!req.jwt) {
    return res.status(401).end();
  }
  const { uid } = req.jwt.claims;
  if (typeof uid !== 'string') {
    return res.status(400).end();
  }
  try {
    const rawProjects = await getProjectsByUserId(uid);
    const projectsWithPermissions = await Promise.all(rawProjects.map(project => appendPermissionsToProject(project)));
    res.json({ projects: projectsWithPermissions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
