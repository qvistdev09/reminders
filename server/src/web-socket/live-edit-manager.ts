import { PktLiveChange, PktTaskIdentifier, PktTaskLabel, SocketStatus } from 'reminders-shared/sharedTypes';
import { s } from 'reminders-shared/socketEvents';
import { AuthorizedEntry } from '../types';
import { SessionManager } from './session-manager';
import { UserManager } from './user-manager';

class LiveEditManager {
  sessionManager: SessionManager;
  userManager: UserManager;

  constructor() {
    this.sessionManager = new SessionManager();
    this.userManager = new UserManager();
  }

  handleUserConnect(newEntry: AuthorizedEntry) {
    this.sessionManager.createSessionIfNeeded(newEntry.projectId).then(session => {
      this.userManager.addUser(newEntry);
      session.giveClientSessionTasks(newEntry.socket);
      const authResponse: SocketStatus = {
        authenticated: true,
        role: newEntry.permissionRole,
        uid: newEntry.userObj.uid,
      };
      newEntry.socket.emit(s.authResponse, authResponse);
    });
  }

  handleDisconnect(client: AuthorizedEntry) {
    this.userManager.removeConnection(client);
    const remainingInSession = this.userManager.getUsersInSession(client.projectId).length;
    if (remainingInSession === 0) {
      this.sessionManager.destroySession(client.projectId);
    }
  }

  handleNewTask(client: AuthorizedEntry, packet: PktTaskLabel) {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.sessionManager.findSession(client.projectId);
    if (matchedSession) {
      matchedSession.addTask(client.projectId, packet);
    }
  }

  handleTaskDelete(client: AuthorizedEntry, packet: PktTaskIdentifier) {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.sessionManager.findSession(client.projectId);
    if (matchedSession) {
      matchedSession.removeTask(packet);
    }
  }

  handleLiveChange(client: AuthorizedEntry, packet: PktLiveChange) {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.sessionManager.findSession(client.projectId);
    if (matchedSession) {
      matchedSession.liveChange(packet);
    }
  }

  handleEditStatusChange(client: AuthorizedEntry, packet: PktTaskIdentifier, operation: 'add' | 'remove') {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedSession = this.sessionManager.findSession(client.projectId);
    if (matchedSession) {
      matchedSession.changeEditStatus(client, packet, operation);
    }
  }

  handleEditStop(client: AuthorizedEntry) {
    const matchedSession = this.sessionManager.findSession(client.projectId);
    if (matchedSession) {
      matchedSession.stopUserEditOnAllTasks(client.userObj.uid);
    }
  }
}

export { LiveEditManager };
