import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAccessToken } from './use-access-token';
import { server } from '../config/websocket-server';
import { Socket } from 'socket.io-client';
import { SocketStatus, TaskLiveModel, LiveUserPublicIdentity } from 'reminders-shared/sharedTypes';
import { s } from 'reminders-shared/socketEvents';

const useLiveEdit = (projectid: string) => {
  const client = useRef<Socket>();
  const accessToken = useAccessToken();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>({
    authenticated: false,
    role: null,
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

  const submitNewTask = (taskLabel: string) => {
    if (client.current) {
      client.current.emit(s.newTask, { taskLabel });
    }
  };

  const deleteTask = (taskId: number) => {
    if (client.current) {
      client.current.emit(s.deleteTask, taskId);
    }
  };

  const liveChange = (taskId: number, string: string) => {
    if (client.current) {
      client.current.emit(s.liveChange, { taskId, string });
    }
  };

  const session = {
    tasks,
    users,
  };

  const taskActions = {
    liveChange,
    deleteTask,
  };

  return {
    socketStatus,
    session,
    submitNewTask,
    taskActions,
  };
};

export { useLiveEdit };
