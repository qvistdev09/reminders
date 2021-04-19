import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAccessToken } from './use-access-token';
import { server } from '../config/websocket-server';
import { Socket } from 'socket.io-client';

const useWebSocket = () => {
  const client = useRef<Socket>();
  const accessToken = useAccessToken();
  const [serverMessage, setServerMessage] = useState('Nothing from server yet');

  useEffect(() => {
    if (accessToken) {
      client.current = io(server, {
        extraHeaders: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const socket = client.current;
      socket.on('hello', hello => setServerMessage(hello));
      socket.emit('authenticate', { token: accessToken }).on('authenticated', () => {
        socket.on('greeting', message => setServerMessage(message));
      });
    }
  }, [accessToken]);

  return {
    serverMessage,
  };
};

export { useWebSocket };
