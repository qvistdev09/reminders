import express, { Response, Request } from 'express';
import { authRequired } from '../middleware/auth-required';

import users from './routes/users';
import projects from './routes/projects';
import permissions from './routes/permissions';

const router = express.Router();

router.use(express.json());

router.use('/users', users);
router.use('/projects', projects);
router.use('/permissions', permissions);

router.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found ' });
});

export default router;
