import http from 'http';
import {
  PktLiveChange,
  PktTaskIdentifier,
  PktTaskLabel,
} from 'reminders-shared/sharedTypes';
import { s } from 'reminders-shared/socketEvents';
import { Server } from 'socket.io';
import { LiveEditManager } from './live-edit-manager';
import { app } from '../express-main/app';
import { authenticateAndAuthorizeSocket } from '../middleware/auth-socket';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const liveEditManager = new LiveEditManager();

io.on('connection', socket => {
  const { authorization, projectid } = socket.handshake.headers;
  if (!authorization || !projectid || typeof authorization !== 'string' || typeof projectid !== 'string') {
    return socket.disconnect();
  }
  authenticateAndAuthorizeSocket(authorization, projectid, socket)
    .then(newEntry => {
      liveEditManager.handleUserConnect(newEntry);
      const { socket } = newEntry;
      socket.on(s.disconnect, () => {
        liveEditManager.handleDisconnect(newEntry);
      });
      socket.on(s.submitNewTask, (packet: PktTaskLabel) => {
        liveEditManager.handleNewTask(newEntry, packet);
      });
      socket.on(s.deleteTask, (packet: PktTaskIdentifier) => {
        liveEditManager.handleTaskDelete(newEntry, packet);
      });
      socket.on(s.liveChange, (packet: PktLiveChange) => {
        liveEditManager.handleLiveChange(newEntry, packet);
      });
      socket.on(s.taskEditStart, (packet: PktTaskIdentifier) => {
        liveEditManager.handleEditStatusChange(newEntry, packet, 'add');
      });
      socket.on(s.taskEditStop, (packet: PktTaskIdentifier) => {
        liveEditManager.handleEditStatusChange(newEntry, packet, 'remove');
      });
      socket.on(s.stopUserEdit, () => {
        liveEditManager.handleEditStop(newEntry);
      });
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer, io };
