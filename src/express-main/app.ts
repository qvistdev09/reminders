import helmet from 'helmet';
import express, { NextFunction, Response } from 'express';
import path from 'path';
import { appCSPsettings } from '../config/helmet-config';
import RequestJwt from '../types/request-jwt';
import { ControlledError } from '../classes/controlled-error';
import api from '../api';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: appCSPsettings,
    },
  })
);

app.use('/api', api);

app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.get('*', (req: RequestJwt, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
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

export { app };
