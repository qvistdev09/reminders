import { Server } from 'socket.io';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';
import http from 'http';
import { SessionManager } from '../classes/session-manager';
import { s } from 'reminders-shared/socketEvents';

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
      const { socket } = authedSocket;
      socket.on(s.disconnect, () => {
        sessionManager.handleSocketDisconnect(authedSocket);
      });
      socket.on(s.newTask, (taskObj: any) => {
        sessionManager.handleNewTask(authedSocket, taskObj);
      });
      socket.on(s.deleteTask, (taskId: number) => {
        sessionManager.handleTaskDelete(authedSocket, taskId);
      });
      socket.on(s.liveChange, (changeObj: any) => {
        sessionManager.handleLiveChange(authedSocket, changeObj);
      });
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
