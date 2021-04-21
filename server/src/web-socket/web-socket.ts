import http from 'http';
import {
  PktLiveChange,
  PktProjectIdentifier,
  PktTaskIdentifier,
  PktTaskLabel,
} from 'reminders-shared/sharedTypes';
import { s } from 'reminders-shared/socketEvents';
import { Server } from 'socket.io';
import { SessionManager } from '../classes/session-manager';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const sessionManager = new SessionManager(io);

io.on('connection', socket => {
  const { authorization, projectid } = socket.handshake.headers;
  if (!authorization || !projectid || typeof authorization !== 'string' || typeof projectid !== 'string') {
    return socket.disconnect();
  }
  authenticateAndAuthorizeSocket(authorization, projectid, socket)
    .then(newEntry => {
      sessionManager.handleUserConnect(newEntry);
      const { socket } = newEntry;
      socket.on(s.disconnect, () => {
        sessionManager.handleSocketDisconnect(newEntry);
      });
      socket.on(s.submitNewTask, (packet: PktTaskLabel) => {
        sessionManager.handleNewTask(newEntry, packet);
      });
      socket.on(s.deleteTask, (packet: PktTaskIdentifier) => {
        sessionManager.handleTaskDelete(newEntry, packet);
      });
      socket.on(s.liveChange, (packet: PktLiveChange) => {
        sessionManager.handleLiveChange(newEntry, packet);
      });
      socket.on(s.taskEditStart, (packet: PktTaskIdentifier) => {
        sessionManager.handleEditStatusChange(newEntry, packet, 'add');
      });
      socket.on(s.taskEditStop, (packet: PktTaskIdentifier) => {
        sessionManager.handleEditStatusChange(newEntry, packet, 'remove');
      });
      socket.on(s.stopUserEdit, (packet: PktProjectIdentifier) => {
        sessionManager.handleUserStopEdit(newEntry, packet);
      });
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
