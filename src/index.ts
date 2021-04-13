import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import RequestJwt from './types/request-jwt';
import { ControlledError } from './classes/controlled-error';
import { authRequired } from './middleware/auth-required';
import { sequelize, authenticateDb } from './config/db-config';
authenticateDb();

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api', (req: RequestJwt, res: Response) => {
  res.json({ message: 'Testing the API - compiled from typescript' });
});

app.get('/secret', authRequired, (req: RequestJwt, res: Response) => {
  res.json({ message: 'You reached path that requires auth' });
});

app.use((req: RequestJwt, res: Response, next: NextFunction) => {
  const notFoundError = new ControlledError('Not found', 404);
  next(notFoundError);
});

app.use((err: any, req: RequestJwt, res: Response, next: NextFunction) => {
  if (err instanceof ControlledError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Server error' });
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
