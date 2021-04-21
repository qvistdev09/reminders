import { Server } from 'socket.io';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';
import http from 'http';
import { SessionManager } from '../classes/session-manager';
import { s } from 'reminders-shared/socketEvents';
import {
  PktLiveChange,
  PktProjectIdentifier,
  PktTaskIdentifier,
  PktTaskLabel,
} from 'reminders-shared/sharedTypes';

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
      socket.on(s.submitNewTask, (packet: PktTaskLabel) => {
        sessionManager.handleNewTask(authedSocket, packet);
      });
      socket.on(s.deleteTask, (packet: PktTaskIdentifier) => {
        sessionManager.handleTaskDelete(authedSocket, packet);
      });
      socket.on(s.liveChange, (packet: PktLiveChange) => {
        sessionManager.handleLiveChange(authedSocket, packet);
      });
      socket.on(s.taskEditStart, (packet: PktTaskIdentifier) => {
        sessionManager.handleEditStatusChange(authedSocket, packet, 'add');
      });
      socket.on(s.taskEditStop, (packet: PktTaskIdentifier) => {
        sessionManager.handleEditStatusChange(authedSocket, packet, 'remove');
      });
      socket.on(s.stopUserEdit, (packet: PktProjectIdentifier) => {
        sessionManager.handleUserStopEdit(authedSocket, packet);
      });
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
