import express, { NextFunction, Request, Response } from 'express';
import { authRequired } from '../../middleware/auth-required';
import { userIsOwner } from '../services/projects-service';
import { handlePermissionChange } from '../services/permissions-service';
import { validatePermissions } from '../validation/permissions-validation';

const router = express.Router();

router.post('/', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.jwt.claims;
  try {
    const validationResult = await validatePermissions(req.body);
    const { assignments, projectId } = validationResult;
    await userIsOwner(uid, projectId);
    await Promise.all(
      assignments.map(assignment =>
        handlePermissionChange(assignment.permissionUid, projectId, assignment.permissionRole)
      )
    );
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

export default router;
