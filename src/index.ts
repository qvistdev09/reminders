import express from 'express';
import path from 'path';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Testing the API - compiled from typescript' });
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
