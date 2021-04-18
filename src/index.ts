import * as dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import express, { NextFunction, Response } from 'express';
import path from 'path';
import { appCSPsettings } from './config/helmet-config';

// custom types
import RequestJwt from './types/request-jwt';

// classes
import { ControlledError } from './classes/controlled-error';

// database
import { authAndSyncDatabase } from './database/root';

authAndSyncDatabase();

// routes
import api from './api';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: appCSPsettings,
    },
  })
);

app.use('/api', api);

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', (req: RequestJwt, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
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

const port: number = parseInt(process.env.PORT as string, 10);
app.listen(port, () => console.log(`App is listening on port ${port}`));
