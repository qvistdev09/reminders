import { Server } from 'socket.io';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';
import { SocketStatus } from '../types/index';
import http from 'http';
import { SessionManager } from '../classes/session-manager';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const sessionManager = new SessionManager(io);

io.on('connection', socket => {
  const { authorization, projectid } = socket.handshake.headers;
  if (!authorization || !projectid || typeof authorization !== 'string' || typeof projectid !== 'string') {
    return socket.disconnect();
  }
  authenticateAndAuthorizeSocket(authorization, projectid, socket)
    .then(authedSocket => {
      sessionManager.handleUserConnect(authedSocket);
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
