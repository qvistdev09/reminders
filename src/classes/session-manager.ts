import randomColor from 'randomcolor';
import { Server, Socket } from 'socket.io';
import {
  LiveUser,
  SocketEvent,
  AuthedSocketObj,
  Session,
  LiveUserPublicIdentity,
  SocketStatus,
  TaskLiveModel,
} from '../types/index';
import { Task } from '../database/root';
import { e } from '../web-socket/events';

const createPublicUserList = (users: LiveUser[]): LiveUserPublicIdentity[] => {
  return users.map(
    user =>
      <LiveUserPublicIdentity>{
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.permissionRole,
        color: user.color,
        uid: user.uid,
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

  makeId(array: any[], idKey: string) {
    return array.length < 1
      ? 0
      : array.map(item => item[idKey]).reduce((acc, curr) => (acc > curr ? acc : curr)) + 1;
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
      uid: client.uid,
    };

    this.emitToSocket(socket, e.identity, newPublicIdentity);

    const matchedSession = this.findSession(projectId);
    if (matchedSession) {
      const existingUser = matchedSession.users.find(user => user.uid === client.uid);
      if (existingUser) {
        existingUser.socket = client.socket;
      } else {
        matchedSession.users.push(newLiveUser);
      }
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
    this.emitNewUserlist(projectId);
  }

  handleSocketDisconnect(client: AuthedSocketObj) {
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      matchedSession.users = matchedSession.users.filter(user => user.uid !== client.uid);
      this.emitNewUserlist(client.projectId);
    }
  }

  handleNewTask(client: AuthedSocketObj, newTask: any) {
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const { taskLabel } = newTask;
      Task.create({ taskLabel, taskFinished: false, projectId: client.projectId }).then(createdTask => {
        const newTaskObj: TaskLiveModel = {
          taskLabel,
          taskFinished: false,
          taskId: createdTask.taskId as number,
        };
        matchedSession.tasks.push(newTaskObj);
        this.emitToRoom(client.projectId.toString(), e.taskList, matchedSession.tasks);
      });
    }
  }

  handleTaskDelete(client: AuthedSocketObj, taskId: number) {
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      Task.findOne({ where: { taskId } }).then(foundTask => {
        if (foundTask) {
          foundTask.destroy().then(() => {
            matchedSession.tasks = matchedSession.tasks.filter(task => task.taskId !== taskId);
            this.emitToRoom(client.projectId.toString(), e.taskList, matchedSession.tasks);
          });
        }
      });
    }
  }

  handleLiveChange(client: AuthedSocketObj, changeObj: any) {
    console.log('performing live change')
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const { taskId, string } = changeObj;
      const matchedTask = matchedSession.tasks.find(task => task.taskId === taskId);
      if (matchedTask) {
        matchedTask.taskLabel = string;
        this.emitToRoom(client.projectId.toString(), e.taskList, matchedSession.tasks);
      }
    }
  }
}

export { SessionManager };
