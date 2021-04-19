import randomColor from 'randomcolor';
import { Server, Socket } from 'socket.io';
import {
  LiveUser,
  SocketEvent,
  AuthedSocketObj,
  Session,
  LiveUserPublicIdentity,
  SocketStatus,
} from '../types/index';
import { e } from '../../client/shared-socket-events/shared-socket-events';

const createPublicUserList = (users: LiveUser[]): LiveUserPublicIdentity[] => {
  return users.map(
    user =>
      <LiveUserPublicIdentity>{
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.permissionRole,
        color: user.color,
      }
  );
};

class SessionManager {
  sessions: Session[];
  io: Server;

  constructor(io: Server) {
    this.sessions = [];
    this.io = io;
  }

  findSession(projectId: number) {
    return this.sessions.find(session => session.projectId === projectId);
  }

  emitToRoom(room: string, event: SocketEvent, ...args: any) {
    this.io.to(room).emit(event, ...args);
  }

  emitToSocket(socket: Socket, event: SocketEvent, ...args: any) {
    socket.emit(event, ...args);
  }

  emitNewUserlist(projectId: number) {
    const session = this.findSession(projectId);
    if (session) {
      this.emitToRoom(projectId.toString(), e.newUserList, createPublicUserList(session.users));
    }
  }

  giveClientSessionTasks(client: Socket, projectId: number) {
    const session = this.findSession(projectId);
    if (session) {
      this.emitToSocket(client, e.taskList, session.tasks);
    }
  }

  handleUserConnect(client: AuthedSocketObj) {
    const { socket, projectId } = client;
    const authResponse: SocketStatus = {
      authenticated: true,
      role: client.permissionRole,
    };
    this.emitToSocket(socket, e.authResponse, authResponse);

    const room = projectId.toString();
    socket.join(room);

    const newLiveUser: LiveUser = {
      ...client,
      color: randomColor(),
    };

    const newPublicIdentity: LiveUserPublicIdentity = {
      fullName: `${client.firstName} ${client.lastName}`,
      role: client.permissionRole,
      color: newLiveUser.color,
    };

    this.emitToSocket(socket, e.identity, newPublicIdentity);

    const matchedSession = this.findSession(projectId);
    if (matchedSession) {
      matchedSession.users.push(newLiveUser);
      this.giveClientSessionTasks(socket, projectId);
      return this.emitNewUserlist(projectId);
    }

    const newSession: Session = {
      users: [newLiveUser],
      projectId,
      tasks: [],
    };
    // populate new session with data from database and send to client

    this.sessions.push(newSession);
  }
}

export { SessionManager };
