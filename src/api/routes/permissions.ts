import express, { NextFunction, Response } from 'express';
import RequestJwt from '../../types/request-jwt';
import { authRequired } from '../../middleware/auth-required';
import { userIsOwner } from '../services/projects-service';
import { addPermission } from '../services/permissions-service';
import { validatePermissions } from '../validation/permissions-validation';
import { affirmJwtString } from '../validation/jwt-string';

const router = express.Router();

router.post(
  '/',
  authRequired,
  async (req: RequestJwt, res: Response, next: NextFunction) => {
    const uid = affirmJwtString(req);
    if (!uid) {
      return res.status(401).end();
    }
    try {
      const validationResult = await validatePermissions(req.body);
      if (!validationResult) {
        return res.status(400).end();
      }
      const { assignments, projectId } = validationResult;
      const ownership = await userIsOwner(uid, projectId);
      if (!ownership) {
        return res.status(401).end();
      }
      await Promise.all(
        assignments.map(assignment =>
          addPermission(assignment.permissionUid, projectId, assignment.permissionRole)
        )
      );
      res.status(201).end();
    } catch (err) {
      res.status(500).end();
    }
  }
);

export default router;
