import randomColor from 'randomcolor';
import { Server, Socket } from 'socket.io';
import {
  LiveUserPublicIdentity,
  PktLiveChange,
  PktProjectIdentifier,
  PktTaskIdentifier,
  PktTaskLabel,
  SocketStatus,
  TaskLiveModel,
} from 'reminders-shared/sharedTypes';
import { LiveUser, Session, AuthorizedEntry, Connection } from '../types';
import { Task } from '../database/root';
import { s } from 'reminders-shared/socketEvents';

const createPublicUserList = (users: LiveUser[]): LiveUserPublicIdentity[] => {
  return users.map(
    user =>
      <LiveUserPublicIdentity>{
        fullName: `${user.userObj.firstName} ${user.userObj.lastName}`,
        color: user.color,
        uid: user.userObj.uid,
      }
  );
};

class SessionManager {
  users: LiveUser[];
  sessions: Session[];
  io: Server;

  constructor(io: Server) {
    this.users = [];
    this.sessions = [];
    this.io = io;
  }

  findSession(projectId: number) {
    return this.sessions.find(session => session.projectId === projectId);
  }

  findUser(uid: string) {
    return this.users.find(user => user.userObj.uid === uid);
  }

  findTask(taskId: number, session: Session) {
    return session.tasks.find(task => task.taskId === taskId);
  }

  filterInEditByArray(task: TaskLiveModel, uid: string) {
    task.inEditBy = task.inEditBy.filter(prevUid => prevUid !== uid);
  }

  addToInEditByArray(task: TaskLiveModel, uid: string) {
    if (!task.inEditBy.includes(uid)) {
      task.inEditBy.push(uid);
    }
  }

  emitSessionTasks(session: Session) {
    const { projectId } = session;
    this.io.to(projectId.toString()).emit(s.taskList, session.tasks);
  }

  getUsersInProject(projectId: number) {
    const activeUsers = this.users.filter(user => {
      const matchedConnection = user.connections.find(connection => connection.projectId === projectId);
      if (matchedConnection) {
        return true;
      }
      return false;
    });
    return activeUsers;
  }

  emitNewUserlist(projectId: number) {
    const session = this.findSession(projectId);
    if (session) {
      const users = this.getUsersInProject(projectId);
      const publicList = createPublicUserList(users);
      this.io.to(projectId.toString()).emit(s.newUserList, publicList);
    }
  }

  giveClientSessionTasks(client: Socket, projectId: number) {
    const session = this.findSession(projectId);
    if (session) {
      client.emit(s.taskList, session.tasks);
    }
  }

  createSessionIfNeeded(projectId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const matchedSession = this.findSession(projectId);
      if (matchedSession) {
        return resolve();
      }
      console.log('Retrieving database entries to create new session');
      const retrievedTasks = Task.findAll({ where: { projectId } })
        .then(dbTasks => {
          const tasks: TaskLiveModel[] = dbTasks.map(dbEntry => ({
            taskLabel: dbEntry.taskLabel,
            taskId: dbEntry.taskId as number,
            taskFinished: dbEntry.taskFinished,
            inEditBy: [],
          }));
          const session: Session = {
            tasks,
            projectId,
          };
          this.sessions.push(session);
          resolve();
        })
        .catch(() => reject());
    });
  }

  destroySessionIfNeeded(projectId: number) {
    const matchedSession = this.findSession(projectId);
    if (matchedSession) {
      const activeUsers = this.getUsersInProject(projectId);
      if (activeUsers.length === 0) {
        console.log('destroying session with no users');
        this.sessions = this.sessions.filter(session => session.projectId !== projectId);
      }
    }
  }

  handleUserConnect(newEntry: AuthorizedEntry) {
    this.createSessionIfNeeded(newEntry.projectId).then(() => {
      const newConnection: Connection = {
        socket: newEntry.socket,
        permissionRole: newEntry.permissionRole,
        projectId: newEntry.projectId,
      };
      newConnection.socket.join(newConnection.projectId.toString());
      const existingUser = this.findUser(newEntry.userObj.uid);
      if (existingUser) {
        existingUser.connections.push(newConnection);
      } else {
        const newLiveUser: LiveUser = {
          userObj: newEntry.userObj,
          color: randomColor(),
          connections: [newConnection],
        };
        this.users.push(newLiveUser);
      }
      this.emitNewUserlist(newConnection.projectId);
      this.giveClientSessionTasks(newConnection.socket, newConnection.projectId);
      const authResponse: SocketStatus = {
        authenticated: true,
        role: newEntry.permissionRole,
        uid: newEntry.userObj.uid,
      };
      newEntry.socket.emit(s.authResponse, authResponse);
    });
  }

  handleSocketDisconnect(client: AuthorizedEntry) {
    const { uid } = client.userObj;
    const matchedUser = this.findUser(uid);
    if (matchedUser) {
      matchedUser.connections = matchedUser.connections.filter(connection => {
        return connection.socket.id !== client.socket.id;
      });
      if (matchedUser.connections.length === 0) {
        this.emitNewUserlist(client.projectId);
      }
      this.destroySessionIfNeeded(client.projectId);
    }
  }

  handleNewTask(client: AuthorizedEntry, packet: PktTaskLabel) {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const { taskLabel } = packet;
      Task.create({ taskLabel, taskFinished: false, projectId: client.projectId }).then(createdTask => {
        const newTaskObj: TaskLiveModel = {
          taskLabel,
          taskFinished: false,
          taskId: createdTask.taskId as number,
          inEditBy: [],
        };
        matchedSession.tasks.push(newTaskObj);
        this.io.to(client.projectId.toString()).emit(s.taskList, matchedSession.tasks);
      });
    }
  }

  handleTaskDelete(client: AuthorizedEntry, packet: PktTaskIdentifier) {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const { taskId } = packet;
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

  handleLiveChange(client: AuthorizedEntry, packet: PktLiveChange) {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const { taskId, taskLabel } = packet;
      const matchedTask = matchedSession.tasks.find(task => task.taskId === taskId);
      if (matchedTask) {
        matchedTask.taskLabel = taskLabel;
        this.io.to(client.projectId.toString()).emit(s.taskList, matchedSession.tasks);
      }
    }
  }

  handleEditStatusChange(client: AuthorizedEntry, packet: PktTaskIdentifier, operation: 'add' | 'remove') {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.findSession(client.projectId);
    if (matchedSession) {
      const matchedTask = this.findTask(packet.taskId, matchedSession);
      if (!matchedTask) {
        return;
      }
      if (operation === 'remove') {
        this.filterInEditByArray(matchedTask, client.userObj.uid);
      } else {
        this.addToInEditByArray(matchedTask, client.userObj.uid);
      }
      this.emitSessionTasks(matchedSession);
    }
  }

  handleUserStopEdit(client: AuthorizedEntry, packet: PktProjectIdentifier) {
    const matchedSession = this.findSession(packet.projectId);
    if (matchedSession) {
      matchedSession.tasks.forEach(task => {
        // commit changes if there were any
        this.filterInEditByArray(task, client.userObj.uid);
      });
      this.emitSessionTasks(matchedSession);
    }
  }
}

export { SessionManager };
