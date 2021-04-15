import express, { Response } from 'express';
import { authRequired } from '../middleware/auth-required';
import RequestJwt from '../types/request-jwt';

import users from './routes/users';
import projects from './routes/projects';

const router = express.Router();

router.use(express.json());

router.use('/users', users);
router.use('/projects', projects);

router.get('/secret', authRequired, (req: RequestJwt, res: Response) => {
  res.json({ message: 'You reached path that requires auth' });
});

router.use((req: RequestJwt, res: Response) => {
  res.status(404).json({ error: 'Not found ' });
});

export default router;
