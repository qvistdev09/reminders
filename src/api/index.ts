import express, { Response } from 'express';
import { authRequired } from '../middleware/auth-required';
import RequestJwt from '../types/request-jwt';

const router = express.Router();

router.get('/users', (req: RequestJwt, res: Response) => {
  res.json({ message: 'This end point will show an array of users' });
});

router.get('/secret', authRequired, (req: RequestJwt, res: Response) => {
  res.json({ message: 'You reached path that requires auth' });
});

router.use((req: RequestJwt, res: Response) => {
  res.status(404).json({ error: 'Not found ' });
});

export default router;
