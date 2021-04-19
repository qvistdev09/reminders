import { Server } from 'socket.io';
import { app } from '../express-main/app';
import { authSocket } from '../middleware/auth-socket';
import http from 'http';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket => {
  const authHeader = socket.handshake.headers.authorization;
  authSocket(authHeader)
    .then(jwt => {
      socket.emit('hello', jwt.claims.sub);
    })
    .catch(() => {
      socket.disconnect();
    });
});

export { httpServer };
