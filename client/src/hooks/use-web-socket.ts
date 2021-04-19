import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAccessToken } from './use-access-token';
import { server } from '../config/websocket-server';
import { Socket } from 'socket.io-client';
import { SocketStatus, TaskLiveModel } from '../../../src/types/index';
import { e } from '../shared-socket-events/shared-socket-events';

const useWebSocket = (projectid: string) => {
  const client = useRef<Socket>();
  const accessToken = useAccessToken();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>({
    authenticated: false,
    role: null,
  });
  const [tasks, setTasks] = useState<TaskLiveModel[]>([]);

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
      socket.on(e.taskList, (tasks: TaskLiveModel[]) => setTasks(tasks));
    }
  }, [accessToken, projectid]);

  return {
    socketStatus,
    tasks,
  };
};

export { useWebSocket };
