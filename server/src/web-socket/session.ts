import { PktLiveChange, PktTaskIdentifier, PktTaskLabel, TaskLiveModel } from 'reminders-shared/sharedTypes';
import { io } from './web-socket';
import { s } from 'reminders-shared/socketEvents';
import { Socket } from 'socket.io';
import { AuthorizedEntry } from '../types';
import { Task } from '../database/root';

class Session {
  tasks: TaskLiveModel[];
  projectId: number;
  room: string;

  constructor(projectId: number, tasks: TaskLiveModel[]) {
    this.tasks = tasks;
    this.projectId = projectId;
    this.room = projectId.toString();
  }

  emitTasks() {
    io.to(this.room).emit(s.taskList, this.tasks);
  }

  findTask(taskId: number) {
    return this.tasks.find(task => task.taskId === taskId);
  }

  filterInEditByArray(task: TaskLiveModel, uid: string) {
    task.inEditBy = task.inEditBy.filter(prevUid => prevUid !== uid);
  }

  addToInEditByArray(task: TaskLiveModel, uid: string) {
    if (!task.inEditBy.includes(uid)) {
      task.inEditBy.push(uid);
    }
  }

  stopUserEditOnAllTasks(uid: string) {
    this.tasks.forEach(task => {
      this.filterInEditByArray(task, uid);
    });
    this.emitTasks();
  }

  giveClientSessionTasks(client: Socket) {
    client.emit(s.taskList, this.tasks);
  }

  changeEditStatus(client: AuthorizedEntry, packet: PktTaskIdentifier, operation: 'add' | 'remove') {
    if (client.permissionRole === 'viewer') {
      return;
    }
    const matchedTask = this.findTask(packet.taskId);
    if (!matchedTask) {
      return;
    }
    if (operation === 'remove') {
      this.filterInEditByArray(matchedTask, client.userObj.uid);
    } else {
      this.addToInEditByArray(matchedTask, client.userObj.uid);
    }
    this.emitTasks();
  }

  addTask(projectId: number, packet: PktTaskLabel) {
    const { taskLabel } = packet;
    Task.create({ taskLabel, taskFinished: false, projectId }).then(createdTask => {
      const newTaskObj: TaskLiveModel = {
        taskLabel,
        taskFinished: false,
        taskId: createdTask.taskId as number,
        inEditBy: [],
      };
      this.tasks.push(newTaskObj);
      this.emitTasks();
    });
  }

  removeTask(packet: PktTaskIdentifier) {
    const { taskId } = packet;
    Task.findOne({ where: { taskId } }).then(foundTask => {
      if (foundTask) {
        foundTask.destroy().then(() => {
          this.tasks = this.tasks.filter(task => task.taskId !== taskId);
          this.emitTasks();
        });
      }
    });
  }

  liveChange(packet: PktLiveChange) {
    const { taskId, taskLabel } = packet;
    const matchedTask = this.findTask(taskId);
    if (matchedTask) {
      matchedTask.taskLabel = taskLabel;
      this.emitTasks();
    }
  }
}

export { Session };