import express, { NextFunction, Request, Response } from 'express';
import { ProjectRequestHandler } from '../../classes/get-project-handler';
import { Project } from '../../database/root';
import { authAppend } from '../../middleware/auth-append';
import { authRequired } from '../../middleware/auth-required';
import { appendPermissionsToProject } from '../services/permissions-service';
import { createNewProject, getProjectsByUserId } from '../services/projects-service';
import { validateProjectFields } from '../validation/project-validation';

const router = express.Router();

router.post('/', authRequired, (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.project) {
    return res.status(400).end();
  }
  const { uid } = req.jwt.claims;

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

router.get('/:projectIdString', authAppend, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // prettier-ignore
    const handler = await new ProjectRequestHandler(req, res)
      .prepareNewRequest()
      .validateParam()
      .findProject();

    // prettier-ignore
    handler
      .establishRole()
      .sendResponse();
  } catch (err) {
    next(err);
  }
});

router.get('/', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.jwt.claims;
  try {
    const rawProjects = await getProjectsByUserId(uid);
    const projectsWithPermissions = await Promise.all(
      rawProjects.map(project => appendPermissionsToProject(project))
    );
    res.json({ projects: projectsWithPermissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

export default router;
