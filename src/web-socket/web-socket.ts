import { Server } from 'socket.io';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';
import http from 'http';
import { SessionManager } from '../classes/session-manager';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const sessionManager = new SessionManager(io);

io.on('connection', socket => {
  console.log('Connect');
  const { authorization, projectid } = socket.handshake.headers;
  if (!authorization || !projectid || typeof authorization !== 'string' || typeof projectid !== 'string') {
    return socket.disconnect();
  }
  authenticateAndAuthorizeSocket(authorization, projectid, socket)
    .then(authedSocket => {
      sessionManager.handleUserConnect(authedSocket);
      const { socket } = authedSocket;
      socket.on('disconnect', () => {
        sessionManager.handleSocketDisconnect(authedSocket);
      });
      socket.on('newTask', (taskObj: any) => {
        sessionManager.handleNewTask(authedSocket, taskObj);
      });
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
