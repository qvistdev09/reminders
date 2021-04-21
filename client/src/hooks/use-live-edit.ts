import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAccessToken } from './use-access-token';
import { server } from '../config/websocket-server';
import { Socket } from 'socket.io-client';
import {
  SocketStatus,
  TaskLiveModel,
  LiveUserPublicIdentity,
  PktTaskLabel,
  PktTaskIdentifier,
  PktLiveChange,
  PktTaskStatus,
} from 'reminders-shared/sharedTypes';
import { s } from 'reminders-shared/socketEvents';

let taskLastEdited: number | null = null;

const useLiveEdit = (projectid: string) => {
  const client = useRef<Socket>();
  const accessToken = useAccessToken();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>({
    authenticated: false,
    role: null,
    uid: null,
  });
  const [tasks, setTasks] = useState<TaskLiveModel[]>([]);
  const [users, setUsers] = useState<LiveUserPublicIdentity[]>([]);

  useEffect(() => {
    if (accessToken) {
      client.current = io(server, {
        extraHeaders: {
          authorization: `Bearer ${accessToken}`,
          projectid,
        },
      });
      const socket = client.current;
      socket.on(s.authResponse, (authResponse: SocketStatus) => {
        setSocketStatus(authResponse);
      });
      socket.on(s.taskList, (tasks: TaskLiveModel[]) => {
        setTasks(tasks);
      });
      socket.on(s.newUserList, (users: LiveUserPublicIdentity[]) => setUsers(users));
    }

    return () => {
      if (client.current) {
        client.current.close();
      }
    };
  }, [accessToken, projectid]);

  const taskActions = {
    [s.submitNewTask]: (packet: PktTaskLabel) => {
      client.current?.emit(s.submitNewTask, packet);
    },
    [s.deleteTask]: (packet: PktTaskIdentifier) => {
      client.current?.emit(s.deleteTask, packet);
    },
    [s.liveChange]: (packet: PktLiveChange) => {
      taskLastEdited = packet.taskId;
      client.current?.emit(s.liveChange, packet);
    },
    [s.taskEditStart]: (packet: PktTaskIdentifier) => {
      taskLastEdited = packet.taskId;
      client.current?.emit(s.taskEditStart, packet);
    },
    [s.taskEditStop]: (packet: PktTaskIdentifier) => {
      client.current?.emit(s.taskEditStop, packet);
    },
    [s.stopUserEdit]: () => {
      if (taskLastEdited) {
        const packet: PktTaskIdentifier = {
          taskId: taskLastEdited,
        };
        return client.current?.emit(s.stopUserEdit, packet);
      }
      client.current?.emit(s.stopUserEdit);
    },
    [s.setTaskStatus]: (packet: PktTaskStatus) => {
      client.current?.emit(s.setTaskStatus, packet);
    },
  };

  const session = {
    tasks,
    users,
  };

  return {
    socketStatus,
    session,
    taskActions,
  };
};

export { useLiveEdit };
