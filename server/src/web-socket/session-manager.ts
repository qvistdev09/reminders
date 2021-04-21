import { TaskLiveModel } from 'reminders-shared/sharedTypes';
import { Task } from '../database/root';
import { Session } from './session';

class SessionManager {
  sessions: Session[];

  constructor() {
    this.sessions = [];
  }

  findSession(projectId: number) {
    return this.sessions.find(session => session.projectId === projectId);
  }

  createSessionIfNeeded(projectId: number): Promise<Session> {
    return new Promise((resolve, reject) => {
      const matchedSession = this.findSession(projectId);
      if (matchedSession) {
        return resolve(matchedSession);
      }
      Task.findAll({ where: { projectId } })
        .then(dbTasks => {
          const tasks: TaskLiveModel[] = dbTasks.map(dbEntry => ({
            taskLabel: dbEntry.taskLabel,
            taskId: dbEntry.taskId as number,
            taskFinished: dbEntry.taskFinished,
            inEditBy: [],
          }));
          const session = new Session(projectId, tasks);
          this.sessions.push(session);
          resolve(session);
        })
        .catch(() => reject());
    });
  }

  destroySession(projectId: number) {
    const matchedSession = this.findSession(projectId);
    if (matchedSession) {
      this.sessions = this.sessions.filter(session => session.projectId !== projectId);
    }
  }
}

export { SessionManager };
