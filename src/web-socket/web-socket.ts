import { Server } from 'socket.io';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';
import http from 'http';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket => {
  const { authorization, projectid } = socket.handshake.headers;
  if (!authorization || !projectid || typeof authorization !== 'string' || typeof projectid !== 'string') {
    return socket.disconnect();
  }
  authenticateAndAuthorizeSocket(authorization, projectid)
    .then(authedSocket => {
      socket.emit(
        'hello',
        `Your first name is ${authedSocket.firstName} and your role in this project is ${authedSocket.permissionRole}`
      );
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
