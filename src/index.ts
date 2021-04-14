import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Response } from 'express';
import path from 'path';
import helmet from 'helmet';

// types
import RequestJwt from './types/request-jwt';

// classes
import { ControlledError } from './classes/controlled-error';

// database
import { sequelize, authenticateDb } from './config/db-config';
authenticateDb();

// routes
import api from './api';

const app = express();

app.use(helmet());

app.use('/api', api);

app.use(express.static(path.resolve(__dirname, '../client/build')));

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
