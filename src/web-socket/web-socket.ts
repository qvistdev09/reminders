import { Server } from 'socket.io';
import { app } from '../express-main/app';
import http from 'http';

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket => {
  socket.emit('hello', 'I see you there!');
});

export { httpServer };
