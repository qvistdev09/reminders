import randomColor from 'randomcolor';
import { Server, Socket } from 'socket.io';
import { LiveUserPublicIdentity, SocketStatus, TaskLiveModel } from 'reminders-shared/sharedTypes';
import { LiveUser, AuthedSocketObj, Session } from '../types';
import { Task } from '../database/root';
import { s } from 'reminders-shared/socketEvents';

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

  findSession(projectId: number) {
    return this.sessions.find(session => session.projectId === projectId);
  }

  emitNewUserlist(projectId: number) {
    const session = this.findSession(projectId);
    if (session) {
      this.io.to(projectId.toString()).emit(s.newUserList, createPublicUserList(session.users));
    }
  }

  giveClientSessionTasks(client: Socket, projectId: number) {
    const session = this.findSession(projectId);
    if (session) {
      client.emit(s.taskList, session.tasks);
    }
  }

  handleUserConnect(client: AuthedSocketObj) {
    const { socket, projectId } = client;
    const authResponse: SocketStatus = {
      authenticated: true,
      role: client.permissionRole,
    };
    socket.emit(s.authResponse, authResponse);

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

    socket.emit(s.identity, newPublicIdentity);

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
        this.io.to(client.projectId.toString()).emit(s.taskList, matchedSession.tasks);
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
            this.io.to(client.projectId.toString()).emit(s.taskList, matchedSession.tasks);
          });
        }
      });
    }
  }

  handleLiveChange(client: AuthedSocketObj, changeObj: any) {
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const { taskId, string } = changeObj;
      const matchedTask = matchedSession.tasks.find(task => task.taskId === taskId);
      if (matchedTask) {
        matchedTask.taskLabel = string;
        this.io.to(client.projectId.toString()).emit(s.taskList, matchedSession.tasks);
      }
    }
  }
}

export { SessionManager };
