import { AuthorizedEntry, Connection, LiveUser } from '../types';
import randomColor from 'randomcolor';
import { LiveUserPublicIdentity } from 'reminders-shared/sharedTypes';
import { io } from './web-socket';
import { s } from 'reminders-shared/socketEvents';

class UserManager {
  users: LiveUser[];

  constructor() {
    this.users = [];
  }

  convertUsersToPublicList = (users: LiveUser[]): LiveUserPublicIdentity[] => {
    return users.map(
      user =>
        <LiveUserPublicIdentity>{
          fullName: `${user.userObj.firstName} ${user.userObj.lastName}`,
          color: user.color,
          uid: user.userObj.uid,
        }
    );
  };

  findUser(uid: string) {
    return this.users.find(user => user.userObj.uid === uid);
  }

  getUsersInSession(projectId: number) {
    const activeUsers = this.users.filter(user => {
      const matchedConnection = user.connections.find(connection => connection.projectId === projectId);
      if (matchedConnection) {
        return true;
      }
      return false;
    });
    return activeUsers;
  }

  emitUserList(projectId: number) {
    const activeUsers = this.getUsersInSession(projectId);
    const publicList = this.convertUsersToPublicList(activeUsers);
    io.to(projectId.toString()).emit(s.newUserList, publicList);
  }

  addUser(newEntry: AuthorizedEntry) {
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
    this.emitUserList(newConnection.projectId);
  }

  removeConnection(client: AuthorizedEntry) {
    const { uid } = client.userObj;
    const matchedUser = this.findUser(uid);
    if (matchedUser) {
      matchedUser.connections = matchedUser.connections.filter(connection => {
        return connection.socket.id !== client.socket.id;
      });
      if (matchedUser.connections.length === 0) {
        this.emitUserList(client.projectId);
      }
    }
  }
}

export { UserManager };
