import { io } from 'socket.io-client';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useAccessToken } from './use-access-token';
import { server } from '../config/websocket-server';
import { Socket } from 'socket.io-client';
import { SocketStatus, TaskLiveModel, LiveUserPublicIdentity } from '../../../src/types/index';
import { e } from '../shared-socket-events/shared-socket-events';

const useWebSocket = (projectid: string) => {
  const client = useRef<Socket>();
  const accessToken = useAccessToken();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>({
    authenticated: false,
    role: null,
  });
  const [tasks, setTasks] = useState<TaskLiveModel[]>([]);
  const [users, setUsers] = useState<LiveUserPublicIdentity[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (accessToken) {
      client.current = io(server, {
        extraHeaders: {
          authorization: `Bearer ${accessToken}`,
          projectid,
        },
      });
      const socket = client.current;
      socket.on(e.authResponse, (authResponse: SocketStatus) => {
        setSocketStatus(authResponse);
      });
      socket.on(e.taskList, (tasks: TaskLiveModel[]) => {
        console.log(tasks);
        setTasks(tasks);
      });
      socket.on(e.newUserList, (users: LiveUserPublicIdentity[]) => setUsers(users));
    }

    return () => {
      if (client.current) {
        client.current.close();
      }
    };
  }, [accessToken, projectid]);

  const updateTask = (e: SyntheticEvent) => {
    if (e.target instanceof HTMLInputElement) {
      setNewTask(e.target.value);
    }
  };

  const submitNewTask = (e: SyntheticEvent) => {
    e.preventDefault();
    if (client.current) {
      console.log('will submit');
      client.current.emit('newTask', { taskLabel: newTask });
      setNewTask('');
    }
  };

  return {
    socketStatus,
    tasks,
    users,
    newTask,
    updateTask,
    submitNewTask,
  };
};

export { useWebSocket };
