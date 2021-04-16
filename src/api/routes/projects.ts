import express, { NextFunction, Response } from 'express';
import RequestJwt from 'src/types/request-jwt';
import { authRequired } from 'src/middleware/auth-required';
import { createNewProject, getProjectsByUserId } from 'src/api/services/projects-service';
import { appendPermissionsToProject } from 'src/api/services/permissions-service';

const router = express.Router();

router.post('/', authRequired, (req: RequestJwt, res: Response, next: NextFunction) => {
  if (!req.jwt) {
    return res.status(401).end();
  }
  if (
    !req.body.project ||
    !req.body.project.projectTitle ||
    typeof req.body.project.projectTitle !== 'string'
  ) {
    return res.status(400).end();
  }
  const { uid } = req.jwt.claims;
  if (typeof uid !== 'string') {
    return res.status(400).end();
  }
  createNewProject(uid, req.body.project.projectTitle)
    .then(() => res.status(201).end())
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get(
  '/',
  authRequired,
  async (req: RequestJwt, res: Response, next: NextFunction) => {
    if (!req.jwt) {
      return res.status(401).end();
    }
    const { uid } = req.jwt.claims;
    if (typeof uid !== 'string') {
      return res.status(400).end();
    }
    try {
      const rawProjects = await getProjectsByUserId(uid);
      const projectsWithPermissions = await Promise.all(
        rawProjects.map(project => appendPermissionsToProject(project))
      );
      res.json({ projects: projectsWithPermissions });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
