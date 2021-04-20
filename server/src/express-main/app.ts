import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { appCSPsettings } from '../config/helmet-config';
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

app.use(express.static(path.resolve(__dirname, '../../../client/build')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../../client/build/index.html'));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ControlledError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Server error' });
});

export { app };
