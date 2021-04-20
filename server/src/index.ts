import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { httpServer } from './web-socket/web-socket';
import { authAndSyncDatabase } from './database/root';

authAndSyncDatabase();

const port: number = parseInt(process.env.PORT as string, 10);
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
